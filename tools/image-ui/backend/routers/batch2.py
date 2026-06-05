import asyncio
import json
import os
import base64
import time
from pathlib import Path
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from services.brand_config import load_configs, resolve_output_dir
from services.ref_status import _resolve_output_folder

router = APIRouter()

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent
CLI_PATH = PROJECT_ROOT / "cli"

BATCH2_PROMPT = (
    "IMAGE 1 is a color swatch — this is the exact background color to use. "
    "IMAGE 2 is the product. Replace the background of IMAGE 2 with the exact solid color from IMAGE 1. "
    "Keep the product completely unchanged: same position, same size, same colors, same details. "
    "Output only the modified image."
)

IMAGE_NAMES = ["1_face", "2_back", "4_top"]


def _make_f3f3f3_swatch_b64() -> tuple:
    """Génère un carré 200x200 rempli exactement #F3F3F3, retourne (b64, mime)."""
    import io
    from PIL import Image as _PIL
    swatch = _PIL.new("RGB", (200, 200), (243, 243, 243))
    buf = io.BytesIO()
    swatch.save(buf, format="PNG")
    return base64.b64encode(buf.getvalue()).decode(), "image/png"


def _call_gemini_batch2(api_key: str, image_path: Path) -> "Optional[bytes]":
    import sys, requests
    if str(CLI_PATH) not in sys.path:
        sys.path.insert(0, str(CLI_PATH))
    from commands.images_core import encode_image, GEMINI_MODEL, GEMINI_BASE, load_env
    load_env()
    api_key_used = api_key
    img_b64, mime = encode_image(image_path)
    swatch_b64, swatch_mime = _make_f3f3f3_swatch_b64()
    # Swatch en premier → Gemini lit IMAGE 1 = couleur de référence, IMAGE 2 = produit
    parts = [
        {"text": BATCH2_PROMPT},
        {"inline_data": {"mime_type": swatch_mime, "data": swatch_b64}},
        {"inline_data": {"mime_type": mime, "data": img_b64}},
    ]
    body = {
        "contents": [{"parts": parts}],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"], "temperature": 0},
    }
    url = f"{GEMINI_BASE}/{GEMINI_MODEL}:generateContent"
    resp = requests.post(url, headers={"x-goog-api-key": api_key_used, "Content-Type": "application/json"}, json=body, timeout=120)
    resp.raise_for_status()
    for part in resp.json().get("candidates", [{}])[0].get("content", {}).get("parts", []):
        if "inlineData" in part:
            return base64.b64decode(part["inlineData"]["data"])
    return None



def _get_api_key() -> str:
    import sys
    if str(CLI_PATH) not in sys.path:
        sys.path.insert(0, str(CLI_PATH))
    from commands.images_core import load_env
    load_env()
    key = os.environ.get("GEMINI_API_KEY", "")
    if not key:
        raise ValueError("GEMINI_API_KEY introuvable")
    return key


def _find_images(ref_dir: Path) -> list[Path]:
    """Trouve toutes les images PNG du dossier ref (face, back, top, variantes comprises)."""
    if not ref_dir.exists():
        return []
    return sorted([
        f for f in ref_dir.iterdir()
        if f.is_file() and f.suffix.lower() == ".png" and not f.name.startswith(".")
    ])


