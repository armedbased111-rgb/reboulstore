from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
from services.brand_config import load_configs, resolve_output_dir

router = APIRouter()


@router.get("/images/{brand}/{ref}/{filename}")
def serve_image(brand: str, ref: str, filename: str):
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, "Marque introuvable")
    output_dir = resolve_output_dir(configs[brand]["output_dir"])
    file_path = output_dir / ref / filename
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(404, "Image introuvable")
    return FileResponse(str(file_path))


@router.get("/images/{brand}/{ref}/input/{filename}")
def serve_input_image(brand: str, ref: str, filename: str):
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, "Marque introuvable")
    input_dir = Path(configs[brand]["input_dir"])
    file_path = input_dir / ref / filename
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(404, "Image introuvable")
    return FileResponse(str(file_path))


@router.get("/images/{brand}/{ref}/campaign/{filename}")
def serve_campaign_image(brand: str, ref: str, filename: str):
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, "Marque introuvable")
    output_dir = resolve_output_dir(configs[brand]["output_dir"])
    file_path = output_dir / ref / "campaign" / filename
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(404, "Image introuvable")
    return FileResponse(str(file_path))
