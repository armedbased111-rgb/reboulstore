"""
Commandes images IA (phase 24.10) – pipeline 1 photo → 3–4 images via API Gemini.
"""
import base64
import json
import os
import random
import shutil
import subprocess
import sys
import time
from pathlib import Path
from typing import Optional

import click
import requests
from rich.console import Console

console = Console()

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

# Règle commune : fond uni #F3F3F3, pas d’invention
BG = " Plain solid #F3F3F3 light grey background only (no gradients). No props, no text, no extra elements. "
NO_INVENTION = " Do NOT add any badge, logo, patch or hood that is not clearly visible in the source image. If the garment has no hood, output must have no hood. If it has no visible logo/badge, output must have none. CRITICAL: do NOT add any badge or patch on the sleeve or shoulder unless it is explicitly visible in the source photo — even if the brand typically uses one. Reproduce only what is visible, never invent. "

# Vue 1 – Face : flat lay, face uniquement, même échelle que le dos
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
# Vue 2 – Dos : flat lay, dos uniquement, même échelle que la face
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
# Vue 3 – Détail : personne porte le vêtement, cadrage serré sur le haut du torse (logo, zip, tissu)
PROMPT_DETAIL_LOGO = (
    "Single image: a real person wearing this garment. "
    "Close-up crop: from upper chest to waist only. The garment fills the frame. "
    "Focus on the chest area, fabric, construction details (logo, zipper, seams, pockets). "
    "Do not show the face or head—crop at or below the neck. "
    "Soft even studio lighting. Plain white or light grey background. "
    "Clean product detail shot for e-commerce. Output only this one image."
    + BG
)
# Vue 4 – Lifestyle : mannequin portant le vêtement, des épaules jusqu’en bas (sans visage)
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
GEMINI_VISION_MODEL = "gemini-2.5-flash"  # Vision + texte (vérif même produit / couleur) — 2.5 plus fiable que 2.0
GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

# Règle : IMAGE 1 = produit (input-dir), IMAGE 2 = ref style (refs/). Ordre API = [prompt, IMAGE 1, IMAGE 2].
# OUTPUT = garment from IMAGE 1 only; cadrage calé sur IMAGE 2.
# Flash : même ordre (produit puis ref), prompt renforcé pour que le modèle ne recopie pas la ref (IMAGE 2).
FLASH_PROMPT_PRODUCT_FIRST = (
    "CRITICAL: The FIRST image (IMAGE 1) is our product—the ONLY garment that must appear in your output. The SECOND image (IMAGE 2) is STYLE REFERENCE ONLY: use only its framing, crop, positioning, fold, alignment, plain background. You must NOT copy, draw, or reproduce the garment from IMAGE 2. "
    "IMAGE 1 = our garment (may be on cardboard, floor, storage—remove all that). IMAGE 2 = how to present it (composition, fold, alignment, background). "
    "TASK: Extract the garment from IMAGE 1. Remove cardboard, floor, shelves, feet, text, arrows. Render it as a clean product image using IMAGE 2's framing, fold and alignment: garment flat, sleeves arranged like IMAGE 2, waistband perfectly horizontal, vertical axis centered; same crop, same margins. Remove harsh shadows; use only a soft, subtle shadow under the garment like IMAGE 2. "
    "Do NOT add any logo, badge, patch or branding that is not clearly visible in IMAGE 1. If the garment in IMAGE 1 has no badge, the output must have no badge. "
    "Background MUST be plain solid #F3F3F3 (light grey) only. No other color or gradient. "
    "Preserve exact color from IMAGE 1. No text, no props. CRITICAL: Do not output the garment from IMAGE 2."
)
REFERENCE_PROMPT = (
    "You receive two images in order. "
    "IMAGE 1 = THE PRODUCT TO PHOTOGRAPH (our garment—may be on a hanger, any background). This is the garment that MUST appear in your output. "
    "IMAGE 2 = STYLE REFERENCE ONLY. Use ONLY its composition, framing, fold, alignment, background and lighting. Do NOT copy or draw the garment from Image 2. "
    "Do NOT add any logo, badge, patch or branding that is not clearly visible in IMAGE 1. If IMAGE 1 has no badge, output must have no badge. "
    "FOLD AND ALIGNMENT (critical): Match IMAGE 2 exactly—same way the garment is folded and laid (sleeves, body), waistband perfectly horizontal, vertical axis of the garment centered in the frame; no tilt, no rotation. "
    "FRAMING: Same crop, same centering, same margins as IMAGE 2. Tight crop; the garment must FILL the frame. Equal left/right margins, consistent small margin above the waistband and below the hem. "
    "Remove harsh or uneven shadows from the original photo; use only a soft, subtle shadow under the garment like IMAGE 2. "
    "COLOR: Preserve the exact garment color from IMAGE 1; no hue or saturation shift. "
    "BACKGROUND: Must be plain solid #F3F3F3 (light grey) only. No other background color or gradient. "
    "TASK: Put the garment from IMAGE 1 into the exact same setup as Image 2 (same flat lay or angle, same crop, #F3F3F3 background, same lighting). "
    "OUTPUT: One image showing IMAGE 1's garment only, photographed like Image 2. No text. "
    "CRITICAL: Do not output the garment from Image 2. The output must show only the garment from Image 1."
)

# Vue dos (2_back) avec 3 images : IMAGE 1 = photo dos, IMAGE 2 = ref style dos, IMAGE 3 = 1_face générée (référence couleur). Couleur du dos = celle de la face.
REFERENCE_BACK_WITH_COLOR_FROM_FRONT = (
    "You receive three images. YOUR OUTPUT MUST SHOW ONLY THE GARMENT FROM IMAGE 1 (from behind). "
    "IMAGE 1 = Your TARGET: the product photographed from behind (e.g. back of shorts, back of jacket—whatever IMAGE 1 shows). Same garment type, same view: back. Do NOT draw the garment from IMAGE 2. "
    "IMAGE 2 = Style ONLY: framing, crop, fold, alignment, background. Use IMAGE 2 only for how to frame and lay out the shot. The product in your output is 100% from IMAGE 1, not from IMAGE 2. "
    "IMAGE 3 = Color reference only. Match the garment color to IMAGE 3 exactly (same hue, saturation). "
    "GARMENT TYPE: If IMAGE 1 shows shorts, output shorts (back view). If IMAGE 1 shows a jacket, output a jacket (back view). Never substitute a different garment type (e.g. never output a jacket when IMAGE 1 shows shorts). "
    "Do NOT add any logo, badge or patch that is not clearly visible in IMAGE 1 or IMAGE 3. "
    "FOLD AND ALIGNMENT: Match IMAGE 2—waistband horizontal, vertical axis centered; no tilt or rotation. "
    "FRAMING: Same crop and centering as IMAGE 2. Remove harsh shadows; use only a soft, subtle shadow under the garment. "
    "BACKGROUND: Must be plain solid #F3F3F3 (light grey) only. No other background color or gradient. "
    "OUTPUT: One image = the BACK of the garment in IMAGE 1, color from IMAGE 3. No text. "
    "CRITICAL: Output garment = exactly the product in IMAGE 1 (same type, back view). Never copy the garment from IMAGE 2."
)

# Vues 3 et 4 : IMAGE 1 = la 1_face déjà générée (source de vérité). IMAGE 2 = ref style (pose, cadrage). Garder le vêtement de l’IMAGE 1, changer uniquement la présentation.
# Profils mannequin prédéfinis (4–5) : le modèle en choisit un, pas la ref. Allège le prompt et assure la diversité.
MANNEQUIN_PROFILES = (
    "When a person is shown wearing the garment, use exactly one of these model profiles (do not copy the person from the reference); use the SAME model for both detail and lifestyle views of this garment. "
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
    "OUTPUT: The garment from IMAGE 1 only, presented in the style of Image 2 (same color, design, logo, details; only presentation changes: person wearing, crop, angle). One image, no text. "
    + MANNEQUIN_PROFILES
    + "CRITICAL: Do not output the garment from Image 2. The output must show only the garment from Image 1."
)

