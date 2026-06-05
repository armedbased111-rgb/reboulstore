"""
Noyau fonctionnel images IA — sans Click ni console.print.
Importable depuis le backend FastAPI et les commandes CLI.
"""
import base64
import io
import os
import random
import time
from pathlib import Path
from typing import Callable, Optional

import requests

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

# ── Constantes prompts ────────────────────────────────────────────────────────

BG = " Plain solid #808080 medium grey background only (no gradients). No props, no text, no extra elements. "
NO_INVENTION = (
    " Do NOT add any badge, logo, patch or hood that is not clearly visible in the source image. "
    "If the garment has no hood, output must have no hood. If it has no visible logo/badge, output must have none. "
    "CRITICAL: do NOT add any badge or patch on the sleeve or shoulder unless it is explicitly visible in the source photo — "
    "even if the brand typically uses one. Reproduce only what is visible, never invent. "
)
NO_INVENTION_SHOE = (
    " CRITICAL — reproduce the shoe EXACTLY as shown in the source photo: "
    "do NOT invent, modify or hallucinate any text, letters or markings. "
    "Tongue label: copy only the text and layout that is clearly visible in the source — if you cannot read it clearly, leave the label blank or as a plain patch, never guess. "
    "Sole/midsole text: copy only what is explicitly visible in the source photo — do NOT add 'GAME SET MATCH' or any other text unless it is clearly readable in the input. "
    "Side logos, heel badge, insole print: reproduce only what is visible, never invent details based on brand knowledge. "
)

PROMPT_FACE = (
    "Single image: one garment only. Front view, flat lay on a flat surface. "
    "Garment alone—no mannequin, no hanger, no body, no person. "
    "The garment must fill most of the frame (same scale as a back-view flat lay). "
    "Sleeves visible; if the source has a hood show it, if it has none do not add one. "
    "Garment lying perfectly flat — smooth out physical wrinkles, creases and folds so the fabric looks clean and pressed. PRESERVE the original fabric pattern exactly (stripes, checks, prints, textures) pixel-perfect — do NOT blur, fade or remove any pattern. "
    "Center the garment both horizontally and vertically in the frame: equal left/right margins, consistent small margin above the waistband and below the hem. "
    "The garment must be perfectly straight: waistband perfectly horizontal, legs vertical, no tilt or rotation. "
    "Flat even lighting. NO shadow of any kind. "
    "Clean product photography for e-commerce. Output only this one image."
    + NO_INVENTION
    + BG
)
PROMPT_BACK = (
    "Single image: one garment only. Back view, flat lay on a flat surface. "
    "Garment alone—no mannequin, no hanger, no body, no person. "
    "The garment must fill most of the frame (same scale as the front-view flat lay). "
    "Back seams and sleeves visible; if the source has a hood show it, if it has none do not add one. "
    "Garment lying perfectly flat — smooth out physical wrinkles, creases and folds so the fabric looks clean and pressed. PRESERVE the original fabric pattern exactly (stripes, checks, prints, textures) pixel-perfect — do NOT blur, fade or remove any pattern. "
    "Center the garment both horizontally and vertically in the frame: equal left/right margins, consistent small margin above the waistband and below the hem. "
    "The garment must be perfectly straight: waistband perfectly horizontal, legs vertical, no tilt or rotation. "
    "Flat even lighting. NO shadow of any kind. "
    "Clean product photography for e-commerce. Output only this one image."
    + NO_INVENTION
    + BG
)
PROMPT_DETAIL_LOGO = (
    "Single image: a real person wearing this garment. "
    "Close-up crop: from upper chest to waist only. The garment fills the frame. "
    "Focus on the chest area, fabric, construction details (logo, zipper, seams, pockets). "
    "Do not show the face or head—crop at or below the neck. "
    "Soft even studio lighting. Plain white or light grey background. "
    "Clean product detail shot for e-commerce. Output only this one image."
    + BG
)
PROMPT_LIFESTYLE = (
    "Single image: a real person wearing this garment. "
    "From shoulders down: no head, no face, no hair visible. Crop at the base of the neck. "
    "Show torso, arms, and garment front (hood, kangaroo pocket, hem). Relaxed fit. "
    "Soft even studio lighting. Plain light grey background. "
    "Clean lookbook-style product shot for e-commerce. Output only this one image."
    + BG
)

# ── Prompts chaussure ─────────────────────────────────────────────────────────

PROMPT_FACE_SHOE = (
    "Single image: one sneaker only. Lateral side profile view, full silhouette from heel to toe. "
    "Shoe alone—no foot, no person, no box, no tissue paper, no laces hanging loose. "
    "Sole facing down. The sneaker must fill most of the frame. "
    "Center the shoe horizontally and vertically with equal margins on all sides. "
    "Soft even lighting; only a very subtle soft shadow directly under the sole. No harsh shadows. "
    "Clean e-commerce product photography. Output only this one image."
    + NO_INVENTION_SHOE
    + BG
)
PROMPT_BACK_SHOE = (
    "Single image: one sneaker only. Back view showing the heel, collar and back panel of the shoe. "
    "Shoe alone—no foot, no person, no box. "
    "Sole facing down. The sneaker must fill most of the frame. "
    "Center the shoe horizontally and vertically with equal margins on all sides. "
    "Soft even lighting; only a very subtle soft shadow directly under the sole. No harsh shadows. "
    "Clean e-commerce product photography. Output only this one image."
    + NO_INVENTION_SHOE
    + BG
)
PROMPT_TOP_SHOE = (
    "Single image: one sneaker only. Top-down overhead view (bird's eye view): "
    "looking straight down at the shoe from above, showing laces, tongue, toe box and full top surface. "
    "Shoe alone—no foot, no person, no box. Sole facing down, shoe flat on the surface. "
    "The sneaker must fill most of the frame, perfectly centered. "
    "Soft even lighting; only a very subtle soft shadow under the sole. No harsh shadows. "
    "Clean e-commerce product photography. Output only this one image. "
    "TONGUE LABEL — CRITICAL: copy the tongue label EXACTLY as it appears in the source photo: "
    "same shape, same colors, same text, same logo layout. Do NOT replace it with a different label design. "
    "MIDSOLE TEXT: copy exactly the text visible on the midsole/outsole in the source — do not alter it. "
    + NO_INVENTION_SHOE
    + BG
)

# ── Prompt adjust ─────────────────────────────────────────────────────────────

