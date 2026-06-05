import asyncio
import json
import os
from pathlib import Path
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from services.brand_config import load_configs, resolve_output_dir
from services.ref_status import _resolve_output_folder

router = APIRouter()

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent
CLI_PATH = PROJECT_ROOT / "cli"

BATCH3_PROMPT_GARMENT = (
    "Add a soft subtle shadow around the garment edges. "
    "Do not change anything else."
)
BATCH3_PROMPT_SHOE_FACE = (
    "Add only a very subtle soft shadow directly under the sole. No harsh shadows. "
    "Do not change anything else."
)
BATCH3_PROMPT_SHOE_TOP = (
    "Add only a very subtle soft shadow around the shoe edges. No harsh shadows. "
    "Do not change anything else."
)


def _batch3_prompt(image_path: Path, product_type: str) -> str:
    if product_type == "shoe":
        name = image_path.stem.lower()
        if "top" in name:
            return BATCH3_PROMPT_SHOE_TOP
        return BATCH3_PROMPT_SHOE_FACE
    return BATCH3_PROMPT_GARMENT


def _call_gemini_batch3(api_key: str, image_path: Path, product_type: str = "garment") -> "Optional[bytes]":
    import sys
    if str(CLI_PATH) not in sys.path:
        sys.path.insert(0, str(CLI_PATH))
    from commands.images_core import call_gemini, encode_image
    img_b64, mime = encode_image(image_path)
    prompt = _batch3_prompt(image_path, product_type)
    return call_gemini(api_key, img_b64, mime, prompt, use_flash=True)


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
    if not ref_dir.exists():
        return []
    return sorted([
        f for f in ref_dir.iterdir()
        if f.is_file() and f.suffix.lower() == ".png" and not f.name.startswith(".")
    ])


async def _run_batch3(api_key: str, images: list[Path], request: Request, product_type: str = "garment"):
    total = len(images)
    yield f"data: {json.dumps({'type': 'log', 'message': f'Batch 3 — {total} image(s) à traiter… (type: {product_type})'})}\n\n"
    ok = fail = 0
    for i, img_path in enumerate(images):
        if await request.is_disconnected():
            break
        yield f"data: {json.dumps({'type': 'log', 'message': f'[{i+1}/{total}] {img_path.parent.name} / {img_path.name}…'})}\n\n"
        try:
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(None, _call_gemini_batch3, api_key, img_path, product_type)
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


@router.post("/batch3/{brand}/{ref}/image/{filename}")
async def run_batch3_image(brand: str, ref: str, filename: str, request: Request):
    """Batch 3 sur une seule image."""
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, f"Marque '{brand}' introuvable")
    output_dir = resolve_output_dir(configs[brand]["output_dir"])
    img_path = _resolve_output_folder(output_dir, ref) / filename
    if not img_path.exists():
        raise HTTPException(404, f"Image introuvable : {filename}")
    product_type = configs[brand].get("product_type", "garment")
    try:
        api_key = _get_api_key()
    except ValueError as e:
        raise HTTPException(500, str(e))

    async def event_gen():
        yield f"data: {json.dumps({'type': 'log', 'message': f'Batch 3 — {filename}…'})}\n\n"
        try:
            loop = asyncio.get_event_loop()
            result = await loop.run_in_executor(None, _call_gemini_batch3, api_key, img_path, product_type)
            if result:
                img_path.write_bytes(result)
                yield f"data: {json.dumps({'type': 'done', 'success': True, 'ok': 1, 'fail': 0, 'output': f'✓ {filename}'})}\n\n"
            else:
                yield f"data: {json.dumps({'type': 'done', 'success': False, 'ok': 0, 'fail': 1, 'output': f'✗ {filename}'})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'done', 'success': False, 'ok': 0, 'fail': 1, 'output': str(e)})}\n\n"

    return StreamingResponse(event_gen(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@router.post("/batch3/{brand}/{ref}/run")
async def run_batch3_ref(brand: str, ref: str, request: Request):
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, f"Marque '{brand}' introuvable")
    output_dir = resolve_output_dir(configs[brand]["output_dir"])
    ref_dir = _resolve_output_folder(output_dir, ref)
    try:
        api_key = _get_api_key()
    except ValueError as e:
        raise HTTPException(500, str(e))

    product_type = configs[brand].get("product_type", "garment")

    async def event_gen():
        async for chunk in _run_batch3(api_key, _find_images(ref_dir), request, product_type):
            yield chunk

    return StreamingResponse(event_gen(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


@router.post("/batch3/{brand}/start")
async def start_batch3(brand: str, request: Request):
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, f"Marque '{brand}' introuvable")
    output_dir = resolve_output_dir(configs[brand]["output_dir"])
    try:
        api_key = _get_api_key()
    except ValueError as e:
        raise HTTPException(500, str(e))

    all_images = []
    if output_dir.exists():
        for ref_dir in sorted(output_dir.iterdir()):
            if not ref_dir.is_dir() or ref_dir.name.startswith("."):
                continue
            all_images.extend(_find_images(ref_dir))

    product_type = configs[brand].get("product_type", "garment")

    async def event_gen():
        async for chunk in _run_batch3(api_key, all_images, request, product_type):
            yield chunk

    return StreamingResponse(event_gen(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})
