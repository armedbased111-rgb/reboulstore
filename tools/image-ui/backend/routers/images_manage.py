import os
from pathlib import Path
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.brand_config import load_configs, resolve_output_dir

router = APIRouter()


class RenameRequest(BaseModel):
    new_name: str


@router.delete("/manage/{brand}/{ref}/{filename}")
def delete_image(brand: str, ref: str, filename: str):
    """Supprime un fichier image du dossier output du ref."""
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, "Marque introuvable")
    output_dir = resolve_output_dir(configs[brand]["output_dir"])
    image_path = output_dir / ref / filename
    if not image_path.exists():
        raise HTTPException(404, f"Image introuvable : {filename}")
    # Safety: only delete image files
    if image_path.suffix.lower() not in (".png", ".jpg", ".jpeg"):
        raise HTTPException(400, "Seuls les fichiers image peuvent être supprimés")
    os.remove(image_path)
    return {"ok": True, "deleted": filename}


@router.post("/manage/{brand}/{ref}/{filename}/rename")
def rename_image(brand: str, ref: str, filename: str, req: RenameRequest):
    """Renomme un fichier image."""
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, "Marque introuvable")
    output_dir = resolve_output_dir(configs[brand]["output_dir"])
    src = output_dir / ref / filename
    if not src.exists():
        raise HTTPException(404, f"Image introuvable : {filename}")
    new_name = Path(req.new_name).name  # security: no path traversal
    if Path(new_name).suffix.lower() not in (".png", ".jpg", ".jpeg"):
        raise HTTPException(400, "Extension invalide")
    dst = src.parent / new_name
    if dst.exists():
        raise HTTPException(409, f"Un fichier existe déjà : {new_name}")
    os.rename(src, dst)
    return {"ok": True, "old": filename, "new": new_name}