# Vue 4 uniquement quand on a déjà 3_detail_logo : IMAGE 3 = même personne à reproduire (garantit même mannequin 3 et 4).
LIFESTYLE_SAME_MODEL_PROMPT = (
    "You receive three images in order. "
    "IMAGE 1 = THE EXACT GARMENT (source of truth). This is the garment that MUST appear in your output. "
    "IMAGE 2 = Style reference for pose, framing, background. Use only its composition and style. "
    "IMAGE 3 = THE MODEL who must appear in your output. Same person (same appearance, skin tone, body). "
    "BACKGROUND: Must be plain solid #F3F3F3 (light grey) only. "
    "OUTPUT: The garment from IMAGE 1 worn by THE SAME PERSON as in IMAGE 3 (identical appearance), in the pose/style of IMAGE 2. One image, no text. "
    "CRITICAL: The person in your output must be the same as in IMAGE 3. Only the pose/angle may change. Garment from IMAGE 1 only."
)


def _load_env():
    try:
        from dotenv import load_dotenv
        load_dotenv(PROJECT_ROOT / ".env")
        load_dotenv(PROJECT_ROOT / ".env.local")
    except Exception:
        pass


def _encode_image(path: Path) -> tuple[str, str]:
    data = path.read_bytes()
    b64 = base64.standard_b64encode(data).decode("ascii")
    suffix = path.suffix.lower()
    mime = "image/jpeg" if suffix in (".jpg", ".jpeg") else "image/png"
    return b64, mime


def _find_in_dir(d: Path, *names: str) -> Optional[Path]:
    """Premier fichier trouvé dans d avec un des noms (sans tenir compte de la casse)."""
    if not d.is_dir():
        return None
    for name in names:
        for ext in (".jpg", ".jpeg", ".png"):
            p = d / (name + ext)
            if p.exists():
                return p
    return None


# Dossier par vue (Phase 2 multi-ref) : refs/face/, refs/back/, refs/details/, refs/lifestyle/
_VIEW_SUBDIRS = {"face": ["face"], "back": ["back"], "detail": ["details", "detail"], "lifestyle": ["lifestyle"]}
_VIEW_FALLBACK_NAMES = {
    "face": ("1_face", "face"),
    "back": ("2_back", "back"),
    "detail": ("3_detail_logo", "3_details_logo", "3-detail"),
    "lifestyle": ("4_lifestyle", "4-lifestyle"),
}


def _list_refs_for_view(refs_dir: Path, view_key: str) -> list[Path]:
    """Liste les images ref pour une vue : d’abord le sous-dossier (refs/face/, etc.), sinon fallback fichier à la racine."""
    if not refs_dir.is_dir():
        return []
    exts = (".png", ".jpg", ".jpeg")
    for sub in _VIEW_SUBDIRS.get(view_key, []):
        folder = refs_dir / sub
        if folder.is_dir():
            files = [f for f in folder.iterdir() if f.is_file() and f.suffix.lower() in exts]
            if files:
                return sorted(files, key=lambda p: p.name)
    single = _find_in_dir(refs_dir, *_VIEW_FALLBACK_NAMES.get(view_key, ()))
    return [single] if single else []


def _pick_one_ref(paths: list[Path]) -> Optional[Path]:
    """Une ref parmi la liste (aléatoire si plusieurs). Stratégie B : une ref par appel."""
    if not paths:
        return None
    return random.choice(paths) if len(paths) > 1 else paths[0]


# Guidage erreurs pour 1_face / 2_back : refs/errors/AVOID.txt (ou défaut) + optionnel refs/errors/bad/ (image à ne pas reproduire).
ERRORS_AVOID_DEFAULT = (
    "AVOID: tilted or rotated garment; harsh shadows from the room; wide empty margins; garment too small in frame; "
    "wrong fold or position compared to ref; sleeves or body messy or misaligned; sleeves with diagonal creases or bunching; "
    "outputting a different garment type than IMAGE 1 (e.g. jacket when IMAGE 1 is shorts—always keep the same product as IMAGE 1). "
    "AVOID the floating shadow error: no elongated horizontal shadow at the bottom of the image, detached from the garment (that makes the product look suspended). Remove it. "
    "GOOD: fold and alignment exactly like IMAGE 2 (ref)—garment flat, sleeves perfectly straight and flat (clean rectangle shoulder to cuff), "
    "waistband perfectly horizontal, vertical axis of garment centered in frame; tight crop; one soft contact shadow only directly under the garment edges, no second shadow below."
)


def _load_errors_guidance(refs_dir: Path) -> tuple[str, Optional[Path]]:
    """Retourne (texte à ajouter au prompt, chemin vers une image « mauvaise » ou None)."""
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


def _verify_same_garment_type(
    api_key: str,
    input_b64: str,
    input_mime: str,
    output_b64: str,
    output_mime: str,
) -> bool:
    """Vérifie que l'image de sortie montre le même type de vêtement que l'entrée. Retourne True si oui."""
    prompt = (
        "You see two product images. Image 1 = input, Image 2 = edited output. "
        "Do they show the SAME type of garment (e.g. both shorts, both jackets, both shirts)? "
        "Same type and same view (both front or both back) = YES. If one is shorts and the other is jacket/shirt, or view changed, answer NO. Answer only YES or NO."
    )
    parts = [
        {"text": prompt},
        {"inline_data": {"mime_type": input_mime, "data": input_b64}},
        {"inline_data": {"mime_type": output_mime, "data": output_b64}},
    ]
    url = f"{GEMINI_BASE}/{GEMINI_VISION_MODEL}:generateContent"
    body = {"contents": [{"parts": parts}], "generationConfig": {"responseModalities": ["TEXT"]}}
    try:
        resp = requests.post(
            url,
            headers={"x-goog-api-key": api_key, "Content-Type": "application/json"},
            json=body,
            timeout=30,
        )
        resp.raise_for_status()
        text = ""
        for part in resp.json().get("candidates", [{}])[0].get("content", {}).get("parts", []):
            if "text" in part:
                text += part.get("text", "")
        t = text.strip().upper()
        if "NO" in t and ("YES" not in t or t.find("NO") < t.find("YES")):
            return False
        return "YES" in t
    except Exception:
        return True  # En cas d'erreur API, on accepte (ne pas bloquer)


def _verify_color_match(
    api_key: str,
    reference_b64: str,
    reference_mime: str,
    output_b64: str,
    output_mime: str,
) -> bool:
    """Vérifie que la couleur du vêtement en sortie correspond à la référence (ref si --ref, sinon entrée)."""
    prompt = (
        "You see two product images. Image 1 = color reference, Image 2 = edited output. "
        "Does the garment in image 2 have the same color as the garment in image 1 (same hue, same darkness—e.g. both black, both navy)? "
        "Minor lighting differences are OK. If the main fabric color clearly differs (e.g. black vs blue, grey vs green), answer NO. Answer only YES or NO."
    )
    parts = [
        {"text": prompt},
        {"inline_data": {"mime_type": reference_mime, "data": reference_b64}},
        {"inline_data": {"mime_type": output_mime, "data": output_b64}},
    ]
    url = f"{GEMINI_BASE}/{GEMINI_VISION_MODEL}:generateContent"
    body = {"contents": [{"parts": parts}], "generationConfig": {"responseModalities": ["TEXT"]}}
    try:
        resp = requests.post(
            url,
            headers={"x-goog-api-key": api_key, "Content-Type": "application/json"},
            json=body,
            timeout=30,
        )
        resp.raise_for_status()
        text = ""
        for part in resp.json().get("candidates", [{}])[0].get("content", {}).get("parts", []):
            if "text" in part:
                text += part.get("text", "")
        t = text.strip().upper()
        if "NO" in t and ("YES" not in t or t.find("NO") < t.find("YES")):
            return False
        return "YES" in t
    except Exception:
        return True


