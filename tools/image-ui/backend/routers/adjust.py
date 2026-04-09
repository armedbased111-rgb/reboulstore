import asyncio
import json
import os
import sys
import threading
from pathlib import Path
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from models import AdjustRequest
from services.brand_config import load_configs, resolve_output_dir

router = APIRouter()

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent
CLI_PATH = PROJECT_ROOT / "cli"
BRAND_ASSETS_DIR = PROJECT_ROOT / "brand_assets"


async def _run_adjust_handler(image_path: Path, output_dir: Path, ref: str, req: AdjustRequest, request: Request, brand: str = ""):
    """Handler commun pour ajuster une image."""
    if not image_path.exists():
        raise HTTPException(404, f"Image introuvable : {image_path.name}")

    if req.output_filename:
        output_path = output_dir / ref / req.output_filename
        output_path.parent.mkdir(parents=True, exist_ok=True)
    elif req.overwrite:
        output_path = image_path
    else:
        stem = image_path.stem
        output_path = image_path.parent / f"{stem}_adjusted.png"

    ref_path = None
    if req.ref_image:
        # cherche dans campaign/, dossier principal, puis brand_assets/
        for candidate in [
            output_dir / ref / "campaign" / req.ref_image,
            output_dir / ref / req.ref_image,
            BRAND_ASSETS_DIR / brand / req.ref_image,
        ]:
            if candidate.exists():
                ref_path = candidate
                break

    queue: asyncio.Queue = asyncio.Queue()
    loop = asyncio.get_event_loop()

    def run():
        try:
            if str(CLI_PATH) not in sys.path:
                sys.path.insert(0, str(CLI_PATH))
            from commands.images_core import run_adjust as _run_adjust, load_env
            load_env()
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                asyncio.run_coroutine_threadsafe(
                    queue.put({"type": "error", "message": "GEMINI_API_KEY manquante"}), loop
                )
                return

            def progress(evt_type: str, msg: str):
                asyncio.run_coroutine_threadsafe(queue.put({"type": "log", "message": msg}), loop)

            success = _run_adjust(
                api_key=api_key,
                image_path=image_path,
                prompt=req.prompt,
                output_path=output_path,
                ref_path=ref_path,
                use_flash=req.model == "flash",
                use_pro=req.model == "pro",
                progress_callback=progress,
            )
            asyncio.run_coroutine_threadsafe(
                queue.put({"type": "done", "success": success, "output": output_path.name}), loop
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
                    event = await asyncio.wait_for(queue.get(), timeout=120.0)
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


@router.post("/adjust/{brand}/{ref}/{filename}")
async def run_adjust(brand: str, ref: str, filename: str, req: AdjustRequest, request: Request):
    """Ajuste une image produit via Gemini. Cherche dans output_dir puis input_dir."""
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, "Marque introuvable")
    output_dir = resolve_output_dir(configs[brand]["output_dir"])
    input_dir = Path(configs[brand]["input_dir"])
    # Cherche d'abord dans output, puis dans input (photos de shooting)
    image_path = output_dir / ref / filename
    if not image_path.exists():
        image_path = input_dir / ref / filename
    return await _run_adjust_handler(image_path, output_dir, ref, req, request, brand=brand)


@router.post("/adjust/{brand}/{ref}/campaign/{filename}")
async def run_adjust_campaign(brand: str, ref: str, filename: str, req: AdjustRequest, request: Request):
    """Ajuste une image de campagne via Gemini."""
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, "Marque introuvable")
    output_dir = resolve_output_dir(configs[brand]["output_dir"])
    image_path = output_dir / ref / "campaign" / filename
    return await _run_adjust_handler(image_path, output_dir, ref, req, request, brand=brand)