@router.post("/batch2/{brand}/{ref}/image/{filename}")
async def run_batch2_image(brand: str, ref: str, filename: str, request: Request):
    """Batch 2 sur une seule image."""
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, f"Marque '{brand}' introuvable")
    output_dir = resolve_output_dir(configs[brand]["output_dir"])
    img_path = _resolve_output_folder(output_dir, ref) / filename
    if not img_path.exists():
        raise HTTPException(404, f"Image introuvable : {filename}")
    try:
        api_key = _get_api_key()
    except ValueError as e:
        raise HTTPException(500, str(e))

    async def event_gen():
        yield f"data: {json.dumps({'type': 'log', 'message': f'Batch 2 — {filename}…'})}\n\n"
        try:
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(None, _call_gemini_batch2, api_key, img_path)
            if result:
                img_path.write_bytes(result)
                yield f"data: {json.dumps({'type': 'done', 'success': True, 'ok': 1, 'fail': 0, 'output': f'✓ {filename}'})}\n\n"
            else:
                yield f"data: {json.dumps({'type': 'done', 'success': False, 'ok': 0, 'fail': 1, 'output': f'✗ {filename}'})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'done', 'success': False, 'ok': 0, 'fail': 1, 'output': str(e)})}\n\n"

    return StreamingResponse(event_gen(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@router.post("/batch2/{brand}/{ref}/run")
async def run_batch2_ref(brand: str, ref: str, request: Request):
    """Batch 2 sur une seule ref. SSE."""
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, f"Marque '{brand}' introuvable")

    output_dir = resolve_output_dir(configs[brand]["output_dir"])
    ref_dir = _resolve_output_folder(output_dir, ref)

    try:
        api_key = _get_api_key()
    except ValueError as e:
        raise HTTPException(500, str(e))

    async def event_gen():
        images = _find_images(ref_dir)
        total = len(images)
        yield f"data: {json.dumps({'type': 'log', 'message': f'Batch 2 ref {ref} — {total} image(s)…'})}\n\n"

        ok = 0
        fail = 0
        for i, img_path in enumerate(images):
            if await request.is_disconnected():
                break
            yield f"data: {json.dumps({'type': 'log', 'message': f'[{i+1}/{total}] {img_path.name}…'})}\n\n"
            try:
                loop = asyncio.get_event_loop()
                result = await loop.run_in_executor(None, _call_gemini_batch2, api_key, img_path)
                if result:
                    img_path.write_bytes(result)
                    ok += 1
                    yield f"data: {json.dumps({'type': 'log', 'message': f'  ✓ {img_path.name}'})}\n\n"
                else:
                    fail += 1
                    yield f"data: {json.dumps({'type': 'log', 'message': f'  ✗ {img_path.name} — pas de résultat'})}\n\n"
            except Exception as e:
                fail += 1
                yield f"data: {json.dumps({'type': 'log', 'message': f'  ✗ {img_path.name} — {e}'})}\n\n"
            await asyncio.sleep(2)

        yield f"data: {json.dumps({'type': 'done', 'success': fail == 0, 'ok': ok, 'fail': fail, 'output': f'{ok} image(s) traitée(s)'})}\n\n"

    return StreamingResponse(
        event_gen(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.post("/batch2/{brand}/start")
async def start_batch2(brand: str, request: Request):
    """Génère le fond blanc + ombre sur toutes les images existantes de la marque. SSE."""
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, f"Marque '{brand}' introuvable")

    config = configs[brand]
    output_dir = resolve_output_dir(config["output_dir"])

    try:
        api_key = _get_api_key()
    except ValueError as e:
        raise HTTPException(500, str(e))

    async def event_gen():
        # Collecter toutes les images à traiter
        all_images: list[tuple[str, Path]] = []
        if output_dir.exists():
            for ref_dir in sorted(output_dir.iterdir()):
                if not ref_dir.is_dir() or ref_dir.name.startswith("."):
                    continue
                for img in _find_images(ref_dir):
                    all_images.append((ref_dir.name, img))

        total = len(all_images)
        yield f"data: {json.dumps({'type': 'log', 'message': f'Batch 2 — {total} image(s) à traiter…'})}\n\n"

        if total == 0:
            yield f"data: {json.dumps({'type': 'done', 'ok': 0, 'fail': 0})}\n\n"
            return

        ok = 0
        fail = 0
        for i, (ref_name, img_path) in enumerate(all_images):
            if await request.is_disconnected():
                break

            yield f"data: {json.dumps({'type': 'log', 'message': f'[{i+1}/{total}] {ref_name} / {img_path.name}…'})}\n\n"

            try:
                loop = asyncio.get_event_loop()
                result = await loop.run_in_executor(
                    None, _call_gemini_batch2, api_key, img_path
                )
                if result:
                    img_path.write_bytes(result)
                    ok += 1
                    yield f"data: {json.dumps({'type': 'log', 'message': f'  ✓ {img_path.name}'})}\n\n"
                else:
                    fail += 1
                    yield f"data: {json.dumps({'type': 'log', 'message': f'  ✗ {img_path.name} — pas de résultat'})}\n\n"
            except Exception as e:
                fail += 1
                yield f"data: {json.dumps({'type': 'log', 'message': f'  ✗ {img_path.name} — {e}'})}\n\n"

            # Pause entre les appels
            await asyncio.sleep(3)

        yield f"data: {json.dumps({'type': 'done', 'success': fail == 0, 'ok': ok, 'fail': fail, 'output': f'{ok} image(s) traitée(s)'})}\n\n"

    return StreamingResponse(
        event_gen(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
