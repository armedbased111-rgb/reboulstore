import asyncio
import json
import os
import re
import sys
from datetime import datetime
from pathlib import Path
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from services.brand_config import load_configs, resolve_output_dir
from services.ref_status import scan_brand_refs, list_output_images

router = APIRouter()

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent
CLI_MAIN = PROJECT_ROOT / "cli" / "main.py"
CLI_PYTHON = PROJECT_ROOT / "cli" / "venv" / "bin" / "python3"
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:3001")

def _cli_python() -> str:
    """Retourne le Python du venv CLI s'il existe, sinon sys.executable."""
    return str(CLI_PYTHON) if CLI_PYTHON.exists() else sys.executable

_ANSI_RE = re.compile(r"\x1b\[[0-9;]*[mGKH]")


def _strip_ansi(text: str) -> str:
    return _ANSI_RE.sub("", text)


def mark_uploaded(output_dir: Path, ref: str):
    meta_path = output_dir / ref / ".uploaded"
    meta_path.write_text(json.dumps({"uploaded_at": datetime.utcnow().isoformat()}))


@router.get("/upload/pending")
def get_pending_uploads():
    configs = load_configs()
    pending = []
    for name, config in configs.items():
        refs = scan_brand_refs(config)
        for ref in refs:
            if ref["status"] == "needs_upload":
                pending.append({"brand": name, "ref": ref["name"], "images": ref["images"]})
    return pending


@router.post("/upload/{brand}/{ref}/mark-done")
def mark_ref_done(brand: str, ref: str):
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, "Marque introuvable")
    output_dir = resolve_output_dir(configs[brand]["output_dir"])
    mark_uploaded(output_dir, ref)
    return {"ok": True}


@router.post("/upload/{brand}/{ref}/run")
async def run_upload_ref(brand: str, ref: str, request: Request):
    """Upload réel d'un ref via rcli images upload. Streame les logs en SSE."""
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, "Marque introuvable")
    output_dir = resolve_output_dir(configs[brand]["output_dir"])
    ref_dir = output_dir / ref
    if not ref_dir.exists():
        raise HTTPException(404, f"Dossier ref introuvable : {ref}")

    # ref in DB uses "/" not "-" or ":"
    ref_db = ref.replace("-", "/").replace(":", "/")

    async def event_gen():
        try:
            yield f"data: {json.dumps({'type': 'log', 'message': f'Upload {ref}…'})}\n\n"
            proc = await asyncio.create_subprocess_exec(
                _cli_python(), str(CLI_MAIN), "images", "upload",
                "--ref", ref_db,
                "--dir", str(ref_dir),
                "--backend", BACKEND_URL,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.STDOUT,
                env={**os.environ, "PYTHONUNBUFFERED": "1"},
            )
            async for line in proc.stdout:
                text = _strip_ansi(line.decode(errors="replace").rstrip())
                if text:
                    yield f"data: {json.dumps({'type': 'log', 'message': text})}\n\n"
                if await request.is_disconnected():
                    proc.kill()
                    return
            await proc.wait()
            success = proc.returncode == 0
            if success:
                mark_uploaded(output_dir, ref)
            yield f"data: {json.dumps({'type': 'done', 'success': success, 'ref': ref})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_gen(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.post("/upload/{brand}/wipe-reupload")
async def wipe_and_reupload_brand(brand: str, request: Request):
    """Supprime toutes les images Cloudinary de la marque puis re-uploade tous les refs générés. SSE."""
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, "Marque introuvable")
    output_dir = resolve_output_dir(configs[brand]["output_dir"])

    async def event_gen():
        try:
            # Step 1: wipe all brand images from Cloudinary + DB
            yield f"data: {json.dumps({'type': 'log', 'message': f'Suppression images Cloudinary pour {brand}…'})}\n\n"
            proc = await asyncio.create_subprocess_exec(
                _cli_python(), str(CLI_MAIN), "images", "delete-by-brand",
                "--brand", brand,
                "--backend", BACKEND_URL,
                "-y",
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.STDOUT,
                env={**os.environ, "PYTHONUNBUFFERED": "1"},
            )
            async for line in proc.stdout:
                text = _strip_ansi(line.decode(errors="replace").rstrip())
                if text:
                    yield f"data: {json.dumps({'type': 'log', 'message': text})}\n\n"
            await proc.wait()
            if proc.returncode != 0:
                yield f"data: {json.dumps({'type': 'error', 'message': 'Suppression échouée'})}\n\n"
                return

            # Step 2: upload all refs that have generated images
            refs = scan_brand_refs(configs[brand])
            to_upload = [r for r in refs if r["status"] in ("needs_upload", "done") and r["images"]]
            yield f"data: {json.dumps({'type': 'log', 'message': f'{len(to_upload)} ref(s) à uploader…'})}\n\n"

            ok = 0
            fail = 0
            for i, ref_info in enumerate(to_upload):
                if await request.is_disconnected():
                    break
                ref = ref_info["name"]
                ref_db = ref.replace("-", "/").replace(":", "/")
                ref_dir = output_dir / ref
                yield f"data: {json.dumps({'type': 'upload_start', 'ref': ref, 'index': i + 1, 'total': len(to_upload)})}\n\n"

                proc2 = await asyncio.create_subprocess_exec(
                    _cli_python(), str(CLI_MAIN), "images", "upload",
                    "--ref", ref_db,
                    "--dir", str(ref_dir),
                    "--backend", BACKEND_URL,
                    stdout=asyncio.subprocess.PIPE,
                    stderr=asyncio.subprocess.STDOUT,
                    env={**os.environ, "PYTHONUNBUFFERED": "1"},
                )
                async for line in proc2.stdout:
                    text = _strip_ansi(line.decode(errors="replace").rstrip())
                    if text:
                        yield f"data: {json.dumps({'type': 'log', 'message': text})}\n\n"
                await proc2.wait()
                success = proc2.returncode == 0
                if success:
                    mark_uploaded(output_dir, ref)
                    ok += 1
                else:
                    fail += 1
                yield f"data: {json.dumps({'type': 'upload_done', 'ref': ref, 'success': success})}\n\n"

            yield f"data: {json.dumps({'type': 'done', 'ok': ok, 'fail': fail})}\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"

    return StreamingResponse(
        event_gen(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