ADJUST_SYSTEM = (
    "You are an image editor. Your job is to apply ONE small change to the input image. DO NOT redraw, regenerate or replace the garment. "
    "CRITICAL: The garment in the output must be THE SAME as in the input — same type, same color, same view (front or back), same framing. "
    "Change ONLY what the instruction asks (e.g. shadow, fold, lighting, remove a tag). Do not substitute a different product or view. "
    "Apply ONLY this change: {prompt}. "
    "Background must be plain solid #808080 (medium grey) only. "
    "DIMENSIONS: Output image must have the EXACT same width and height in pixels as the input image. Do not crop, resize, zoom in or zoom out. The product must occupy the exact same position and scale in the frame as in the input. "
    "Output only the modified image, no text."
)
ADJUST_SYSTEM_SHOE_BGREMOVE = (
    "You are a product photo editor for e-commerce. {prompt} "
    "DIMENSIONS: Output image must have the EXACT same width and height in pixels as the input image. "
    "Output only the modified image, no text."
)

GEMINI_MODEL = "gemini-3.1-flash-image"
GEMINI_REF_MODEL = "gemini-3-pro-image"
GEMINI_VISION_MODEL = "gemini-2.5-flash"
GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

FLASH_PROMPT_PRODUCT_FIRST = (
    "CRITICAL: The FIRST image (IMAGE 1) is our product—the ONLY garment that must appear in your output. "
    "The SECOND image (IMAGE 2) is STYLE REFERENCE ONLY: use only its framing, crop, positioning, fold, alignment, plain background. "
    "You must NOT copy, draw, or reproduce the garment from IMAGE 2. "
    "IMAGE 1 = our garment (may be on cardboard, floor, storage—remove all that). IMAGE 2 = how to present it (composition, fold, alignment, background). "
    "TASK: Extract the garment from IMAGE 1. Remove cardboard, floor, shelves, feet, text, arrows. "
    "Render it as a clean product image using IMAGE 2's framing, fold and alignment: garment flat, sleeves arranged like IMAGE 2, "
    "waistband perfectly horizontal, vertical axis centered; same crop, same margins. "
    "NO shadow of any kind — no drop shadow, no cast shadow, no shadow under the garment. Flat even lighting. "
    "Smooth out physical wrinkles and creases so the fabric looks clean and pressed. PRESERVE the original fabric pattern exactly (stripes, checks, prints, textures) pixel-perfect — do NOT blur, fade or remove any pattern. "
    "Do NOT add any logo, badge, patch or branding that is not clearly visible in IMAGE 1. "
    "If the garment in IMAGE 1 has no badge, the output must have no badge. "
    "Background MUST be plain solid #808080 (medium grey) only. No other color or gradient. "
    "Preserve exact color from IMAGE 1. No text, no props. CRITICAL: Do not output the garment from IMAGE 2."
)
REFERENCE_PROMPT = (
    "You receive two images in order. "
    "IMAGE 1 = THE PRODUCT TO PHOTOGRAPH (our garment—may be on a hanger, any background). This is the garment that MUST appear in your output. "
    "IMAGE 2 = STYLE REFERENCE ONLY. Use ONLY its composition, framing, fold, alignment, background and lighting. Do NOT copy or draw the garment from Image 2. "
    "Do NOT add any logo, badge, patch or branding that is not clearly visible in IMAGE 1. If IMAGE 1 has no badge, output must have no badge. "
    "FOLD AND ALIGNMENT (critical): Match IMAGE 2 exactly—same way the garment is folded and laid (sleeves, body), waistband perfectly horizontal, "
    "vertical axis of the garment centered in the frame; no tilt, no rotation. "
    "FRAMING: Same crop, same centering, same margins as IMAGE 2. Tight crop; the garment must FILL the frame. "
    "Equal left/right margins, consistent small margin above the waistband and below the hem. "
    "NO shadow of any kind — no drop shadow, no cast shadow, no shadow under the garment. Flat even lighting. "
    "Smooth out physical wrinkles and creases so the fabric looks clean and pressed. PRESERVE the original fabric pattern exactly (stripes, checks, prints, textures) pixel-perfect — do NOT blur, fade or remove any pattern. "
    "COLOR: Preserve the exact garment color from IMAGE 1; no hue or saturation shift. "
    "BACKGROUND: Must be plain solid #808080 (medium grey) only. No other background color or gradient. "
    "TASK: Put the garment from IMAGE 1 into the exact same setup as Image 2 (same flat lay or angle, same crop, #808080 background, same lighting). "
    "OUTPUT: One image showing IMAGE 1's garment only, photographed like Image 2. No text. "
    "CRITICAL: Do not output the garment from Image 2. The output must show only the garment from Image 1."
)
REFERENCE_BACK_WITH_COLOR_FROM_FRONT = (
    "You receive three images. YOUR OUTPUT MUST SHOW ONLY THE GARMENT FROM IMAGE 1 (from behind). "
    "IMAGE 1 = Your TARGET: the product photographed from behind. Same garment type, same view: back. Do NOT draw the garment from IMAGE 2. "
    "IMAGE 2 = Style ONLY: framing, crop, fold, alignment, background. Use IMAGE 2 only for how to frame and lay out the shot. "
    "The product in your output is 100% from IMAGE 1, not from IMAGE 2. "
    "IMAGE 3 = Color reference only. Match the garment color to IMAGE 3 exactly (same hue, saturation). "
    "GARMENT TYPE: If IMAGE 1 shows shorts, output shorts (back view). If IMAGE 1 shows a jacket, output a jacket (back view). "
    "Never substitute a different garment type. "
    "Do NOT add any logo, badge or patch that is not clearly visible in IMAGE 1 or IMAGE 3. "
    "FOLD AND ALIGNMENT: Match IMAGE 2—waistband horizontal, vertical axis centered; no tilt or rotation. "
    "FRAMING: Same crop and centering as IMAGE 2. NO shadow of any kind. Flat even lighting. Smooth out physical wrinkles and creases — PRESERVE fabric pattern (stripes, checks, prints) pixel-perfect. "
    "BACKGROUND: Must be plain solid #808080 (medium grey) only. No other background color or gradient. "
    "OUTPUT: One image = the BACK of the garment in IMAGE 1, color from IMAGE 3. No text. "
    "CRITICAL: Output garment = exactly the product in IMAGE 1 (same type, back view). Never copy the garment from IMAGE 2."
)
MANNEQUIN_PROFILES = (
    "When a person is shown wearing the garment, use exactly one of these model profiles (do not copy the person from the reference); "
    "use the SAME model for both detail and lifestyle views of this garment. "
    "(1) Light skin, athletic build — "
    "(2) Light skin, slim build — "
    "(3) Dark skin, average build — "
    "(4) Olive skin, medium build — "
    "(5) East Asian appearance, slender build. "
    "Use the reference only for pose and style; the garment must always be the one from Image 1. "
    "If the garment is shorts or the model is topless in one view, keep the same in the other (topless in both 3 and 4). "
)
REFERENCE_FROM_SOURCE_OF_TRUTH = (
    "You receive two images in order. "
    "IMAGE 1 = THE EXACT GARMENT (source of truth—the product already generated). This is the garment that MUST appear in your output. "
    "IMAGE 2 = Style reference for this view (framing, pose, background). Use only its composition and style. Do NOT copy or draw the garment from Image 2. "
    "BACKGROUND: Must be plain solid #808080 (medium grey) only. "
    "OUTPUT: The garment from IMAGE 1 only, presented in the style of Image 2 (same color, design, logo, details; only presentation changes: person wearing, crop, angle). "
    "One image, no text. "
    + MANNEQUIN_PROFILES
    + "CRITICAL: Do not output the garment from Image 2. The output must show only the garment from Image 1."
)
LIFESTYLE_SAME_MODEL_PROMPT = (
    "You receive three images in order. "
    "IMAGE 1 = THE EXACT GARMENT (source of truth). This is the garment that MUST appear in your output. "
    "IMAGE 2 = Style reference for pose, framing, background. Use only its composition and style. "
    "IMAGE 3 = THE MODEL who must appear in your output. Same person (same appearance, skin tone, body). "
    "BACKGROUND: Must be plain solid #808080 (medium grey) only. "
    "OUTPUT: The garment from IMAGE 1 worn by THE SAME PERSON as in IMAGE 3 (identical appearance), in the pose/style of IMAGE 2. One image, no text. "
    "CRITICAL: The person in your output must be the same as in IMAGE 3. Only the pose/angle may change. Garment from IMAGE 1 only."
)

