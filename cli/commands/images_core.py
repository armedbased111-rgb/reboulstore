"""
Noyau fonctionnel images IA — sans Click ni console.print.
Importable depuis le backend FastAPI et les commandes CLI.
"""
import base64
import os
import random
import time
from pathlib import Path
from typing import Callable, Optional

import requests

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

# ── Constantes prompts ────────────────────────────────────────────────────────

BG = " Plain solid #F3F3F3 light grey background only (no gradients). No props, no text, no extra elements. "
NO_INVENTION = (
    " Do NOT add any badge, logo, patch or hood that is not clearly visible in the source image. "
    "If the garment has no hood, output must have no hood. If it has no visible logo/badge, output must have none. "
    "CRITICAL: do NOT add any badge or patch on the sleeve or shoulder unless it is explicitly visible in the source photo — "
    "even if the brand typically uses one. Reproduce only what is visible, never invent. "
)

PROMPT_FACE = (
    "Single image: one garment only. Front view, flat lay on a flat surface. "
    "Garment alone—no mannequin, no hanger, no body, no person. "
    "The garment must fill most of the frame (same scale as a back-view flat lay). "
    "Sleeves visible; if the source has a hood show it, if it has none do not add one. Natural relaxed drape. "
    "Center the garment both horizontally and vertically in the frame: equal left/right margins, consistent small margin above the waistband and below the hem. "
    "The garment must be perfectly straight: waistband perfectly horizontal, legs vertical, no tilt or rotation. "
    "Soft even lighting; only a very subtle soft shadow directly under the garment. No harsh shadows. "
    "Clean product photography for e-commerce. Output only this one image."
    + NO_INVENTION
    + BG
)
PROMPT_BACK = (
    "Single image: one garment only. Back view, flat lay on a flat surface. "
    "Garment alone—no mannequin, no hanger, no body, no person. "
    "The garment must fill most of the frame (same scale as the front-view flat lay). "
    "Back seams and sleeves visible; if the source has a hood show it, if it has none do not add one. "
    "Center the garment both horizontally and vertically in the frame: equal left/right margins, consistent small margin above the waistband and below the hem. "
    "The garment must be perfectly straight: waistband perfectly horizontal, legs vertical, no tilt or rotation. "
    "Soft even lighting; only a very subtle soft shadow under the garment. No harsh shadows. "
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

GEMINI_MODEL = "gemini-2.5-flash-image"
GEMINI_REF_MODEL = "gemini-3-pro-image-preview"
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
    "Remove harsh shadows; use only a soft, subtle shadow under the garment like IMAGE 2. "
    "Do NOT add any logo, badge, patch or branding that is not clearly visible in IMAGE 1. "
    "If the garment in IMAGE 1 has no badge, the output must have no badge. "
    "Background MUST be plain solid #F3F3F3 (light grey) only. No other color or gradient. "
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
    "Remove harsh or uneven shadows from the original photo; use only a soft, subtle shadow under the garment like IMAGE 2. "
    "COLOR: Preserve the exact garment color from IMAGE 1; no hue or saturation shift. "
    "BACKGROUND: Must be plain solid #F3F3F3 (light grey) only. No other background color or gradient. "
    "TASK: Put the garment from IMAGE 1 into the exact same setup as Image 2 (same flat lay or angle, same crop, #F3F3F3 background, same lighting). "
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
    "FRAMING: Same crop and centering as IMAGE 2. Remove harsh shadows; use only a soft, subtle shadow under the garment. "
    "BACKGROUND: Must be plain solid #F3F3F3 (light grey) only. No other background color or gradient. "
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
    "BACKGROUND: Must be plain solid #F3F3F3 (light grey) only. "
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
    "BACKGROUND: Must be plain solid #F3F3F3 (light grey) only. "
    "OUTPUT: The garment from IMAGE 1 worn by THE SAME PERSON as in IMAGE 3 (identical appearance), in the pose/style of IMAGE 2. One image, no text. "
    "CRITICAL: The person in your output must be the same as in IMAGE 3. Only the pose/angle may change. Garment from IMAGE 1 only."
)

ERRORS_AVOID_DEFAULT = (
    "AVOID: tilted or rotated garment; harsh shadows from the room; wide empty margins; garment too small in frame; "
    "wrong fold or position compared to ref; sleeves or body messy or misaligned; sleeves with diagonal creases or bunching; "
    "outputting a different garment type than IMAGE 1 (e.g. jacket when IMAGE 1 is shorts—always keep the same product as IMAGE 1). "
    "AVOID the floating shadow error: no elongated horizontal shadow at the bottom of the image, detached from the garment (that makes the product look suspended). Remove it. "
    "GOOD: fold and alignment exactly like IMAGE 2 (ref)—garment flat, sleeves perfectly straight and flat (clean rectangle shoulder to cuff), "
    "waistband perfectly horizontal, vertical axis of garment centered in frame; tight crop; one soft contact shadow only directly under the garment edges, no second shadow below."
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
    if seed is not None:
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
    for part in data.get("candidates", [{}])[0].get("content", {}).get("parts", []):
        if "inlineData" in part:
            return base64.standard_b64decode(part["inlineData"]["data"])
    return None


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
    Génère les images (1_face, 2_back, 3_detail_logo) pour un produit.

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

    steps = [
        ("1_face", face_b64, face_mime, PROMPT_FACE, ref_face_b64, ref_face_mime),
        ("3_detail_logo", face_b64, face_mime, PROMPT_DETAIL_LOGO, ref_detail_b64, ref_detail_mime),
    ]
    if back_path:
        back_b64, back_mime = encode_image(back_path)
        steps.insert(1, ("2_back", back_b64, back_mime, PROMPT_BACK, ref_back_b64, ref_back_mime))
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

        if name in ("1_face", "2_back") and errors_guidance_text:
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
                        (output_dir / f"{name}{suffix}.png").write_bytes(out_bytes)
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
