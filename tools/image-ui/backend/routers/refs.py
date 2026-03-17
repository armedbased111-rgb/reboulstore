from fastapi import APIRouter, HTTPException
from pathlib import Path
from ..services.brand_config import load_configs, resolve_output_dir
from ..services.ref_status import scan_brand_refs, get_ref_status, list_output_images, count_input_photos

router = APIRouter()


@router.get("/brands/{name}/refs")
def list_refs(name: str):
    configs = load_configs()
    if name not in configs:
        raise HTTPException(404, f"Marque '{name}' introuvable")
    return scan_brand_refs(configs[name])


@router.get("/brands/{name}/refs/{ref}")
def get_ref(name: str, ref: str):
    configs = load_configs()
    if name not in configs:
        raise HTTPException(404, f"Marque '{name}' introuvable")
    config = configs[name]
    input_dir = Path(config["input_dir"])
    output_dir = resolve_output_dir(config["output_dir"])
    status = get_ref_status(input_dir, output_dir, ref)
    images = list_output_images(output_dir / ref)
    photo_count = count_input_photos(input_dir, ref)
    return {"name": ref, "status": status, "images": images, "input_photo_count": photo_count}