ERRORS_AVOID_DEFAULT = (
    "AVOID: tilted or rotated garment; harsh shadows from the room; wide empty margins; garment too small in frame; "
    "wrong fold or position compared to ref; sleeves or body messy or misaligned; sleeves with diagonal creases or bunching; "
    "outputting a different garment type than IMAGE 1 (e.g. jacket when IMAGE 1 is shorts—always keep the same product as IMAGE 1). "
    "GOOD: garment flat, ALL wrinkles and creases smoothed out, sleeves perfectly straight and flat (clean rectangle shoulder to cuff), "
    "waistband perfectly horizontal, vertical axis of garment centered in frame; tight crop. NO shadow anywhere. Fabric pattern (stripes, checks, prints) must be preserved exactly."
)

# ── Utilitaires ───────────────────────────────────────────────────────────────

def load_env():
    """Charge .env et .env.local depuis PROJECT_ROOT."""
    try:
        from dotenv import load_dotenv
        load_dotenv(PROJECT_ROOT / ".env")
        load_dotenv(PROJECT_ROOT / ".env.local")
    except Exception:
        pass


def encode_image(path: Path) -> tuple[str, str]:
    """Encode une image en base64. Retourne (b64, mime_type)."""
    data = path.read_bytes()
    b64 = base64.standard_b64encode(data).decode("ascii")
    suffix = path.suffix.lower()
    mime = "image/jpeg" if suffix in (".jpg", ".jpeg") else "image/png"
    return b64, mime


def find_in_dir(d: Path, *names: str) -> Optional[Path]:
    """Premier fichier trouvé dans d avec un des noms (sans tenir compte de la casse)."""
    if not d.is_dir():
        return None
    for name in names:
        for ext in (".jpg", ".jpeg", ".png"):
            p = d / (name + ext)
            if p.exists():
                return p
    return None


_VIEW_SUBDIRS = {"face": ["face"], "back": ["back"], "detail": ["details", "detail"], "lifestyle": ["lifestyle"]}
_VIEW_FALLBACK_NAMES = {
    "face": ("1_face", "face"),
    "back": ("2_back", "back"),
    "detail": ("3_detail_logo", "3_details_logo", "3-detail"),
    "lifestyle": ("4_lifestyle", "4-lifestyle"),
}


def list_refs_for_view(refs_dir: Path, view_key: str) -> list[Path]:
    """Liste les images ref pour une vue."""
    if not refs_dir.is_dir():
        return []
    exts = (".png", ".jpg", ".jpeg")
    for sub in _VIEW_SUBDIRS.get(view_key, []):
        folder = refs_dir / sub
        if folder.is_dir():
            files = [f for f in folder.iterdir() if f.is_file() and f.suffix.lower() in exts]
            if files:
                return sorted(files, key=lambda p: p.name)
    single = find_in_dir(refs_dir, *_VIEW_FALLBACK_NAMES.get(view_key, ()))
    return [single] if single else []


def pick_one_ref(paths: list[Path]) -> Optional[Path]:
    """Une ref parmi la liste (aléatoire si plusieurs)."""
    if not paths:
        return None
    return random.choice(paths) if len(paths) > 1 else paths[0]


def load_errors_guidance(refs_dir: Path) -> tuple[str, Optional[Path]]:
    """Retourne (texte guidage erreurs, chemin image bad ou None)."""
    errors_dir = refs_dir / "errors"
    text_path = errors_dir / "AVOID.txt"
    text = ERRORS_AVOID_DEFAULT
    if text_path.is_file():
        try:
            text = text_path.read_text(encoding="utf-8").strip()
        except Exception:
            pass
    bad_dir = errors_dir / "bad"
    bad_path = None
    if bad_dir.is_dir():
        exts = (".png", ".jpg", ".jpeg")
        files = [f for f in bad_dir.iterdir() if f.is_file() and f.suffix.lower() in exts]
        if files:
            bad_path = random.choice(files)
    return (text, bad_path)


# ── Appel API Gemini ──────────────────────────────────────────────────────────

