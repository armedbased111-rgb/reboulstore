from pathlib import Path
from typing import Literal
from services.brand_config import resolve_output_dir

StatusType = Literal["empty", "needs_generation", "needs_upload", "done"]
PHOTO_EXTS = {'.jpg', '.jpeg', '.png', '.heic', '.HEIC', '.JPG', '.JPEG', '.PNG'}


def get_ref_status(input_dir: Path, output_dir: Path, ref_name: str) -> StatusType:
    input_folder = input_dir / ref_name
    output_folder = output_dir / ref_name

    has_photos = input_folder.exists() and any(
        f for f in input_folder.iterdir()
        if f.is_file() and f.suffix.lower() in {e.lower() for e in PHOTO_EXTS}
    )
    if not has_photos:
        return "empty"

    has_face = output_folder.exists() and any(
        "face" in f.name for f in output_folder.iterdir() if f.is_file()
    )
    has_back = output_folder.exists() and any(
        ("back" in f.name or "top" in f.name) for f in output_folder.iterdir() if f.is_file()
    )
    if not (has_face and has_back):
        return "needs_generation"

    meta_path = output_folder / ".uploaded"
    if not meta_path.exists():
        return "needs_upload"

    return "done"


def count_input_photos(input_dir: Path, ref_name: str) -> int:
    folder = input_dir / ref_name
    if not folder.exists():
        return 0
    return sum(
        1 for f in folder.iterdir()
        if f.is_file() and f.suffix.lower() in {e.lower() for e in PHOTO_EXTS}
    )


def list_input_photos(input_dir: Path, ref_name: str) -> list[str]:
    folder = input_dir / ref_name
    if not folder.exists():
        return []
    return sorted([
        f.name for f in folder.iterdir()
        if f.is_file() and f.suffix.lower() in {e.lower() for e in PHOTO_EXTS}
    ])


def list_output_images(output_folder: Path) -> list[str]:
    if not output_folder.exists():
        return []
    return sorted([
        f.name for f in output_folder.iterdir()
        if f.is_file() and f.suffix.lower() in {'.png', '.jpg', '.jpeg'}
    ])


def scan_brand_refs(brand_config: dict) -> list[dict]:
    from services.db_lookup import get_products_info_batch
    input_dir = Path(brand_config["input_dir"])
    output_dir = resolve_output_dir(brand_config["output_dir"])
    refs = []
    if not input_dir.exists():
        return refs

    subdirs = [d for d in sorted(input_dir.iterdir()) if d.is_dir() and not d.name.startswith(".")]
    folder_names = [d.name for d in subdirs]
    db_info = get_products_info_batch(folder_names)

    for d in subdirs:
        status = get_ref_status(input_dir, output_dir, d.name)
        images = list_output_images(output_dir / d.name)
        photo_count = count_input_photos(input_dir, d.name)
        info = db_info.get(d.name, {})
        refs.append({
            "name": d.name,
            "status": status,
            "images": images,
            "input_photo_count": photo_count,
            "product_name": info.get("name"),
            "category": info.get("category"),
        })
    return refs
