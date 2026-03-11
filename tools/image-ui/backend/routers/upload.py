import json
from datetime import datetime
from fastapi import APIRouter, HTTPException
from pathlib import Path
from ..services.brand_config import load_configs, resolve_output_dir
from ..services.ref_status import scan_brand_refs

router = APIRouter()


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