def call_gemini(
    api_key: str,
    image_b64: str,
    mime: str,
    prompt: str,
    ref_b64: Optional[str] = None,
    ref_mime: Optional[str] = None,
    use_ref_model: bool = False,
    color_ref_b64: Optional[str] = None,
    color_ref_mime: Optional[str] = None,
    use_variation: bool = False,
    seed: Optional[int] = None,
    model_ref_b64: Optional[str] = None,
    model_ref_mime: Optional[str] = None,
    use_flash: bool = False,
    use_flash_model: bool = False,
    bad_example_b64: Optional[str] = None,
    bad_example_mime: Optional[str] = None,
    temperature: Optional[float] = None,
) -> Optional[bytes]:
    """Appel API Gemini image generation. Retourne les bytes de l'image ou None."""
    if use_flash and ref_b64 and ref_mime and not color_ref_b64 and not model_ref_b64:
        prompt_text = FLASH_PROMPT_PRODUCT_FIRST
    else:
        prompt_text = prompt
    if bad_example_b64 and bad_example_mime:
        prompt_text += (
            " The last image you receive is a BAD example (wrong framing, shadow, fold, position or rotation). "
            "Do NOT output like the last image; match IMAGE 2 instead."
        )
    parts = [{"text": prompt_text}, {"inline_data": {"mime_type": mime, "data": image_b64}}]
    if ref_b64 and ref_mime:
        parts.append({"inline_data": {"mime_type": ref_mime, "data": ref_b64}})
    if color_ref_b64 and color_ref_mime:
        parts.append({"inline_data": {"mime_type": color_ref_mime, "data": color_ref_b64}})
    if model_ref_b64 and model_ref_mime:
        parts.append({"inline_data": {"mime_type": model_ref_mime, "data": model_ref_b64}})
    if bad_example_b64 and bad_example_mime:
        parts.append({"inline_data": {"mime_type": bad_example_mime, "data": bad_example_b64}})
    model = GEMINI_MODEL if (use_flash or use_flash_model) else (
        GEMINI_REF_MODEL if (
            (ref_b64 and ref_mime) or color_ref_b64 or use_ref_model or (model_ref_b64 and model_ref_mime)
        ) else GEMINI_MODEL
    )
    url = f"{GEMINI_BASE}/{model}:generateContent"
    gen_config: dict = {"responseModalities": ["TEXT", "IMAGE"]}
    if temperature is not None:
        gen_config["temperature"] = temperature
    elif seed is not None:
        gen_config["seed"] = seed
        gen_config["temperature"] = 1.0 if use_variation else 0.3
    elif use_variation:
        gen_config["temperature"] = 1.0
        gen_config["seed"] = random.randint(0, 2**31 - 1)
    body = {"contents": [{"parts": parts}], "generationConfig": gen_config}
    resp = requests.post(
        url,
        headers={"x-goog-api-key": api_key, "Content-Type": "application/json"},
        json=body,
        timeout=120,
    )
    resp.raise_for_status()
    data = resp.json()
    candidate = data.get("candidates", [{}])[0]
    for part in candidate.get("content", {}).get("parts", []):
        if "inlineData" in part:
            return base64.standard_b64decode(part["inlineData"]["data"])
    # Log raison du refus si disponible
    finish_reason = candidate.get("finishReason", "")
    text_parts = [p.get("text", "") for p in candidate.get("content", {}).get("parts", []) if "text" in p]
    if finish_reason or text_parts:
        import sys
        print(f"[Gemini no-image] finishReason={finish_reason!r} text={' | '.join(text_parts)[:200]!r}", file=sys.stderr)
    return None


# ── Cadrage PIL shoe (déterministe, après suppression fond Gemini) ────────────

def _pil_cadrage_shoe(img_path: Path, view: str) -> None:
    """Recadre l'image selon les règles exactes de framing par vue shoe.
    Détecte le fond réel via les coins (fonctionne même si Gemini n'a pas remplacé le fond)."""
    import numpy as np
    from PIL import Image

    RULES = {
        "face": {"axis": "width",  "fill": 0.912, "left": 0.0463, "top": 0.3277},
        "top":  {"axis": "height", "fill": 0.690, "left": 0.3044, "top": 0.1596},
    }
    rule = RULES.get(view)
    if rule is None:
        return

    img = Image.open(img_path).convert("RGB")
    W, H = img.size
    arr = np.array(img)

    # Détecte la couleur de fond via les 4 coins (20x20px chacun)
    s = 20
    corners = np.concatenate([
        arr[:s, :s].reshape(-1, 3),
        arr[:s, -s:].reshape(-1, 3),
        arr[-s:, :s].reshape(-1, 3),
        arr[-s:, -s:].reshape(-1, 3),
    ])
    bg_color = np.median(corners, axis=0)

    # Masque : pixels suffisamment différents du fond
    mask = (np.abs(arr.astype(int) - bg_color) > 18).any(axis=2)

    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]
    if not len(rows):
        return

    crop = img.crop((int(cols[0]), int(rows[0]), int(cols[-1]) + 1, int(rows[-1]) + 1))
    scale = (W * rule["fill"]) / crop.width if rule["axis"] == "width" else (H * rule["fill"]) / crop.height
    resized = crop.resize((max(1, int(crop.width * scale)), max(1, int(crop.height * scale))), Image.LANCZOS)

    canvas = Image.new("RGB", (W, H), (243, 243, 243))
    canvas.paste(resized, (int(W * rule["left"]), int(H * rule["top"])))
    canvas.save(img_path)


# ── Normalisation fond PIL (force #F3F3F3 exact après Gemini) ────────────────

def _pil_normalize_bg(img_path: Path, target: tuple = (243, 243, 243), tolerance: int = 30) -> None:
    """Normalise le fond vers #F3F3F3 exact via flood-fill depuis les bords.
    Ne touche que les pixels fond connectés au bord → ne mange jamais le vêtement."""
    import numpy as np
    from PIL import Image
    from collections import deque
    img = Image.open(img_path).convert("RGB")
    arr = np.array(img, dtype=np.uint8)
    H, W = arr.shape[:2]
    s = 15
    corners = np.concatenate([
        arr[:s, :s].reshape(-1, 3), arr[:s, -s:].reshape(-1, 3),
        arr[-s:, :s].reshape(-1, 3), arr[-s:, -s:].reshape(-1, 3),
    ])
    bg = np.median(corners, axis=0)
    candidate = np.abs(arr.astype(int) - bg).max(axis=2) <= tolerance
    visited = np.zeros((H, W), dtype=bool)
    queue = deque()
    for x in range(W):
        for y in (0, H - 1):
            if candidate[y, x] and not visited[y, x]:
                visited[y, x] = True
                queue.append((y, x))
    for y in range(H):
        for x in (0, W - 1):
            if candidate[y, x] and not visited[y, x]:
                visited[y, x] = True
                queue.append((y, x))
    while queue:
        y, x = queue.popleft()
        for dy, dx in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < H and 0 <= nx < W and not visited[ny, nx] and candidate[ny, nx]:
                visited[ny, nx] = True
                queue.append((ny, nx))
    arr[visited] = target
    Image.fromarray(arr).save(img_path)


# ── Génération d'un produit ───────────────────────────────────────────────────

