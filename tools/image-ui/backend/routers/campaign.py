import asyncio
import json
import os
import sys
import threading
from datetime import datetime
from pathlib import Path
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse, JSONResponse
from models import CampaignRequest
from services.brand_config import load_configs, resolve_output_dir


router = APIRouter()

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent
CLI_PATH = PROJECT_ROOT / "cli"

CAMPAIGN_SUBDIR = "campaign"


def _campaign_dir(output_dir: Path, ref: str) -> Path:
    return output_dir / ref / CAMPAIGN_SUBDIR


@router.get("/campaign/{brand}/{ref}/list")
def list_campaign_images(brand: str, ref: str):
    """Liste les images de campagne générées pour un ref."""
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, "Marque introuvable")
    output_dir = resolve_output_dir(configs[brand]["output_dir"])
    camp_dir = _campaign_dir(output_dir, ref)
    if not camp_dir.exists():
        return []
    exts = {".png", ".jpg", ".jpeg"}
    images = sorted([
        f.name for f in camp_dir.iterdir()
        if f.is_file() and f.suffix.lower() in exts
    ])
    return images


@router.get("/campaign/{brand}/{ref}/scenes")
def list_scenes():
    """Retourne les presets de scènes disponibles."""
    if str(CLI_PATH) not in sys.path:
        sys.path.insert(0, str(CLI_PATH))
    try:
        from commands.images_core import CAMPAIGN_SCENES
        return [{"key": k, "label": v["label"], "raw_prompt": v.get("raw_prompt", "")} for k, v in CAMPAIGN_SCENES.items()]
    except Exception:
        return [
            {"key": "urban", "label": "Urban"},
            {"key": "marseille", "label": "Marseille"},
            {"key": "nature", "label": "Nature"},
            {"key": "studio", "label": "Studio"},
            {"key": "archive", "label": "Archive"},
        ]


@router.delete("/campaign/{brand}/{ref}/{filename}")
def delete_campaign_image(brand: str, ref: str, filename: str):
    """Supprime une image de campagne."""
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, "Marque introuvable")
    output_dir = resolve_output_dir(configs[brand]["output_dir"])
    img_path = _campaign_dir(output_dir, ref) / filename
    if not img_path.exists():
        raise HTTPException(404, "Image introuvable")
    img_path.unlink()
    return {"ok": True}


@router.post("/campaign/{brand}/{ref}/{filename}/upload-hero")
def upload_campaign_to_hero(brand: str, ref: str, filename: str):
    """Upload une image de campagne sur Cloudinary dans homepage/homepage."""
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, "Marque introuvable")
    output_dir = resolve_output_dir(configs[brand]["output_dir"])
    img_path = _campaign_dir(output_dir, ref) / filename
    if not img_path.exists():
        raise HTTPException(404, "Image introuvable")

    try:
        from dotenv import dotenv_values

        # Les vars Cloudinary sont dans backend/.env (NestJS), pas dans le CLI .env
        backend_env_path = PROJECT_ROOT / "backend" / ".env"
        env_vars = dotenv_values(backend_env_path)

        import cloudinary
        import cloudinary.uploader

        cloudinary.config(
            cloud_name=env_vars.get("CLOUDINARY_CLOUD_NAME", ""),
            api_key=env_vars.get("CLOUDINARY_API_KEY", ""),
            api_secret=env_vars.get("CLOUDINARY_API_SECRET", ""),
        )

        # Toujours écraser le même asset hero → l'URL dans Home.tsx ne change jamais
        public_id = "homepage/homepage/hero"

        result = cloudinary.uploader.upload(
            str(img_path),
            folder=None,
            public_id=public_id,
            overwrite=True,
            invalidate=True,
            resource_type="image",
        )
        return {"ok": True, "url": result["secure_url"], "public_id": result["public_id"]}
    except Exception as e:
        raise HTTPException(500, f"Cloudinary error: {e}")


@router.post("/campaign/{brand}/{ref}/generate")
async def generate_campaign(brand: str, ref: str, req: CampaignRequest, request: Request):
    """Génère une image de campagne via Gemini. Streame les logs en SSE."""
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, "Marque introuvable")

    output_dir = resolve_output_dir(configs[brand]["output_dir"])
    image_path = output_dir / ref / req.source_image
    if not image_path.exists():
        raise HTTPException(404, f"Image source introuvable : {req.source_image}")

    ts = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    scene_slug = req.scene if req.scene != "custom" else "custom"
    output_filename = f"campaign_{scene_slug}_{ts}.png"
    output_path = _campaign_dir(output_dir, ref) / output_filename

    queue: asyncio.Queue = asyncio.Queue()
    loop = asyncio.get_event_loop()

    def run():
        try:
            if str(CLI_PATH) not in sys.path:
                sys.path.insert(0, str(CLI_PATH))
            from commands.images_core import run_campaign as _run_campaign, load_env
            load_env()
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                asyncio.run_coroutine_threadsafe(
                    queue.put({"type": "error", "message": "GEMINI_API_KEY manquante"}), loop
                )
                return

            def progress(evt_type: str, msg: str):
                asyncio.run_coroutine_threadsafe(queue.put({"type": "log", "message": msg}), loop)

            success = _run_campaign(
                api_key=api_key,
                image_path=image_path,
                scene_key=req.scene,
                output_path=output_path,
                custom_prompt=req.custom_prompt,
                use_flash=req.model == "flash",
                progress_callback=progress,
            )
            asyncio.run_coroutine_threadsafe(
                queue.put({
                    "type": "done",
                    "success": success,
                    "output": output_filename if success else None,
                }),
                loop,
            )
        except Exception as e:
            asyncio.run_coroutine_threadsafe(
                queue.put({"type": "error", "message": str(e)}), loop
            )

    threading.Thread(target=run, daemon=True).start()

    async def event_gen():
        try:
            while True:
                if await request.is_disconnected():
                    break
                try:
                    event = await asyncio.wait_for(queue.get(), timeout=180.0)
                    yield f"data: {json.dumps(event)}\n\n"
                    if event.get("type") in ("done", "error"):
                        break
                except asyncio.TimeoutError:
                    yield ": keepalive\n\n"
        except Exception:
            pass

    return StreamingResponse(
        event_gen(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