def _call_gemini(
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
    # Ordre : prompt → IMAGE 1 (produit) → IMAGE 2 (ref style) → [IMAGE 3 ref couleur] → [IMAGE 4 ref même mannequin] → [IMAGE 5 bad example].
    # Flash : même ordre (produit, ref), prompt dédié qui insiste "IMAGE 1 = output, ne pas recopier IMAGE 2". use_flash_model = Flash sans remplacer le prompt.
    if use_flash and ref_b64 and ref_mime and not color_ref_b64 and not model_ref_b64:
        prompt_text = FLASH_PROMPT_PRODUCT_FIRST
    else:
        prompt_text = prompt
    if bad_example_b64 and bad_example_mime:
        prompt_text += " The last image you receive is a BAD example (wrong framing, shadow, fold, position or rotation). Do NOT output like the last image; match IMAGE 2 instead."
    parts = [{"text": prompt_text}, {"inline_data": {"mime_type": mime, "data": image_b64}}]  # IMAGE 1 = produit
    if ref_b64 and ref_mime:
        parts.append({"inline_data": {"mime_type": ref_mime, "data": ref_b64}})  # IMAGE 2 = ref
    if color_ref_b64 and color_ref_mime:
        parts.append({"inline_data": {"mime_type": color_ref_mime, "data": color_ref_b64}})  # IMAGE 3 (ex. 1_face pour couleur dos)
    if model_ref_b64 and model_ref_mime:
        parts.append({"inline_data": {"mime_type": model_ref_mime, "data": model_ref_b64}})  # IMAGE 4 (ex. 3_detail_logo pour même personne en 4)
    if bad_example_b64 and bad_example_mime:
        parts.append({"inline_data": {"mime_type": bad_example_mime, "data": bad_example_b64}})  # Dernière = mauvaise ex, ne pas reproduire
    model = GEMINI_MODEL if (use_flash or use_flash_model) else (GEMINI_REF_MODEL if ((ref_b64 and ref_mime) or color_ref_b64 or use_ref_model or (model_ref_b64 and model_ref_mime)) else GEMINI_MODEL)
    url = f"{GEMINI_BASE}/{model}:generateContent"
    # Seed : même seed par produit pour toutes les vues. 1_face/2_back = température basse (repro + stabilité). 3/4 = température 1.0 (variation mannequin).
    gen_config: dict = {"responseModalities": ["TEXT", "IMAGE"]}
    if seed is not None:
        gen_config["seed"] = seed
        gen_config["temperature"] = 1.0 if use_variation else 0.3
    elif use_variation:
        gen_config["temperature"] = 1.0
        gen_config["seed"] = random.randint(0, 2**31 - 1)
    body = {
        "contents": [{"parts": parts}],
        "generationConfig": gen_config,
    }
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


def _run_generate_one(
    api_key: str,
    input_dir: Path,
    refs_dir: Path,
    output_dir: Path,
    use_flash: bool,
    face_path: Optional[Path] = None,
    back_path: Optional[Path] = None,
    delay_after_image: float = 0,
    only_face_back: bool = False,
    flash_attempts: int = 4,
) -> bool:
    """Génère 3 ou 4 images pour un dossier photos. Retourne True si au moins une image a été écrite."""
    output_dir.mkdir(parents=True, exist_ok=True)
    if not face_path:
        face_path = _find_in_dir(input_dir, "face", "1_face")
    if not face_path:
        return False
    if not back_path:
        back_path = _find_in_dir(input_dir, "back", "2_back")

    ref_face_path = _pick_one_ref(_list_refs_for_view(refs_dir, "face"))
    ref_back_path = _pick_one_ref(_list_refs_for_view(refs_dir, "back"))
    ref_detail_path = _pick_one_ref(_list_refs_for_view(refs_dir, "detail"))
    ref_lifestyle_path = _pick_one_ref(_list_refs_for_view(refs_dir, "lifestyle"))

    errors_guidance_text, errors_bad_path = _load_errors_guidance(refs_dir)
    errors_bad_b64, errors_bad_mime = (_encode_image(errors_bad_path) if errors_bad_path else (None, None))

    face_b64, face_mime = _encode_image(face_path)
    ref_face_b64, ref_face_mime = (_encode_image(ref_face_path) if ref_face_path else (None, None))
    ref_back_b64, ref_back_mime = (_encode_image(ref_back_path) if ref_back_path else (None, None))
    ref_detail_b64, ref_detail_mime = (_encode_image(ref_detail_path) if ref_detail_path else (None, None))
    ref_lifestyle_b64, ref_lifestyle_mime = (_encode_image(ref_lifestyle_path) if ref_lifestyle_path else (None, None))

    steps = [
        ("1_face", face_b64, face_mime, PROMPT_FACE, ref_face_b64, ref_face_mime),
        ("3_detail_logo", face_b64, face_mime, PROMPT_DETAIL_LOGO, ref_detail_b64, ref_detail_mime),
    ]
    if back_path:
        back_b64, back_mime = _encode_image(back_path)
        steps.insert(1, ("2_back", back_b64, back_mime, PROMPT_BACK, ref_back_b64, ref_back_mime))
    if only_face_back:
        steps = [s for s in steps if s[0] in ("1_face", "2_back")]

    use_pro = not use_flash
    max_attempts = 3
    written = 0
    product_seed = random.randint(0, 2**31 - 1)  # 1 ref produit = 1 mannequin : même seed pour 3
    for name, img_b64, mime, prompt, r_b64, r_mime in steps:
        pass_color_b64, pass_color_mime = None, None
        pass_model_ref_b64, pass_model_ref_mime = None, None
        if (use_pro or use_flash) and (r_b64 and r_mime):
            prompt_to_use = REFERENCE_PROMPT if (r_b64 and r_mime) else prompt
            pass_r_b64, pass_r_mime, use_ref_model = r_b64, r_mime, True
            if name == "2_back" and (r_b64 and r_mime):
                source_path = output_dir / "1_face.png"
                if source_path.exists():
                    pass_color_b64, pass_color_mime = _encode_image(source_path)
                    prompt_to_use = REFERENCE_BACK_WITH_COLOR_FROM_FRONT
            elif name == "3_detail_logo" and (r_b64 and r_mime):
                source_path = output_dir / "1_face.png"
                if source_path.exists():
                    img_b64, mime = _encode_image(source_path)
                    prompt_to_use = REFERENCE_FROM_SOURCE_OF_TRUTH
            elif name == "4_lifestyle" and (r_b64 and r_mime):
                source_path = output_dir / "1_face.png"
                if source_path.exists():
                    img_b64, mime = _encode_image(source_path)
                model_ref_path = output_dir / "3_detail_logo.png"
                if model_ref_path.exists():
                    pass_model_ref_b64, pass_model_ref_mime = _encode_image(model_ref_path)
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
            try:
                out_bytes = _call_gemini(
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
                    time.sleep(60)
                    continue
                break
            except Exception:
                break
        if use_flash and saved_any:
            written += 1
        elif last_valid:
            (output_dir / f"{name}.png").write_bytes(last_valid)
            written += 1
        if delay_after_image > 0 and written < len(steps):
            time.sleep(delay_after_image)
    return written > 0


@click.group()
def images():
    """Images IA (Gemini) – 1 photo → 3–4 images produit"""
    pass


@images.command("check-api")
def check_api():
    """Vérifie la clé API et la connexion (pas de génération). Affiche si la clé est valide ou si rate limit (429)."""
    _load_env()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        console.print("[red]❌ GEMINI_API_KEY manquante dans .env[/red]")
        raise SystemExit(1)
    url = f"{GEMINI_BASE}?key={api_key}"
    try:
        resp = requests.get(url, timeout=15)
        resp.raise_for_status()
        console.print("[green]✅ Connexion API OK (clé valide)[/green]")
        return
    except requests.HTTPError as e:
        if e.response.status_code == 429:
            console.print("[yellow]⚠️ Rate limit (429). Attendre quelques minutes puis relancer avec --delay 15 ou 20.[/yellow]")
        elif e.response.status_code in (401, 403):
            console.print("[red]❌ Clé API invalide ou refusée (401/403)[/red]")
        else:
            console.print(f"[red]❌ Erreur API {e.response.status_code}[/red]")
        raise SystemExit(1)
    except Exception as e:
        console.print(f"[red]❌ Connexion échouée: {e}[/red]")
        raise SystemExit(1)


@images.command("generate")
@click.option("--input-dir", "input_dir", default="photos", type=click.Path(path_type=Path), help="Dossier des photos produit (face.jpg, back.jpg)")
@click.option("--refs-dir", "refs_dir", default="refs", type=click.Path(path_type=Path), help="Dossier refs (sous-dossiers face/, back/, details/, lifestyle/ ou fichiers face.jpg, 2_back.png, …)")
@click.option("--face", "face_path", default=None, type=click.Path(exists=True, path_type=Path), help="Photo face (optionnel si input-dir contient face.jpg)")
@click.option("--back", "back_path", default=None, type=click.Path(exists=True, path_type=Path), help="Photo dos (optionnel)")
@click.option("--gemini-flash", "use_flash", is_flag=True, help="Utiliser Gemini 2.5 Flash (économique, plus de retouches possibles)")
@click.option("--flash-attempts", "flash_attempts", default=4, type=int, help="En mode Flash, nombre de générations par vue (défaut 4). Plus de chances d'avoir une sortie sans invention.")
@click.option("-o", "output_dir", default="./output", type=click.Path(path_type=Path), help="Dossier de sortie")
@click.option("--only", "only_views", default=None, help="Régénérer uniquement ces vues (ex: 2_back ou 1_face,2_back)")
def generate(input_dir, refs_dir, face_path, back_path, use_flash, flash_attempts, output_dir, only_views):
    """Génère 3 ou 4 images via Gemini. Par défaut Gemini 3 Pro (une run propre). --gemini-flash pour l'économique."""
    _load_env()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        console.print("[red]❌ GEMINI_API_KEY manquante. Ajoute-la dans .env à la racine.[/red]")
        raise SystemExit(1)

    # photos/ (input_dir) = les TRUCS (produits à shooter). refs/ (refs_dir) = les REFS (style seulement).
    input_dir = Path(input_dir).resolve()
    refs_dir = Path(refs_dir).resolve()
    output_dir = output_dir.resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    only_set = set(v.strip() for v in (only_views or "").split(",") if v.strip())
    if not face_path:
        face_path = _find_in_dir(input_dir, "face", "1_face")
    if not face_path and "2_back" not in only_set:
        console.print("[red]❌ Aucune photo face. Mettez face.jpg ou 1_face.jpg dans photos/ (ou --input-dir).[/red]")
        raise SystemExit(1)
    if not back_path:
        back_path = _find_in_dir(input_dir, "back", "2_back")
    if only_set and "2_back" in only_set and not back_path:
        console.print("[red]❌ --only 2_back nécessite une photo dos (back.jpg) dans le dossier source.[/red]")
        raise SystemExit(1)

    ref_face_path = _pick_one_ref(_list_refs_for_view(refs_dir, "face"))
    ref_back_path = _pick_one_ref(_list_refs_for_view(refs_dir, "back"))
    ref_detail_path = _pick_one_ref(_list_refs_for_view(refs_dir, "detail"))
    ref_lifestyle_path = _pick_one_ref(_list_refs_for_view(refs_dir, "lifestyle"))

    refs_found = [ref_face_path, ref_back_path, ref_detail_path, ref_lifestyle_path]
    if any(refs_found):
        console.print(f"[blue]📷 Refs utilisées : face={ref_face_path is not None}, back={ref_back_path is not None}, detail={ref_detail_path is not None}, lifestyle={ref_lifestyle_path is not None}[/blue]")
    errors_guidance_text, errors_bad_path = _load_errors_guidance(refs_dir)
    errors_bad_b64, errors_bad_mime = (_encode_image(errors_bad_path) if errors_bad_path else (None, None))
    if errors_bad_path:
        console.print(f"[dim]   Guidage erreurs : AVOID.txt + 1 image bad ({errors_bad_path.name})[/dim]")
    console.print("[blue]📷 Lecture photo face...[/blue]")
    face_b64, face_mime = _encode_image(face_path)
    ref_face_b64, ref_face_mime = (_encode_image(ref_face_path) if ref_face_path else (None, None))
    ref_back_b64, ref_back_mime = (_encode_image(ref_back_path) if ref_back_path else (None, None))
    ref_detail_b64, ref_detail_mime = (_encode_image(ref_detail_path) if ref_detail_path else (None, None))
    ref_lifestyle_b64, ref_lifestyle_mime = (_encode_image(ref_lifestyle_path) if ref_lifestyle_path else (None, None))

    steps = [
        ("1_face", face_b64, face_mime, PROMPT_FACE, ref_face_b64, ref_face_mime),
        ("3_detail_logo", face_b64, face_mime, PROMPT_DETAIL_LOGO, ref_detail_b64, ref_detail_mime),
    ]
    if back_path:
        back_b64, back_mime = _encode_image(back_path)
        steps.insert(1, ("2_back", back_b64, back_mime, PROMPT_BACK, ref_back_b64, ref_back_mime))

    if only_set:
        steps = [s for s in steps if s[0] in only_set]
        if not steps:
            console.print("[red]❌ Aucune vue à générer pour --only %s.[/red]" % only_views)
            raise SystemExit(1)
        console.print(f"[dim]   Vues uniquement : {', '.join(s[0] for s in steps)}[/dim]")

    use_pro = not use_flash
    if use_pro:
        console.print("[blue]Gemini 3 Pro (défaut)[/blue]")
    else:
        console.print(f"[yellow]Gemini 2.5 Flash (économique, {flash_attempts} générations par vue)[/yellow]")

    max_attempts = 3
    product_seed = random.randint(0, 2**31 - 1)  # 1 ref produit = 1 mannequin pour 3 et 4
    for name, img_b64, mime, prompt, r_b64, r_mime in steps:
        console.print(f"[blue]🔄 {name}...[/blue]")
        pass_color_b64, pass_color_mime = None, None
        pass_model_ref_b64, pass_model_ref_mime = None, None
        if use_pro or use_flash:
            prompt_to_use = REFERENCE_PROMPT if (r_b64 and r_mime) else prompt
            pass_r_b64, pass_r_mime, use_ref_model = r_b64, r_mime, True
            if name == "2_back" and (r_b64 and r_mime):
                source_path = output_dir / "1_face.png"
                if source_path.exists():
                    pass_color_b64, pass_color_mime = _encode_image(source_path)
                    prompt_to_use = REFERENCE_BACK_WITH_COLOR_FROM_FRONT
                    console.print("[dim]   (couleur calée sur 1_face)[/dim]")
            elif name == "3_detail_logo" and (r_b64 and r_mime):
                source_path = output_dir / "1_face.png"
                if source_path.exists():
                    img_b64, mime = _encode_image(source_path)
                    prompt_to_use = REFERENCE_FROM_SOURCE_OF_TRUTH
                    console.print("[dim]   (contexte: 1_face générée)[/dim]")
            elif name == "4_lifestyle" and (r_b64 and r_mime):
                source_path = output_dir / "1_face.png"
                if source_path.exists():
                    img_b64, mime = _encode_image(source_path)
                model_ref_path = output_dir / "3_detail_logo.png"
                if model_ref_path.exists():
                    pass_model_ref_b64, pass_model_ref_mime = _encode_image(model_ref_path)
                    prompt_to_use = LIFESTYLE_SAME_MODEL_PROMPT
                    console.print("[dim]   (même mannequin que 3_detail_logo)[/dim]")
                else:
                    prompt_to_use = REFERENCE_FROM_SOURCE_OF_TRUTH
                    console.print("[dim]   (contexte: 1_face générée)[/dim]")
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
        saved_paths = []
        for attempt in range(num_calls):
            try:
                out_bytes = _call_gemini(
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
                        saved_paths.append(out_path)
                        if attempt == 0:
                            console.print(f"[dim]   (x{num_calls} Flash: générations 2 à {num_calls}…)[/dim]")
                        continue
                    break
                if attempt < num_calls - 1:
                    console.print(f"[yellow]  Retry {attempt + 2}/{num_calls}...[/yellow]")
            except requests.HTTPError as e:
                if e.response.status_code == 429 and attempt < num_calls - 1:
                    console.print(f"[yellow]  Rate limit (429), attente 60s puis retry…[/yellow]")
                    time.sleep(60)
                    continue
                console.print(f"[red]❌ {name}: {e.response.status_code} {e.response.text[:200]}[/red]")
                break
            except Exception as e:
                console.print(f"[red]❌ {name}: {e}[/red]")
                break
        if use_flash and saved_paths:
            for p in saved_paths:
                console.print(f"[green]✅ {p}[/green]")
        elif last_valid:
            out_path = output_dir / f"{name}.png"
            out_path.write_bytes(last_valid)
            console.print(f"[green]✅ {out_path}[/green]")
        else:
            console.print(f"[yellow]⚠️ {name}: pas d'image après {num_calls} essais[/yellow]")

    console.print(f"\n[green]Terminé. Fichiers dans {output_dir}[/green]")


@images.command("generate-batch")
@click.option("--input-dir", "input_dir", required=True, type=click.Path(path_type=Path), help="Dossier parent : un sous-dossier par ref (nom = ref avec '-' au lieu de '/', ex. L100001-V09A)")
@click.option("--refs-dir", "refs_dir", default="refs", type=click.Path(path_type=Path), help="Dossier refs (sous-dossiers face/, back/, details/, lifestyle/ ou fichiers à la racine)")
@click.option("-o", "output_dir", default="./output_batch", type=click.Path(path_type=Path), help="Dossier de sortie (un sous-dossier par ref)")
@click.option("--skip-existing", is_flag=True, help="Ne pas régénérer si 1_face.png existe déjà pour cette ref")
@click.option("--upload", "do_upload", is_flag=True, help="Après chaque génération, uploader les images vers le backend")
@click.option("--backend", "backend_url", default="http://localhost:3001", help="URL du backend (pour --upload)")
@click.option("--gemini-flash", "use_flash", is_flag=True, help="Utiliser Gemini 2.5 Flash (économique)")
@click.option("--flash-attempts", "flash_attempts", default=4, type=int, help="En mode Flash, nombre de générations par vue (défaut 4). Plus de chances d'avoir une sortie sans invention.")
@click.option("--only-face-back", "only_face_back", is_flag=True, help="Générer uniquement 1_face et 2_back (économie quota, le reste plus tard)")
@click.option("--delay", default=30, type=float, help="Délai en secondes après chaque image générée (chaque requête API). Recommandé 30 pour éviter 429. Défaut 30.")
def generate_batch(input_dir, refs_dir, output_dir, skip_existing, do_upload, backend_url, use_flash, flash_attempts, delay, only_face_back):
    """Parcourt les sous-dossiers de --input-dir, génère les images pour chaque ref (un sous-dossier = une ref). --delay = pause après chaque image. --only-face-back = uniquement 1 et 2. Optionnel : --upload."""
    _load_env()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        console.print("[red]❌ GEMINI_API_KEY manquante.[/red]")
        raise SystemExit(1)
    root = Path(input_dir).resolve()
    refs_dir = Path(refs_dir).resolve()
    output_root = Path(output_dir).resolve()
    if not root.is_dir():
        console.print(f"[red]❌ Dossier introuvable : {root}[/red]")
        raise SystemExit(1)
    subdirs = sorted([d for d in root.iterdir() if d.is_dir() and not d.name.startswith(".")])
    if not subdirs:
        console.print(f"[yellow]⚠️ Aucun sous-dossier dans {root}[/yellow]")
        return
    console.print(f"[blue]📁 {len(subdirs)} ref(s) trouvée(s). Sortie : {output_root}[/blue]")
    ok_count = fail_count = skip_count = 0
    failed_refs = []
    for i, subdir in enumerate(subdirs, 1):
        ref = subdir.name.replace("-", "/")
        out_dir = output_root / subdir.name
        if skip_existing and (out_dir / "1_face.png").exists():
            skip_count += 1
            if do_upload:
                if _upload_one(ref, out_dir, backend_url, False, silent=True)[0]:
                    console.print(f"  [green]✅ déjà présent + uploadé[/green]")
                else:
                    fail_count += 1
                    failed_refs.append(ref)
            continue
        console.print(f"[blue][{i}/{len(subdirs)}] {ref}[/blue]")
        if _run_generate_one(api_key, subdir, refs_dir, out_dir, use_flash, delay_after_image=delay, only_face_back=only_face_back, flash_attempts=flash_attempts):
            if do_upload:
                if _upload_one(ref, out_dir, backend_url, False, silent=True)[0]:
                    ok_count += 1
                    console.print(f"  [green]✅ généré + uploadé[/green]")
                else:
                    fail_count += 1
                    failed_refs.append(ref)
                    console.print(f"  [yellow]⚠️ généré, upload échoué[/yellow]")
            else:
                ok_count += 1
        else:
            fail_count += 1
            failed_refs.append(ref)
            console.print(f"  [red]❌ échec génération[/red]")
        # Délai déjà appliqué après chaque image dans _run_generate_one
    console.print(f"\n[green]Terminé : {ok_count} générés, {skip_count} ignorés (--skip-existing), {fail_count} échec(s)[/green]")
    if failed_refs:
        console.print("[red]Refs en échec : %s[/red]" % ", ".join(failed_refs))


ADJUST_SYSTEM = (
    "You are an image editor. Your job is to apply ONE small change to the input image. DO NOT redraw, regenerate or replace the garment. "
    "CRITICAL: The garment in the output must be THE SAME as in the input — same type, same color, same view (front or back), same framing. "
    "Change ONLY what the instruction asks (e.g. shadow, fold, lighting, remove a tag). Do not substitute a different product or view. "
    "Apply ONLY this change: {prompt}. "
    "Background must be plain solid #F3F3F3 (light grey) only. "
    "Output only the modified image, no text."
)


@images.command("adjust")
@click.option("--image", "image_path", required=True, type=click.Path(exists=True, path_type=Path), help="Image à ajuster (ex: output/1_face.png)")
@click.option("--prompt", "adjust_prompt", required=True, help="Consigne d'ajustement (ex: More relaxed sleeves)")
@click.option("--ref", "ref_path", default=None, type=click.Path(exists=True, path_type=Path), help="Image de référence (ex: output/1_face.png pour caler les couleurs)")
@click.option("-o", "output_path", default=None, type=click.Path(path_type=Path), help="Fichier de sortie (défaut: même dossier, suffixe _adjusted)")
@click.option("--gemini-flash", "use_flash", is_flag=True, help="Utiliser Gemini 2.5 Flash (économique)")
@click.option("--gemini-pro", "use_pro", is_flag=True, help="Utiliser Gemini 3 Pro (plus cher, meilleur rendu)")
@click.option("--add-to-errors", "add_to_errors", is_flag=True, help="Copier l'image d'entrée (avant ajustement) dans refs/errors/bad/ comme exemple à ne pas reproduire")
@click.option("--refs-dir", "refs_dir", default="refs", type=click.Path(path_type=Path), help="Dossier refs (pour --add-to-errors)")
@click.option("--skip-verify", "skip_verify", is_flag=True, help="Ne pas vérifier que la sortie est le même produit que l'entrée")
def adjust(image_path, adjust_prompt, ref_path, output_path, use_flash, use_pro, add_to_errors, refs_dir, skip_verify):
    """Deuxième passe : image + consigne → image modifiée. Recommandé : --gemini-pro, sans --ref, prompt minimal. Sortie par défaut : *_adjusted.png (original non écrasé)."""
    _load_env()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        console.print("[red]❌ GEMINI_API_KEY manquante. Ajoute-la dans .env à la racine.[/red]")
        raise SystemExit(1)

    image_path = Path(image_path).resolve()
    if add_to_errors:
        refs_dir = Path(refs_dir).resolve()
        bad_dir = refs_dir / "errors" / "bad"
        bad_dir.mkdir(parents=True, exist_ok=True)
        ts = time.strftime("%Y%m%d_%H%M%S", time.localtime())
        bad_name = f"{image_path.stem}_bad_{ts}{image_path.suffix}"
        bad_path = bad_dir / bad_name
        shutil.copy2(image_path, bad_path)
        console.print(f"[dim]   Ajouté aux exemples erreurs : {bad_path}[/dim]")
    prompt_text = ADJUST_SYSTEM.format(prompt=adjust_prompt)
    ref_b64, ref_mime = None, None
    if ref_path is not None:
        ref_path = Path(ref_path).resolve()
        ref_b64, ref_mime = _encode_image(ref_path)
        prompt_text = (
            "First image = image to modify. Second image = reference. "
            + prompt_text
            + " Use the second image as reference for colors or style where the instruction says so."
        )
        if not use_flash:
            use_pro = True

    if output_path is not None:
        output_path = Path(output_path).resolve()
        if output_path.is_dir() or output_path.suffix not in (".png", ".jpg", ".jpeg"):
            output_path = output_path / f"{image_path.stem}_adjusted.png"
        if output_path.resolve() == image_path.resolve():
            output_path = image_path.parent / f"{image_path.stem}_adjusted.png"
            console.print("[yellow]⚠️ Sortie redirigée vers _adjusted.png pour ne pas écraser l'original. Vérifiez puis renommez si OK.[/yellow]")
    else:
        output_path = image_path.parent / f"{image_path.stem}_adjusted.png"

    output_path.parent.mkdir(parents=True, exist_ok=True)

    refs_dir = Path(refs_dir).resolve()
    errors_guidance_text, errors_bad_path = _load_errors_guidance(refs_dir)
    if errors_guidance_text:
        prompt_text = prompt_text.rstrip() + "\n\n" + errors_guidance_text
    pass_bad_b64, pass_bad_mime = (_encode_image(errors_bad_path) if errors_bad_path else (None, None))

    console.print(f"[blue]🔄 Ajustement : {image_path.name} avec « {adjust_prompt} »[/blue]")
    if use_flash:
        console.print("[dim]   Modèle : Gemini 2.5 Flash[/dim]")
    if ref_b64:
        console.print(f"[dim]   Référence : {ref_path.name}[/dim]")
    if pass_bad_b64:
        console.print("[dim]   Guidage erreurs + exemple à ne pas reproduire[/dim]")
    img_b64, mime = _encode_image(image_path)
    try:
        out_bytes = _call_gemini(
            api_key, img_b64, mime, prompt_text,
            ref_b64=ref_b64, ref_mime=ref_mime,
            use_ref_model=(use_pro and not use_flash) or (bool(ref_b64) and not use_flash),
            use_flash_model=use_flash,
            bad_example_b64=pass_bad_b64,
            bad_example_mime=pass_bad_mime,
        )
        if not out_bytes:
            console.print("[yellow]⚠️ Pas d'image dans la réponse.[/yellow]")
            raise SystemExit(1)
        if not skip_verify:
            out_b64 = base64.standard_b64encode(out_bytes).decode("ascii")
            if not _verify_same_garment_type(api_key, img_b64, mime, out_b64, mime):
                console.print("[red]❌ Vérif produit : la sortie n'est pas le même produit (ex. veste au lieu de short). Fichier non enregistré. --skip-verify pour forcer.[/red]")
                raise SystemExit(1)
            console.print("[dim]   Vérif même produit : OK[/dim]")
            color_ref_b64 = ref_b64 if ref_b64 else img_b64
            color_ref_mime = ref_mime if ref_mime else mime
            if not _verify_color_match(api_key, color_ref_b64, color_ref_mime, out_b64, mime):
                console.print("[red]❌ Vérif couleur : la sortie ne correspond pas à la ref (ou à l'entrée si pas de --ref). Fichier non enregistré. --skip-verify pour forcer.[/red]")
                raise SystemExit(1)
            console.print("[dim]   Vérif couleur : OK[/dim]")
        output_path.write_bytes(out_bytes)
        console.print(f"[green]✅ {output_path}[/green]")
    except requests.HTTPError as e:
        console.print(f"[red]❌ {e.response.status_code} {e.response.text[:200]}[/red]")
        raise SystemExit(1)
    except Exception as e:
        console.print(f"[red]❌ {e}[/red]")
        raise SystemExit(1)


def _extract_garment_color(image_path: Path) -> tuple:
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


def _color_transfer(source_path: Path, target_path: Path, output_path: Path) -> dict:
    """Transfert couleur statistique : recale la distribution couleur du vêtement target sur source. Retourne les stats."""
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


@images.command("color-fix")
@click.option("--dir", "product_dir", default=None, type=click.Path(exists=True, path_type=Path),
              help="Dossier produit (contient 1_face.png et 2_back.png). Couleur face → dos.")
@click.option("--source", "source_path", default=None, type=click.Path(exists=True, path_type=Path),
              help="Image source de vérité couleur (ex: 1_face.png)")
@click.option("--target", "target_path", default=None, type=click.Path(exists=True, path_type=Path),
              help="Image à corriger (ex: 2_back.png)")
@click.option("-o", "output_path", default=None, type=click.Path(path_type=Path),
              help="Fichier de sortie (défaut: écrase target)")
@click.option("--batch", "batch_dir", default=None, type=click.Path(exists=True, path_type=Path),
              help="Dossier batch (chaque sous-dossier = un produit). Corrige tous les 2_back.png.")
def color_fix(product_dir, source_path, target_path, output_path, batch_dir):
    """Correction couleur programmatique (PIL). Transfert la couleur du vêtement source → target. Pas d'IA, 100% précis."""
    if batch_dir:
        batch_dir = Path(batch_dir).resolve()
        subdirs = sorted([d for d in batch_dir.iterdir() if d.is_dir()])
        ok, skip, fail = 0, 0, 0
        for d in subdirs:
            face = d / "1_face.png"
            back = d / "2_back.png"
            if not face.exists() or not back.exists():
                skip += 1
                continue
            try:
                stats = _color_transfer(face, back, back)
                console.print(f"[green]✅ {d.name}[/green] {stats['before_hex']} → {stats['after_hex']} (source {stats['source_hex']})")
                ok += 1
            except Exception as e:
                console.print(f"[red]❌ {d.name}: {e}[/red]")
                fail += 1
        console.print(f"\n[bold]Batch terminé : {ok} corrigés, {skip} ignorés, {fail} erreurs[/bold]")
        return

    if product_dir:
        product_dir = Path(product_dir).resolve()
        source_path = product_dir / "1_face.png"
        target_path = product_dir / "2_back.png"
        if not source_path.exists():
            console.print(f"[red]❌ {source_path} introuvable[/red]")
            raise SystemExit(1)
        if not target_path.exists():
            console.print(f"[red]❌ {target_path} introuvable[/red]")
            raise SystemExit(1)

    if not source_path or not target_path:
        console.print("[red]❌ Utilise --dir <dossier_produit>, --batch <dossier_batch>, ou --source + --target[/red]")
        raise SystemExit(1)

    source_path = Path(source_path).resolve()
    target_path = Path(target_path).resolve()
    out = Path(output_path).resolve() if output_path else target_path

    sr, sg, sb, shex = _extract_garment_color(source_path)
    tr, tg, tb, thex = _extract_garment_color(target_path)
    console.print(f"[blue]🎨 Source (vérité) : {shex} RGB({sr},{sg},{sb})[/blue]")
    console.print(f"[yellow]   Target (avant)  : {thex} RGB({tr},{tg},{tb})[/yellow]")

    stats = _color_transfer(source_path, target_path, out)
    ar, ag, ab = stats["after_rgb"]
    console.print(f"[green]✅ Résultat        : {stats['after_hex']} RGB({ar},{ag},{ab})[/green]")
    console.print(f"[green]   Enregistré : {out}[/green]")


def _normalize_background_to_hex(image_path: Path, output_path: Path, target_hex: str = "#F3F3F3", tolerance: int = 45) -> bool:
    """Remplace le fond (pixels proches de la couleur des bords) par target_hex. Attention : vêtement blanc = risque de confusion avec le fond ; dans ce cas éviter background-fix ou corriger après avec adjust."""
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


@images.command("background-fix")
@click.option("--dir", "product_dir", default=None, type=click.Path(exists=True, path_type=Path),
              help="Dossier produit (1_face.png, 2_back.png, …). Fond → #F3F3F3.")
@click.option("--image", "image_path", default=None, type=click.Path(exists=True, path_type=Path),
              help="Une seule image à traiter")
@click.option("--batch", "batch_dir", default=None, type=click.Path(exists=True, path_type=Path),
              help="Dossier batch (chaque sous-dossier = un produit). Traite toutes les images .png/.jpg.")
@click.option("--hex", "target_hex", default="#F3F3F3", help="Couleur de fond cible (défaut #F3F3F3)")
@click.option("--tolerance", default=45, type=int, help="Distance RGB max pour considérer un pixel comme fond (défaut 45)")
def background_fix(product_dir, image_path, batch_dir, target_hex, tolerance):
    """Analyse le fond des images (bord) et remplace par #F3F3F3 si différent. Pas d'IA, 100% local (PIL/numpy)."""
    try:
        from PIL import Image
    except ImportError:
        console.print("[red]❌ Pillow requis : pip install Pillow numpy[/red]")
        raise SystemExit(1)
    target_hex = target_hex.strip()
    if not target_hex.startswith("#"):
        target_hex = "#" + target_hex
    files_done = []
    if batch_dir:
        batch_dir = Path(batch_dir).resolve()
        for subdir in sorted([d for d in batch_dir.iterdir() if d.is_dir()]):
            for ext in (".png", ".jpg", ".jpeg"):
                for f in subdir.glob("*" + ext):
                    try:
                        _normalize_background_to_hex(f, f, target_hex=target_hex, tolerance=tolerance)
                        files_done.append(f"{subdir.name}/{f.name}")
                    except Exception as e:
                        console.print(f"[red]❌ {subdir.name}/{f.name}: {e}[/red]")
        if files_done:
            console.print(f"[green]✅ Fond → {target_hex} : {len(files_done)} image(s) dans {batch_dir}[/green]")
        return
    if product_dir:
        product_dir = Path(product_dir).resolve()
        for ext in (".png", ".jpg", ".jpeg"):
            for f in product_dir.glob("*" + ext):
                try:
                    _normalize_background_to_hex(f, f, target_hex=target_hex, tolerance=tolerance)
                    files_done.append(f.name)
                except Exception as e:
                    console.print(f"[red]❌ {f.name}: {e}[/red]")
        if files_done:
            console.print(f"[green]✅ Fond → {target_hex} : {', '.join(files_done)}[/green]")
        return
    if image_path:
        image_path = Path(image_path).resolve()
        try:
            _normalize_background_to_hex(image_path, image_path, target_hex=target_hex, tolerance=tolerance)
            console.print(f"[green]✅ Fond → {target_hex} : {image_path}[/green]")
        except Exception as e:
            console.print(f"[red]❌ {e}[/red]")
            raise SystemExit(1)
        return
    console.print("[red]❌ Utilise --dir <dossier>, --batch <dossier_batch>, ou --image <fichier>[/red]")
    raise SystemExit(1)


def _get_product_id_by_ref(ref: str) -> Optional[int]:
    """Retourne l'id produit pour une référence (via rcli db product-find --json)."""
    cli_dir = PROJECT_ROOT / "cli"
    main_py = cli_dir / "main.py"
    if not main_py.exists():
        return None
    try:
        out = subprocess.run(
            [sys.executable, str(main_py), "db", "product-find", "--ref", ref, "--json"],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            timeout=30,
        )
        if out.returncode != 0 or not out.stdout.strip():
            return None
        data = json.loads(out.stdout.strip())
        if data and isinstance(data, list) and len(data) > 0:
            return int(data[0].get("id", 0))
        return None
    except Exception:
        return None


def _get_product_ids_by_brand(brand: str, limit: int = 500) -> list:
    """Liste les id produits pour une marque (via rcli db product-list --brand X --json)."""
    cli_dir = PROJECT_ROOT / "cli"
    main_py = cli_dir / "main.py"
    if not main_py.exists():
        return []
    try:
        out = subprocess.run(
            [sys.executable, str(main_py), "db", "product-list", "--brand", brand, "--json", "--limit", str(limit)],
            cwd=PROJECT_ROOT,
            capture_output=True,
            text=True,
            timeout=60,
        )
        if out.returncode != 0 or not out.stdout.strip():
            return []
        data = json.loads(out.stdout.strip())
        if not isinstance(data, list):
            return []
        return [int(p["id"]) for p in data if p.get("id") is not None]
    except Exception:
        return []


# Ordre des images pour l'upload (nom de base sans extension)
UPLOAD_IMAGE_ORDER = ["1_face", "2_back", "3_detail_logo"]


def _collect_face_back_images(image_dir: Path) -> list:
    """Liste tous les fichiers image dont le nom contient 'face' ou 'back', triés : face d'abord, puis back (ex: 1_face.png, 1_face_2.png, 2_back.png, 2_back_3.png)."""
    exts = (".png", ".jpg", ".jpeg")
    face_files, back_files = [], []
    for f in image_dir.iterdir():
        if not f.is_file() or f.suffix.lower() not in exts:
            continue
        name_lower = f.stem.lower()
        if "face" in name_lower:
            face_files.append(f)
        elif "back" in name_lower:
            back_files.append(f)
    face_files.sort(key=lambda p: p.name)
    back_files.sort(key=lambda p: p.name)
    return face_files + back_files


def _upload_one(
    reference: str,
    image_dir: Path,
    backend_url: str,
    do_append: bool,
    silent: bool = False,
    files_ordered: Optional[list] = None,
) -> tuple:
    """Upload les images du dossier vers le produit (ref). Retourne (succès, nb_images_uploadées). Si files_ordered est fourni, on uploade uniquement ces fichiers (ordre 0,1,2...). Sinon on utilise 1_face, 2_back, 3_detail_logo."""
    image_dir = Path(image_dir).resolve()
    if not image_dir.is_dir():
        if not silent:
            console.print(f"[red]❌ Dossier introuvable : {image_dir}[/red]")
        return False, 0
    product_id = _get_product_id_by_ref(reference)
    if not product_id:
        if not silent:
            console.print(f"[red]❌ Aucun produit pour « {reference} »[/red]")
        return False, 0
    base_url = backend_url.rstrip("/")
    do_replace = not do_append
    if do_replace:
        try:
            r = requests.get(f"{base_url}/products/{product_id}", timeout=15)
            r.raise_for_status()
            for img in (r.json().get("images") or []):
                iid = img.get("id")
                if iid is not None:
                    requests.delete(f"{base_url}/products/{product_id}/images/{iid}", timeout=15).raise_for_status()
        except requests.RequestException:
            if not silent:
                console.print(f"[red]❌ Erreur suppression anciennes images ({reference})[/red]")
            return False, 0
    if files_ordered is not None:
        files_to_upload = [(p.name, p) for p in files_ordered]
    else:
        files_to_upload = []
        for name in UPLOAD_IMAGE_ORDER:
            for ext in (".png", ".jpg", ".jpeg"):
                p = image_dir / (name + ext)
                if p.exists():
                    files_to_upload.append((p.name, p))
                    break
    if not files_to_upload:
        if not silent:
            console.print(f"[yellow]⚠️ Aucune image dans {image_dir}[/yellow]")
        return False, 0
    orders_param = ",".join(str(i) for i in range(len(files_to_upload)))
    url = f"{base_url}/products/{product_id}/images/bulk?orders={orders_param}"
    file_handles = []
    try:
        parts = []
        for _, p in files_to_upload:
            fh = open(p, "rb")
            file_handles.append(fh)
            ct = "image/png" if str(p).lower().endswith(".png") else "image/jpeg"
            parts.append(("files", (Path(p).name, fh, ct)))
        requests.post(url, files=parts, timeout=60).raise_for_status()
    except (requests.HTTPError, requests.ConnectionError) as e:
        if not silent:
            console.print(f"[red]❌ Upload {reference}: {e}[/red]")
        return False, 0
    finally:
        for fh in file_handles:
            fh.close()
    if not silent:
        console.print(f"[green]✅ {len(files_to_upload)} image(s) → {reference}[/green]")
    return True, len(files_to_upload)


@images.command("upload")
@click.option("--ref", "reference", required=True, help="Référence produit (ex: L100001/V09A)")
@click.option("--dir", "image_dir", default="output", type=click.Path(path_type=Path), help="Dossier contenant les images (1_face.png, 2_back.png, …)")
@click.option("--backend", "backend_url", default="http://localhost:3001", help="URL du backend Reboul (pour POST /products/:id/images/bulk)")
@click.option("--append", "do_append", is_flag=True, help="Ajouter sans supprimer les images existantes (défaut : remplacer les anciennes sur Cloudinary + BDD puis upload)")
def upload(reference, image_dir, backend_url, do_append):
    """Upload les images du dossier vers Cloudinary et les attache au produit (ref). Par défaut remplace les images existantes. Backend doit être démarré."""
    image_dir = Path(image_dir).resolve()
    if not image_dir.is_dir():
        console.print(f"[red]❌ Dossier introuvable : {image_dir}[/red]")
        raise SystemExit(1)
    product_id = _get_product_id_by_ref(reference)
    if not product_id:
        console.print(f"[red]❌ Aucun produit trouvé pour la référence « {reference} ». Lance : ./rcli db product-find --ref {reference}[/red]")
        raise SystemExit(1)
    base_url = backend_url.rstrip("/")
    do_replace = not do_append
    if do_replace:
        try:
            r = requests.get(f"{base_url}/products/{product_id}", timeout=15)
            r.raise_for_status()
            data = r.json()
            images = data.get("images") or []
            for img in images:
                iid = img.get("id")
                if iid is not None:
                    dr = requests.delete(f"{base_url}/products/{product_id}/images/{iid}", timeout=15)
                    dr.raise_for_status()
            if images:
                console.print(f"[blue]🗑️ {len(images)} image(s) existante(s) supprimée(s) (Cloudinary + BDD)[/blue]")
        except requests.RequestException as e:
            console.print(f"[red]❌ Erreur lors de la suppression des anciennes images : {e}[/red]")
            raise SystemExit(1)
    files_to_upload = []
    for name in UPLOAD_IMAGE_ORDER:
        for ext in (".png", ".jpg", ".jpeg"):
            p = image_dir / (name + ext)
            if p.exists():
                files_to_upload.append((name, p))
                break
    if not files_to_upload:
        console.print(f"[yellow]⚠️ Aucune image trouvée dans {image_dir} (attendu : 1_face.png, 2_back.png, …)[/yellow]")
        raise SystemExit(1)
    orders_param = ",".join(str(i) for i in range(len(files_to_upload)))
    url = f"{base_url}/products/{product_id}/images/bulk?orders={orders_param}"
    console.print(f"[blue]📤 Upload de {len(files_to_upload)} image(s) vers le produit {product_id} ({reference})…[/blue]")
    file_handles = []
    try:
        parts = []
        for _, p in files_to_upload:
            fh = open(p, "rb")
            file_handles.append(fh)
            ct = "image/png" if str(p).lower().endswith(".png") else "image/jpeg"
            parts.append(("files", (Path(p).name, fh, ct)))
        resp = requests.post(url, files=parts, timeout=60)
        resp.raise_for_status()
    except requests.HTTPError as e:
        console.print(f"[red]❌ {e.response.status_code} {getattr(e.response, 'text', '')[:300]}[/red]")
        raise SystemExit(1)
    except requests.ConnectionError as e:
        console.print("[red]❌ Connexion refusée ou coupée. Vérifie que le backend tourne (ex. port 3001) et redémarre-le si tu viens de modifier le code.[/red]")
        raise SystemExit(1)
    finally:
        for fh in file_handles:
            fh.close()
    console.print(f"[green]✅ {len(files_to_upload)} image(s) uploadées et attachées au produit {reference}[/green]")


@images.command("delete-by-brand")
@click.option("--brand", "brand_name", required=True, help='Marque (ex: "Stone Island"). Supprime toutes les images des produits de cette marque.')
@click.option("--backend", "backend_url", default="http://localhost:3001", help="URL du backend Reboul")
@click.option("-y", "yes", is_flag=True, help="Sans confirmation")
def delete_by_brand(brand_name, backend_url, yes):
    """Supprime toutes les images produit (Cloudinary + BDD) pour les produits de la marque donnée. Backend doit être démarré."""
    product_ids = _get_product_ids_by_brand(brand_name)
    if not product_ids:
        console.print(f"[yellow]⚠️ Aucun produit trouvé pour la marque « {brand_name} »[/yellow]")
        return
    if not yes and not click.confirm(f"Supprimer les images de {len(product_ids)} produit(s) de la marque « {brand_name} » ? (Cloudinary + BDD)"):
        return
    base_url = backend_url.rstrip("/")
    deleted_total = 0
    err_count = 0
    for pid in product_ids:
        try:
            r = requests.get(f"{base_url}/products/{pid}", timeout=15)
            r.raise_for_status()
            images = r.json().get("images") or []
            for img in images:
                iid = img.get("id")
                if iid is not None:
                    try:
                        requests.delete(f"{base_url}/products/{pid}/images/{iid}", timeout=15).raise_for_status()
                        deleted_total += 1
                    except requests.RequestException:
                        err_count += 1
        except requests.RequestException:
            err_count += 1
    console.print(f"[green]✅ {deleted_total} image(s) supprimée(s) pour {len(product_ids)} produit(s)[/green]")
    if err_count:
        console.print(f"[yellow]⚠️ {err_count} erreur(s) lors de la suppression[/yellow]")


@images.command("upload-batch")
@click.option("--batch", "batch_dir", required=True, type=click.Path(path_type=Path), help="Dossier batch (ex. output_batch_stone_island) : un sous-dossier par ref (nom = ref avec '-' au lieu de '/')")
@click.option("--backend", "backend_url", default="http://localhost:3001", help="URL du backend Reboul")
@click.option("--append", "do_append", is_flag=True, help="Ajouter sans supprimer les images existantes (défaut : remplacer)")
def upload_batch(batch_dir, backend_url, do_append):
    """Upload toutes les images de chaque sous-dossier (nom contenant 'face' ou 'back' : face=ordre 1, back=ordre 2). Vérifie que le total uploadé = total attendu."""
    batch_dir = Path(batch_dir).resolve()
    if not batch_dir.is_dir():
        console.print(f"[red]❌ Dossier batch introuvable : {batch_dir}[/red]")
        raise SystemExit(1)
    all_subdirs = sorted([d for d in batch_dir.iterdir() if d.is_dir() and not d.name.startswith(".")])
    to_upload = []
    total_expected = 0
    for d in all_subdirs:
        files = _collect_face_back_images(d)
        if files:
            ref = d.name.replace("-", "/")
            to_upload.append((d, ref, files))
            total_expected += len(files)
    skipped_dirs = len(all_subdirs) - len(to_upload)
    if not to_upload:
        console.print(f"[yellow]⚠️ Aucun sous-dossier avec images (nom contenant 'face' ou 'back') dans {batch_dir}[/yellow]")
        return
    if skipped_dirs:
        console.print(f"[dim]   {skipped_dirs} dossier(s) sans image face/back ignoré(s)[/dim]")
    console.print(f"[blue]📤 Upload batch : {len(to_upload)} ref(s), {total_expected} image(s) au total → {batch_dir}[/blue]")
    ok = fail = 0
    failed_refs = []
    total_uploaded = 0
    for subdir, ref, files in to_upload:
        success, count = _upload_one(ref, subdir, backend_url, do_append, silent=False, files_ordered=files)
        if success:
            ok += 1
            total_uploaded += count
        else:
            fail += 1
            failed_refs.append(ref)
    if total_uploaded != total_expected:
        console.print(f"[red]❌ Erreur : {total_uploaded} image(s) uploadée(s) au lieu de {total_expected}. Des images n'ont pas été envoyées.[/red]")
        raise SystemExit(1)
    console.print(f"\n[green]Terminé : {ok} ref(s), {total_uploaded} image(s) uploadée(s), {fail} échec(s)[/green]")
    if failed_refs:
        console.print(f"[red]Refs en échec : {', '.join(failed_refs)}[/red]")
        raise SystemExit(1)