def run_generate_one(
    api_key: str,
    face_path: Path,
    refs_dir: Path,
    output_dir: Path,
    use_flash: bool,
    back_path: Optional[Path] = None,
    delay_after_image: float = 0,
    only_face_back: bool = False,
    flash_attempts: int = 4,
    product_type: str = "garment",
    progress_callback: Optional[Callable[[str, str], None]] = None,
    stop_check: Optional[Callable[[], bool]] = None,
) -> bool:
    """
    Génère les images (garment: 1_face + 2_back / shoe: 1_face + 2_back + 4_top) pour un produit.

    Args:
        progress_callback: callback(event_type, message) pour les logs
        stop_check: callback() → bool, True = arrêter

    Retourne True si au moins une image a été écrite.
    """
    def log(msg: str):
        if progress_callback:
            progress_callback("log", msg)

    def should_stop() -> bool:
        return stop_check is not None and stop_check()

    output_dir.mkdir(parents=True, exist_ok=True)

    ref_face_path = pick_one_ref(list_refs_for_view(refs_dir, "face"))
    ref_back_path = pick_one_ref(list_refs_for_view(refs_dir, "back"))
    ref_detail_path = pick_one_ref(list_refs_for_view(refs_dir, "detail"))

    errors_guidance_text, errors_bad_path = load_errors_guidance(refs_dir)
    errors_bad_b64, errors_bad_mime = (encode_image(errors_bad_path) if errors_bad_path else (None, None))

    face_b64, face_mime = encode_image(face_path)
    ref_face_b64, ref_face_mime = (encode_image(ref_face_path) if ref_face_path else (None, None))
    ref_back_b64, ref_back_mime = (encode_image(ref_back_path) if ref_back_path else (None, None))
    ref_detail_b64, ref_detail_mime = (encode_image(ref_detail_path) if ref_detail_path else (None, None))

    p_face = PROMPT_FACE_SHOE if product_type == "shoe" else PROMPT_FACE
    p_back = PROMPT_BACK_SHOE if product_type == "shoe" else PROMPT_BACK

    if product_type == "shoe":
        # Shoes : 1_face (ADJUST depuis face.jpeg) + 4_top (ADJUST depuis back.jpeg)
        # Pas de génération IA de zéro → anti-hallucination
        top_source_path = back_path if back_path else face_path
        steps = [
            ("1_face_bgremove", None, None, None, None, None),
            ("4_top_bgremove", None, None, None, None, None),
        ]
    else:
        # Garment : génération complète (flat lay lissé, fond propre)
        steps = [("1_face", face_b64, face_mime, p_face, ref_face_b64, ref_face_mime)]
        if back_path:
            back_b64, back_mime = encode_image(back_path)
            steps.append(("2_back", back_b64, back_mime, p_back, ref_back_b64, ref_back_mime))
    if only_face_back:
        steps = [s for s in steps if s[0] in ("1_face", "2_back")]

    use_pro = not use_flash
    max_attempts = 3
    written = 0
    product_seed = random.randint(0, 2**31 - 1)

    for name, img_b64, mime, prompt, r_b64, r_mime in steps:
        if should_stop():
            log("Arrêt demandé")
            break

        # ── Vue face chaussure : Gemini adjust (suppression fond) ────────────
        if name == "1_face_bgremove":
            log("1_face (nettoyage fond Gemini)…")
            face_adj_b64, face_adj_mime = encode_image(face_path)
            face_bg_prompt = ADJUST_SYSTEM_SHOE_BGREMOVE.format(
                prompt=(
                    "Remove all background (paper, tissue paper, table, floor, any surface). "
                    "Place the shoe on a pure white background. "
                    "Lateral side profile view: sole facing down, shoe perfectly centered with equal margins on all sides. "
                    "Apply soft even studio lighting. Add only a very subtle soft shadow directly under the sole — no harsh shadows. "
                    "Preserve ALL shoe details pixel-perfectly: tongue label, midsole text, logo, colors, materials, stitching, sole pattern."
                )
            )
            num_variants = flash_attempts if use_flash else 1
            face_written = 0
            for t in range(num_variants):
                if should_stop():
                    break
                try:
                    out_bytes = call_gemini(
                        api_key, face_adj_b64, face_adj_mime, face_bg_prompt, use_flash=use_flash,
                        temperature=0,
                    )
                    if out_bytes:
                        suffix = f"_{t + 1}" if t > 0 else ""
                        out_path = output_dir / f"1_face{suffix}.png"
                        out_path.write_bytes(out_bytes)
                        # Si Gemini a sorti du paysage (source landscape), convertir en portrait
                        from PIL import Image as _PIL
                        _img = _PIL.open(out_path)
                        if _img.size[0] > _img.size[1]:
                            _pil_cadrage_shoe(out_path, "face")
                        face_written += 1
                        if delay_after_image > 0 and t == 0:
                            time.sleep(delay_after_image)
                except Exception as e:
                    log(f"1_face variant {t+1}: {e}")
            if face_written:
                written += 1
                log(f"1_face — {face_written} variante(s)")
            else:
                log("1_face — pas d'image")
            continue

        # ── Vue top chaussure : Gemini adjust (suppression fond) ─────────────
        if name == "4_top_bgremove":
            log("4_top (nettoyage fond Gemini)…")
            top_b64, top_mime = encode_image(top_source_path)
            bg_prompt = ADJUST_SYSTEM_SHOE_BGREMOVE.format(
                prompt=(
                    "Remove all background (paper, tissue paper, table, floor, any surface). "
                    "Place the shoe on a pure white background. "
                    "Top-down overhead view: shoe perfectly centered with equal margins on all sides. "
                    "Apply soft even studio lighting. Add only a very subtle soft shadow directly under the sole — no harsh shadows. "
                    "Preserve ALL shoe details pixel-perfectly: tongue label, midsole text, logo, colors, materials, stitching, sole pattern."
                )
            )
            num_variants = flash_attempts if use_flash else 1
            top_written = 0
            for t in range(num_variants):
                if should_stop():
                    break
                try:
                    out_bytes = call_gemini(
                        api_key, top_b64, top_mime, bg_prompt, use_flash=use_flash,
                        temperature=0,
                    )
                    if out_bytes:
                        suffix = f"_{t + 1}" if t > 0 else ""
                        (output_dir / f"4_top{suffix}.png").write_bytes(out_bytes)
                        top_written += 1
                        if delay_after_image > 0 and t == 0:
                            time.sleep(delay_after_image)
                except Exception as e:
                    log(f"4_top variant {t+1}: {e}")
            if top_written:
                written += 1
                log(f"4_top — {top_written} variante(s)")
            else:
                log("4_top — pas d'image")
            continue

        # ── Vue face vêtement : Gemini adjust (suppression fond) ──────────────
        if name == "1_face_bgremove_garment":
            log("1_face (nettoyage fond Gemini)…")
            face_adj_b64, face_adj_mime = encode_image(face_path)
            bg_prompt = ADJUST_SYSTEM.format(
                prompt=(
                    "Remove all background (floor, plastic packaging, cardboard, table, any surface or prop). "
                    "Replace with solid #808080 medium grey background. "
                    "Center the garment with equal margins on all sides. "
                    "Smooth all fabric wrinkles and creases — make it look like a freshly ironed flat lay. "
                    "Preserve exactly: logos, prints, text, colors, materials, stitching, labels, badges. "
                    "NO shadow of any kind — no drop shadow, no cast shadow, no shadow under the garment. Flat even lighting."
                )
            )
            num_variants = flash_attempts if use_flash else 1
            face_written = 0
            for t in range(num_variants):
                if should_stop():
                    break
                try:
                    out_bytes = call_gemini(api_key, face_adj_b64, face_adj_mime, bg_prompt, use_flash=use_flash)
                    if out_bytes:
                        suffix = f"_{t + 1}" if t > 0 else ""
                        out_path = output_dir / f"1_face{suffix}.png"
                        out_path.write_bytes(out_bytes)
                        face_written += 1
                        if delay_after_image > 0 and t == 0:
                            time.sleep(delay_after_image)
                except Exception as e:
                    log(f"1_face variant {t+1}: {e}")
            if face_written:
                written += 1
                log(f"1_face — {face_written} variante(s)")
            else:
                log("1_face — pas d'image")
            continue

        # ── Vue back vêtement : Gemini adjust (suppression fond) ─────────────
        if name == "2_back_bgremove_garment":
            log("2_back (nettoyage fond Gemini)…")
            back_adj_b64, back_adj_mime = encode_image(back_path)
            bg_prompt = ADJUST_SYSTEM.format(
                prompt=(
                    "Remove all background (floor, plastic packaging, cardboard, table, any surface or prop). "
                    "Replace with solid #808080 medium grey background. "
                    "Center the garment with equal margins on all sides. "
                    "Smooth all fabric wrinkles and creases — make it look like a freshly ironed flat lay. "
                    "Preserve exactly: logos, prints, text, colors, materials, stitching, labels, badges. "
                    "NO shadow of any kind — no drop shadow, no cast shadow, no shadow under the garment. Flat even lighting."
                )
            )
            num_variants = flash_attempts if use_flash else 1
            back_written = 0
            for t in range(num_variants):
                if should_stop():
                    break
                try:
                    out_bytes = call_gemini(api_key, back_adj_b64, back_adj_mime, bg_prompt, use_flash=use_flash)
                    if out_bytes:
                        suffix = f"_{t + 1}" if t > 0 else ""
                        out_path = output_dir / f"2_back{suffix}.png"
                        out_path.write_bytes(out_bytes)
                        back_written += 1
                        if delay_after_image > 0 and t == 0:
                            time.sleep(delay_after_image)
                except Exception as e:
                    log(f"2_back variant {t+1}: {e}")
            if back_written:
                written += 1
                log(f"2_back — {back_written} variante(s)")
            else:
                log("2_back — pas d'image")
            continue
        # ───────────────────────────────────────────────────────────────────────

        log(f"Génération {name}…")
        pass_color_b64, pass_color_mime = None, None
        pass_model_ref_b64, pass_model_ref_mime = None, None

        if (use_pro or use_flash) and (r_b64 and r_mime):
            prompt_to_use = REFERENCE_PROMPT if (r_b64 and r_mime) else prompt
            pass_r_b64, pass_r_mime, use_ref_model = r_b64, r_mime, True
            if name == "2_back" and (r_b64 and r_mime):
                source_path = output_dir / "1_face.png"
                if source_path.exists():
                    pass_color_b64, pass_color_mime = encode_image(source_path)
                    prompt_to_use = REFERENCE_BACK_WITH_COLOR_FROM_FRONT
                    log("Couleur dos calée sur 1_face")
            elif name == "3_detail_logo" and (r_b64 and r_mime):
                source_path = output_dir / "1_face.png"
                if source_path.exists():
                    img_b64, mime = encode_image(source_path)
                    prompt_to_use = REFERENCE_FROM_SOURCE_OF_TRUTH
            elif name == "4_lifestyle" and (r_b64 and r_mime):
                source_path = output_dir / "1_face.png"
                if source_path.exists():
                    img_b64, mime = encode_image(source_path)
                model_ref_path = output_dir / "3_detail_logo.png"
                if model_ref_path.exists():
                    pass_model_ref_b64, pass_model_ref_mime = encode_image(model_ref_path)
                    prompt_to_use = LIFESTYLE_SAME_MODEL_PROMPT
                else:
                    prompt_to_use = REFERENCE_FROM_SOURCE_OF_TRUTH
        else:
            prompt_to_use = prompt
            pass_r_b64, pass_r_mime, use_ref_model = None, None, False

        if name in ("1_face", "2_back") and errors_guidance_text and pass_r_b64:
            prompt_to_use = prompt_to_use.rstrip() + "\n\n" + errors_guidance_text
        pass_bad_b64 = errors_bad_b64 if name in ("1_face", "2_back") else None
        pass_bad_mime = errors_bad_mime if name in ("1_face", "2_back") else None

        out_bytes = None
        last_valid = None
        num_calls = flash_attempts if use_flash else max_attempts
        saved_any = False

        for attempt in range(num_calls):
            if should_stop():
                break
            try:
                out_bytes = call_gemini(
                    api_key, img_b64, mime, prompt_to_use,
                    ref_b64=pass_r_b64, ref_mime=pass_r_mime, use_ref_model=use_ref_model,
                    color_ref_b64=pass_color_b64, color_ref_mime=pass_color_mime,
                    use_variation=(name in ("3_detail_logo", "4_lifestyle")),
                    seed=product_seed,
                    model_ref_b64=pass_model_ref_b64, model_ref_mime=pass_model_ref_mime,
                    use_flash=use_flash,
                    bad_example_b64=pass_bad_b64,
                    bad_example_mime=pass_bad_mime,
                )
                if out_bytes:
                    last_valid = out_bytes
                    if use_flash:
                        suffix = f"_{attempt + 1}" if attempt > 0 else ""
                        out_path = output_dir / f"{name}{suffix}.png"
                        out_path.write_bytes(out_bytes)
                        saved_any = True
                        if attempt == 0 and delay_after_image > 0:
                            time.sleep(delay_after_image)
                        continue
                    break
            except requests.HTTPError as e:
                if e.response.status_code == 429 and attempt < num_calls - 1:
                    log(f"Rate limit 429, attente 60s…")
                    time.sleep(60)
                    continue
                log(f"Erreur HTTP {e.response.status_code}: {name}")
                break
            except Exception as e:
                log(f"Erreur: {e}")
                break

        if use_flash and saved_any:
            written += 1
            log(f"{name} — {flash_attempts} variante(s) générées")
        elif last_valid:
            (output_dir / f"{name}.png").write_bytes(last_valid)
            written += 1
            log(f"{name} — OK")
        else:
            log(f"{name} — pas d'image après {num_calls} essais")

        if delay_after_image > 0 and written < len(steps) and not should_stop():
            time.sleep(delay_after_image)

    return written > 0


