from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
from services.brand_config import load_configs, resolve_output_dir

router = APIRouter()

BRAND_ASSETS_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent / "brand_assets"
IMAGE_EXTS = {".png", ".jpg", ".jpeg", ".webp"}


@router.get("/assets/{brand}")
def list_brand_assets(brand: str):
    """Liste les fichiers dans brand_assets/{brand}/"""
    folder = BRAND_ASSETS_DIR / brand
    if not folder.exists():
        return []
    return sorted(f.name for f in folder.iterdir() if f.suffix.lower() in IMAGE_EXTS)


@router.get("/assets/{brand}/{filename}")
def serve_brand_asset(brand: str, filename: str):
    """Sert un fichier depuis brand_assets/{brand}/"""
    file_path = BRAND_ASSETS_DIR / brand / filename
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(404, "Asset introuvable")
    return FileResponse(str(file_path))


@router.get("/images/{brand}/{ref}/{filename}")
def serve_image(brand: str, ref: str, filename: str):
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, "Marque introuvable")
    output_dir = resolve_output_dir(configs[brand]["output_dir"])
    file_path = output_dir / ref.replace(":", "_") / filename
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
    file_path = output_dir / ref.replace(":", "_") / "campaign" / filename
    if not file_path.exists() or not file_path.is_file():
        raise HTTPException(404, "Image introuvable")
    return FileResponse(str(file_path))
