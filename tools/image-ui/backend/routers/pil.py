from pathlib import Path
from fastapi import APIRouter, HTTPException
from services.brand_config import load_configs, resolve_output_dir

router = APIRouter()

# Règles de cadrage shoe (ref: BERIGHT-CYAN Off-White, canvas 864x1184)
SHOE_CADRAGE = {
    "face": {"axis": "width",  "fill": 0.912, "left": 0.0463, "top": 0.3277},
    "top":  {"axis": "height", "fill": 0.690, "left": 0.3044, "top": 0.1596},
}


def _resolve_image(brand: str, ref: str, filename: str) -> Path:
    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, "Marque introuvable")
    output_dir = resolve_output_dir(configs[brand]["output_dir"])
    path = output_dir / ref / filename
    if not path.exists():
        raise HTTPException(404, f"Image introuvable : {filename}")
    return path


def _infer_shoe_view(filename: str):
    stem = Path(filename).stem.lower()
    if "face" in stem:
        return "face"
    if "top" in stem:
        return "top"
    return None


def _detect_bbox_by_corners(arr):
    """Détecte le fond réel via les 4 coins et retourne le bbox du contenu."""
    import numpy as np
    s = 20
    corners = np.concatenate([
        arr[:s, :s].reshape(-1, 3), arr[:s, -s:].reshape(-1, 3),
        arr[-s:, :s].reshape(-1, 3), arr[-s:, -s:].reshape(-1, 3),
    ])
    bg = np.median(corners, axis=0)
    mask = (np.abs(arr.astype(int) - bg) > 18).any(axis=2)
    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]
    if not len(rows):
        return None
    return int(cols[0]), int(rows[0]), int(cols[-1]), int(rows[-1])


@router.post("/pil/{brand}/{ref}/{filename}/flip")
def pil_flip(brand: str, ref: str, filename: str):
    """Flip horizontal PIL — talon à gauche, pointe à droite."""
    from PIL import Image
    path = _resolve_image(brand, ref, filename)
    img = Image.open(path)
    img.transpose(Image.FLIP_LEFT_RIGHT).save(path)
    return {"ok": True, "action": "flip", "file": filename}


@router.post("/pil/{brand}/{ref}/{filename}/cadrage")
def pil_cadrage(brand: str, ref: str, filename: str):
    """Recentrage PIL. Shoe (1_face/4_top) : applique les règles de framing exactes."""
    import numpy as np
    from PIL import Image

    path = _resolve_image(brand, ref, filename)
    img = Image.open(path).convert("RGB")
    W, H = img.size
    arr = np.array(img)

    bbox = _detect_bbox_by_corners(arr)
    if bbox is None:
        return {"ok": True, "action": "cadrage", "file": filename, "note": "rien à centrer"}

    cmin, rmin, cmax, rmax = bbox
    crop = img.crop((cmin, rmin, cmax + 1, rmax + 1))

    view = _infer_shoe_view(filename)
    canvas = Image.new("RGB", (W, H), (243, 243, 243))

    if view in SHOE_CADRAGE:
        rule = SHOE_CADRAGE[view]
        scale = (W * rule["fill"]) / crop.width if rule["axis"] == "width" else (H * rule["fill"]) / crop.height
        resized = crop.resize((max(1, int(crop.width * scale)), max(1, int(crop.height * scale))), Image.LANCZOS)
        canvas.paste(resized, (int(W * rule["left"]), int(H * rule["top"])))
    else:
        # Garment : resize pour remplir 88% de la hauteur, centré horizontalement, 6% de marge en haut
        target_h = int(H * 0.88)
        scale = target_h / crop.height
        new_w = max(1, int(crop.width * scale))
        new_h = max(1, int(crop.height * scale))
        # Si le produit redimensionné dépasse la largeur, on contrainte sur la largeur
        if new_w > int(W * 0.92):
            scale = (W * 0.92) / crop.width
            new_w = max(1, int(crop.width * scale))
            new_h = max(1, int(crop.height * scale))
        resized = crop.resize((new_w, new_h), Image.LANCZOS)
        x = (W - new_w) // 2
        y = int(H * 0.06)
        canvas.paste(resized, (x, y))

    canvas.save(path)
    return {"ok": True, "action": "cadrage", "view": view, "file": filename}