# ── Traitement couleur ────────────────────────────────────────────────────────

def extract_garment_color(image_path: Path) -> tuple:
    """Extrait la couleur moyenne du vêtement (pixels non-fond). Retourne (r, g, b, hex)."""
    try:
        from PIL import Image
        import numpy as np
    except ImportError:
        raise RuntimeError("Pillow et numpy requis : pip install Pillow numpy")
    img = Image.open(image_path).convert("RGB")
    arr = np.array(img, dtype=np.float64)
    mask = (arr[:, :, 0] < 200) & (arr[:, :, 1] < 200) & (arr[:, :, 2] < 200)
    if not mask.any():
        mask = (arr[:, :, 0] < 230) & (arr[:, :, 1] < 230) & (arr[:, :, 2] < 230)
    if not mask.any():
        raise ValueError(f"Aucun pixel vêtement détecté dans {image_path.name}")
    avg = arr[mask].mean(axis=0)
    r, g, b = int(avg[0]), int(avg[1]), int(avg[2])
    return r, g, b, f"#{r:02x}{g:02x}{b:02x}"


def color_transfer(source_path: Path, target_path: Path, output_path: Path) -> dict:
    """Transfert couleur statistique : recale la distribution couleur du vêtement target sur source."""
    try:
        from PIL import Image
        import numpy as np
    except ImportError:
        raise RuntimeError("Pillow et numpy requis : pip install Pillow numpy")
    source = np.array(Image.open(source_path).convert("RGB"), dtype=np.float64)
    target = np.array(Image.open(target_path).convert("RGB"), dtype=np.float64)

    def mask(arr):
        return (arr[:, :, 0] < 200) & (arr[:, :, 1] < 200) & (arr[:, :, 2] < 200)

    s_mask, t_mask = mask(source), mask(target)
    if not s_mask.any() or not t_mask.any():
        raise ValueError("Pixels vêtement introuvables sur source ou target")
    s_avg, s_std = source[s_mask].mean(axis=0), source[s_mask].std(axis=0)
    t_avg, t_std = target[t_mask].mean(axis=0), target[t_mask].std(axis=0)
    t_std[t_std == 0] = 1
    result = target.copy()
    for c in range(3):
        ch = result[:, :, c]
        ch[t_mask] = (ch[t_mask] - t_avg[c]) * (s_std[c] / t_std[c]) + s_avg[c]
    result = np.clip(result, 0, 255).astype(np.uint8)
    Image.fromarray(result).save(output_path)
    r_avg = result[t_mask].mean(axis=0)
    return {
        "source_rgb": (int(s_avg[0]), int(s_avg[1]), int(s_avg[2])),
        "source_hex": f"#{int(s_avg[0]):02x}{int(s_avg[1]):02x}{int(s_avg[2]):02x}",
        "before_rgb": (int(t_avg[0]), int(t_avg[1]), int(t_avg[2])),
        "before_hex": f"#{int(t_avg[0]):02x}{int(t_avg[1]):02x}{int(t_avg[2]):02x}",
        "after_rgb": (int(r_avg[0]), int(r_avg[1]), int(r_avg[2])),
        "after_hex": f"#{int(r_avg[0]):02x}{int(r_avg[1]):02x}{int(r_avg[2]):02x}",
    }


def normalize_background_to_hex(image_path: Path, output_path: Path, target_hex: str = "#F3F3F3", tolerance: int = 45) -> bool:
    """Remplace le fond par target_hex. Retourne True si des pixels ont été modifiés."""
    try:
        from PIL import Image
        import numpy as np
    except ImportError:
        raise RuntimeError("Pillow et numpy requis : pip install Pillow numpy")
    target_hex = target_hex.lstrip("#")
    tr, tg, tb = int(target_hex[0:2], 16), int(target_hex[2:4], 16), int(target_hex[4:6], 16)
    img = Image.open(image_path).convert("RGB")
    arr = np.array(img, dtype=np.int32)
    h, w = arr.shape[0], arr.shape[1]
    band = max(3, min(h, w) // 20)
    border_pixels = []
    if h > band * 2 and w > band * 2:
        border_pixels.append(arr[:band, :, :].reshape(-1, 3))
        border_pixels.append(arr[-band:, :, :].reshape(-1, 3))
        border_pixels.append(arr[band:-band, :band, :].reshape(-1, 3))
        border_pixels.append(arr[band:-band, -band:, :].reshape(-1, 3))
    else:
        border_pixels.append(arr.reshape(-1, 3))
    sample = np.vstack(border_pixels)
    bg = np.median(sample, axis=0).astype(np.int32)
    dist = np.sqrt(np.sum((arr - bg) ** 2, axis=2))
    mask = dist <= tolerance
    out_arr = np.array(img, dtype=np.uint8)
    out_arr[mask, 0], out_arr[mask, 1], out_arr[mask, 2] = tr, tg, tb
    Image.fromarray(out_arr).save(output_path)
    return np.any(mask)


# ── Campaign scenes ───────────────────────────────────────────────────────────

CAMPAIGN_SCENES: dict[str, dict] = {
    # Prompts à construire depuis des références visuelles réelles
    "custom": {
        "label": "Custom",
        "season": "all",
        "desc": "",
    },
    "floating_jacket": {
        "label": "Veste flottante (fond blanc)",
        "season": "all",
        "raw_prompt": (
            "Pure white #FFFFFF background. ZERO shadow — no drop shadow, "
            "no contact shadow, nothing.\n\n"
            "The jacket is OPEN — zipper fully unzipped, both front panels spread "
            "wide apart, jacket open like wings. Hood open and expanded upward. "
            "Both sleeves extended outward naturally, slightly angled.\n\n"
            "The garment floats mid-air, tilted diagonally 20-30 degrees, "
            "as if caught by the wind and suspended in zero gravity.\n\n"
            "The whole jacket must be small enough to leave generous white space "
            "on all 4 sides — jacket occupies maximum 55% of the frame.\n\n"
            "Preserve exact color, badge, textures and all details from the input.\n"
            "No mannequin, no hanger, no person."
        ),
        "desc": "",
    },
    "shoe_flatlay_beach": {
        "label": "Sneaker flat lay — plage SS26",
        "season": "ss26",
        "raw_prompt": (
            "Keep the exact same top-down flat lay view as the input image — "
            "same overhead angle, same framing, shoe fills 60-70% of the frame.\n\n"
            "Replace ONLY the background with a real photorealistic SS26 beach scene "
            "shot from directly above: warm sand with subtle texture, a few small pebbles, "
            "maybe a thin stripe of turquoise shallow water at one edge. "
            "Natural summer sunlight, warm tones, Mediterranean feel.\n\n"
            "The shoe stays perfectly flat, no perspective distortion. "
            "Add a very subtle soft shadow directly underneath the shoe, "
            "consistent with natural overhead sunlight.\n\n"
            "CRITICAL — copy the shoe pixel-perfectly from the input: "
            "every logo, every label, every tag, every text on the tongue/insole/sole/heel "
            "must be IDENTICAL to the reference — do NOT invent, modify or hallucinate any text. "
            "If you cannot read a marking clearly, reproduce the shape faithfully without adding letters. "
            "Preserve exact colors, material textures, stitching, sole pattern and silhouette.\n"
            "No mannequin, no person, no artificial props.\n"
            "Output: square or portrait crop, photorealistic editorial quality."
        ),
        "desc": "",
    },
}

CAMPAIGN_PROMPT = (
    "Photorealistic fashion campaign photograph. Shot on medium format camera (Hasselblad or Phase One). "
    "The input image shows a garment — use it as the exact product reference for color, texture, cut and details. "
    "Generate a single photorealistic image: a real person wearing this exact garment, "
    "photographed by a professional fashion photographer. "
    "The person: stylish, anonymous — head cropped out or turned away, body from shoulders to knees. "
    "Lighting must be physically consistent — same light source illuminates both the person and the environment. "
    "No compositing artifacts. No AI-generated look. The image must be indistinguishable from a real photograph. "
    "Garment details: preserve exact color, fabric texture, logo placement, cut and silhouette from the reference. "
    "Scene: {scene_desc}. "
    "Format: horizontal landscape, full bleed, no borders, no text, no watermarks. "
    "Style reference: Dior, Stone Island, CP Company campaign photography quality."
)



def run_campaign(
    api_key: str,
    image_path: Path,
    scene_key: str,
    output_path: Path,
    custom_prompt: Optional[str] = None,
    use_flash: bool = False,
    progress_callback: Optional[Callable[[str, str], None]] = None,
) -> bool:
    """
    Génère une image de campagne publicitaire à partir d'un produit.

    Args:
        image_path: image source du produit (face ou back)
        scene_key: clé de scène depuis CAMPAIGN_SCENES, ou "custom"
        output_path: chemin de sortie
        custom_prompt: prompt personnalisé (si scene_key == "custom")
        use_flash: utiliser Flash (défaut: Pro)
        progress_callback: callback(event_type, message)

    Retourne True si l'image a été écrite.
    """
    def log(msg: str):
        if progress_callback:
            progress_callback("log", msg)

    image_path = Path(image_path).resolve()
    output_path = Path(output_path).resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Résolution du prompt
    if custom_prompt and custom_prompt.strip():
        prompt_text = custom_prompt.strip()
    else:
        scene = CAMPAIGN_SCENES.get(scene_key, CAMPAIGN_SCENES["custom"])
        if scene.get("raw_prompt"):
            prompt_text = scene["raw_prompt"]
        else:
            prompt_text = CAMPAIGN_PROMPT.format(scene_desc=scene["desc"])

    img_b64, mime = encode_image(image_path)

    log(f"Génération campagne {scene_key} pour {image_path.name}…")
    try:
        out_bytes = call_gemini(
            api_key, img_b64, mime, prompt_text,
            use_ref_model=not use_flash,
            use_flash_model=use_flash,
        )
        if not out_bytes:
            log("Pas d'image dans la réponse Gemini")
            return False
        output_path.write_bytes(out_bytes)
        log(f"OK → {output_path.name}")
        return True
    except requests.HTTPError as e:
        log(f"Erreur HTTP {e.response.status_code}")
        return False
    except Exception as e:
        log(f"Erreur: {e}")
        return False


# ── Adjust une image ──────────────────────────────────────────────────────────

def run_adjust(
    api_key: str,
    image_path: Path,
    prompt: str,
    output_path: Path,
    ref_path: Optional[Path] = None,
    use_flash: bool = False,
    use_pro: bool = True,
    progress_callback: Optional[Callable[[str, str], None]] = None,
) -> bool:
    """
    Ajuste une image avec un prompt. Retourne True si l'image a été écrite.

    Args:
        ref_path: image de référence optionnelle (ex: 1_face pour caler le cadrage)
        use_flash: utiliser Gemini Flash (défaut: non, utilise Pro)
        use_pro: forcer Gemini Pro (défaut: oui)
        progress_callback: callback(event_type, message)
    """
    def log(msg: str):
        if progress_callback:
            progress_callback("log", msg)

    image_path = Path(image_path).resolve()
    output_path = Path(output_path).resolve()
    output_path.parent.mkdir(parents=True, exist_ok=True)

    prompt_text = ADJUST_SYSTEM.format(prompt=prompt)
    ref_b64, ref_mime = None, None
    if ref_path is not None:
        ref_path = Path(ref_path).resolve()
        # Incruster la ref dans un coin du produit → 1 seule image envoyée à Gemini
        # Évite le bug de format quand Gemini reçoit 2 images de tailles différentes
        from PIL import Image as _PIL
        import io as _io
        prod_img = _PIL.open(image_path).convert("RGB")
        ref_img = _PIL.open(ref_path).convert("RGB")
        W, H = prod_img.size
        # Ref : max 22% de la largeur, dans le coin bas-droit
        max_ref_w = int(W * 0.22)
        scale = max_ref_w / ref_img.width
        ref_resized = ref_img.resize(
            (max_ref_w, max(1, int(ref_img.height * scale))), _PIL.LANCZOS
        )
        composite = prod_img.copy()
        margin = int(W * 0.02)
        x = W - ref_resized.width - margin
        y = H - ref_resized.height - margin
        composite.paste(ref_resized, (x, y))
        buf = _io.BytesIO()
        composite.save(buf, format="PNG")
        buf.seek(0)
        import base64 as _b64
        img_b64 = _b64.b64encode(buf.read()).decode()
        mime = "image/png"
        prompt_text = (
            "The image contains the product to modify AND a small reference inset in the bottom-right corner. "
            "Use the inset as the exact visual reference where the instruction mentions a reference. "
            "CRITICAL: your output must NOT include the inset — output only the full product at its original dimensions, without the corner inset. "
            + prompt_text
        )
    else:
        img_b64, mime = encode_image(image_path)

    use_ref_model = (use_pro or bool(ref_b64)) and not use_flash

    log(f"Ajustement : {image_path.name}…")
    try:
        out_bytes = call_gemini(
            api_key, img_b64, mime, prompt_text,
            ref_b64=ref_b64, ref_mime=ref_mime,
            use_ref_model=use_ref_model,
            use_flash_model=use_flash,
        )
        if not out_bytes:
            log("Pas d'image dans la réponse")
            return False
        output_path.write_bytes(out_bytes)
        log(f"OK → {output_path.name}")
        return True
    except requests.HTTPError as e:
        log(f"Erreur HTTP {e.response.status_code}")
        return False
    except Exception as e:
        log(f"Erreur: {e}")
        return False
