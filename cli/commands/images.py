"""
Commandes images IA (phase 24.10) – pipeline 1 photo → 3–4 images via API Gemini.
"""
import base64
import json
import os
import random
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

# Règle commune : fond uni, pas d’invention
BG = " Plain light grey or white background only. No props, no text, no extra elements. "

# Vue 1 – Face : flat lay, face uniquement, même échelle que le dos
PROMPT_FACE = (
    "Single image: one garment only. Front view, flat lay on a flat surface. "
    "Garment alone—no mannequin, no hanger, no body, no person. "
    "The garment must fill most of the frame (same scale as a back-view flat lay). "
    "Sleeves and hood visible, natural relaxed drape. "
    "Center the garment both horizontally and vertically in the frame: equal left/right margins, consistent small margin above the waistband and below the hem. "
    "The garment must be perfectly straight: waistband perfectly horizontal, legs vertical, no tilt or rotation. "
    "Soft even lighting; only a very subtle soft shadow directly under the garment. No harsh shadows. "
    "Clean product photography for e-commerce. Output only this one image."
    + BG
)
# Vue 2 – Dos : flat lay, dos uniquement, même échelle que la face
PROMPT_BACK = (
    "Single image: one garment only. Back view, flat lay on a flat surface. "
    "Garment alone—no mannequin, no hanger, no body, no person. "
    "The garment must fill most of the frame (same scale as the front-view flat lay). "
    "Back seams, hood and sleeves visible. "
    "Center the garment both horizontally and vertically in the frame: equal left/right margins, consistent small margin above the waistband and below the hem. "
    "The garment must be perfectly straight: waistband perfectly horizontal, legs vertical, no tilt or rotation. "
    "Soft even lighting; only a very subtle soft shadow under the garment. No harsh shadows. "
    "Clean product photography for e-commerce. Output only this one image."
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
GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models"

# Règle absolue (Phase 1) : IMAGE 1 = produit (photos/), IMAGE 2 = ref style (refs/). Ordre API = [prompt, IMAGE 1, IMAGE 2].
# OUTPUT = garment from IMAGE 1 only; cadrage calé sur IMAGE 2; couleur préservée depuis IMAGE 1.
REFERENCE_PROMPT = (
    "You receive two images in order. "
    "IMAGE 1 = THE PRODUCT TO PHOTOGRAPH (our garment—may be on a hanger, any background). This is the garment that MUST appear in your output. "
    "IMAGE 2 = STYLE REFERENCE ONLY. Use ONLY its composition, framing, background and lighting. Do NOT copy or draw the garment from Image 2. "
    "FRAMING (critical): Tight crop like Stone Island e-commerce—the garment must FILL the frame. Minimal empty space above the waistband, below the hem, and on the sides. The product must be the dominant element. "
    "Center the garment both horizontally and vertically in the frame: equal left/right margins, consistent small margin above the waistband and below the hem. "
    "The garment must be perfectly straight: waistband perfectly horizontal, legs vertical, no tilt or rotation. "
    "If IMAGE 2 has wide empty space or an off-center garment, ignore that and use this tight, centered framing instead. "
    "COLOR: Preserve the exact garment color from IMAGE 1; no hue or saturation shift. "
    "TASK: Put the garment from IMAGE 1 into the exact same setup as Image 2 (same flat lay or angle, same crop, same grey/white background, same lighting). "
    "OUTPUT: One image showing IMAGE 1's garment only, photographed like Image 2. No text. "
    "CRITICAL: Do not output the garment from Image 2. The output must show only the garment from Image 1."
)

# Vue dos (2_back) avec 3 images : IMAGE 1 = photo dos, IMAGE 2 = ref style dos, IMAGE 3 = 1_face générée (référence couleur). Couleur du dos = celle de la face.
REFERENCE_BACK_WITH_COLOR_FROM_FRONT = (
    "You receive three images in order. "
    "IMAGE 1 = Back view of the garment (the product to show from behind). "
    "IMAGE 2 = Style reference for framing only (composition, crop, background). Do NOT copy the garment from Image 2. "
    "IMAGE 3 = Front view of the same garment (color reference). The garment color in your output MUST match IMAGE 3 exactly—same hue, same saturation. "
    "FRAMING (critical): Tight crop like Stone Island e-commerce—the garment must FILL the frame. Minimal empty space above the waistband, below the hem, and on the sides. The product must be the dominant element. "
    "Center the garment both horizontally and vertically in the frame: equal left/right margins, consistent small margin above the waistband and below the hem. "
    "The garment must be perfectly straight: waistband perfectly horizontal, legs vertical, no tilt or rotation. "
    "If IMAGE 2 has wide empty space or an off-center garment, ignore that and use this tight, centered framing instead. "
    "OUTPUT: One image showing the back of the garment from IMAGE 1, tight centered framing, with garment color matching IMAGE 3. No text. "
    "CRITICAL: Do not output the garment from Image 2. Output = back view of IMAGE 1's garment, color from IMAGE 3."
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
) -> Optional[bytes]:
    # Ordre : prompt → IMAGE 1 (produit) → IMAGE 2 (ref style) → [IMAGE 3 ref couleur] → [IMAGE 4 ref même mannequin].
    parts = [{"text": prompt}, {"inline_data": {"mime_type": mime, "data": image_b64}}]  # IMAGE 1
    if ref_b64 and ref_mime:
        parts.append({"inline_data": {"mime_type": ref_mime, "data": ref_b64}})  # IMAGE 2
    if color_ref_b64 and color_ref_mime:
        parts.append({"inline_data": {"mime_type": color_ref_mime, "data": color_ref_b64}})  # IMAGE 3 (ex. 1_face pour couleur dos)
    if model_ref_b64 and model_ref_mime:
        parts.append({"inline_data": {"mime_type": model_ref_mime, "data": model_ref_b64}})  # IMAGE 4 (ex. 3_detail_logo pour même personne en 4)
    model = GEMINI_REF_MODEL if ((ref_b64 and ref_mime) or color_ref_b64 or use_ref_model or (model_ref_b64 and model_ref_mime)) else GEMINI_MODEL
    url = f"{GEMINI_BASE}/{model}:generateContent"
    # 1_face et 2_back : reproductibilité. 3 et 4 : même seed par produit = même mannequin pour ce produit.
    gen_config: dict = {"responseModalities": ["TEXT", "IMAGE"]}
    if use_variation:
        gen_config["temperature"] = 1.0
        gen_config["seed"] = seed if seed is not None else random.randint(0, 2**31 - 1)
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

    use_pro = not use_flash
    max_attempts = 3
    written = 0
    product_seed = random.randint(0, 2**31 - 1)  # 1 ref produit = 1 mannequin : même seed pour 3
    for name, img_b64, mime, prompt, r_b64, r_mime in steps:
        pass_color_b64, pass_color_mime = None, None
        pass_model_ref_b64, pass_model_ref_mime = None, None
        if use_pro:
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
        out_bytes = None
        for attempt in range(max_attempts):
            try:
                out_bytes = _call_gemini(
                    api_key, img_b64, mime, prompt_to_use,
                    ref_b64=pass_r_b64, ref_mime=pass_r_mime, use_ref_model=use_ref_model,
                    color_ref_b64=pass_color_b64, color_ref_mime=pass_color_mime,
                    use_variation=(name in ("3_detail_logo", "4_lifestyle")),
                    seed=product_seed if name in ("3_detail_logo", "4_lifestyle") else None,
                    model_ref_b64=pass_model_ref_b64, model_ref_mime=pass_model_ref_mime,
                )
                if out_bytes:
                    break
            except requests.HTTPError as e:
                if e.response.status_code == 429 and attempt < max_attempts - 1:
                    time.sleep(60)
                    continue
                break
            except Exception:
                break
        if not out_bytes:
            continue
        (output_dir / f"{name}.png").write_bytes(out_bytes)
        written += 1
    return written > 0


@click.group()
def images():
    """Images IA (Gemini) – 1 photo → 3–4 images produit"""
    pass


@images.command("generate")
@click.option("--input-dir", "input_dir", default="photos", type=click.Path(path_type=Path), help="Dossier des photos produit (face.jpg, back.jpg)")
@click.option("--refs-dir", "refs_dir", default="refs", type=click.Path(path_type=Path), help="Dossier refs (sous-dossiers face/, back/, details/, lifestyle/ ou fichiers face.jpg, 2_back.png, …)")
@click.option("--face", "face_path", default=None, type=click.Path(exists=True, path_type=Path), help="Photo face (optionnel si input-dir contient face.jpg)")
@click.option("--back", "back_path", default=None, type=click.Path(exists=True, path_type=Path), help="Photo dos (optionnel)")
@click.option("--gemini-flash", "use_flash", is_flag=True, help="Utiliser Gemini 2.5 Flash (économique, plus de retouches possibles)")
@click.option("-o", "output_dir", default="./output", type=click.Path(path_type=Path), help="Dossier de sortie")
def generate(input_dir, refs_dir, face_path, back_path, use_flash, output_dir):
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

    if not face_path:
        face_path = _find_in_dir(input_dir, "face", "1_face")
    if not face_path:
        console.print("[red]❌ Aucune photo face. Mettez face.jpg ou 1_face.jpg dans photos/ (ou --input-dir).[/red]")
        raise SystemExit(1)
    if not back_path:
        back_path = _find_in_dir(input_dir, "back", "2_back")

    ref_face_path = _pick_one_ref(_list_refs_for_view(refs_dir, "face"))
    ref_back_path = _pick_one_ref(_list_refs_for_view(refs_dir, "back"))
    ref_detail_path = _pick_one_ref(_list_refs_for_view(refs_dir, "detail"))
    ref_lifestyle_path = _pick_one_ref(_list_refs_for_view(refs_dir, "lifestyle"))

    refs_found = [ref_face_path, ref_back_path, ref_detail_path, ref_lifestyle_path]
    if any(refs_found):
        console.print(f"[blue]📷 Refs utilisées : face={ref_face_path is not None}, back={ref_back_path is not None}, detail={ref_detail_path is not None}, lifestyle={ref_lifestyle_path is not None}[/blue]")
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

    use_pro = not use_flash
    if use_pro:
        console.print("[blue]Gemini 3 Pro (défaut)[/blue]")
    else:
        console.print("[yellow]Gemini 2.5 Flash (économique)[/yellow]")

    max_attempts = 3
    product_seed = random.randint(0, 2**31 - 1)  # 1 ref produit = 1 mannequin pour 3 et 4
    for name, img_b64, mime, prompt, r_b64, r_mime in steps:
        console.print(f"[blue]🔄 {name}...[/blue]")
        pass_color_b64, pass_color_mime = None, None
        pass_model_ref_b64, pass_model_ref_mime = None, None
        if use_pro:
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
        out_bytes = None
        for attempt in range(max_attempts):
            try:
                out_bytes = _call_gemini(
                    api_key, img_b64, mime, prompt_to_use,
                    ref_b64=pass_r_b64, ref_mime=pass_r_mime, use_ref_model=use_ref_model,
                    color_ref_b64=pass_color_b64, color_ref_mime=pass_color_mime,
                    use_variation=(name in ("3_detail_logo", "4_lifestyle")),
                    seed=product_seed if name in ("3_detail_logo", "4_lifestyle") else None,
                    model_ref_b64=pass_model_ref_b64, model_ref_mime=pass_model_ref_mime,
                )
                if out_bytes:
                    break
                if attempt < max_attempts - 1:
                    console.print(f"[yellow]  Retry {attempt + 2}/{max_attempts}...[/yellow]")
            except requests.HTTPError as e:
                if e.response.status_code == 429 and attempt < max_attempts - 1:
                    console.print(f"[yellow]  Rate limit (429), attente 60s puis retry…[/yellow]")
                    time.sleep(60)
                    continue
                console.print(f"[red]❌ {name}: {e.response.status_code} {e.response.text[:200]}[/red]")
                break
            except Exception as e:
                console.print(f"[red]❌ {name}: {e}[/red]")
                break
        if not out_bytes:
            console.print(f"[yellow]⚠️ {name}: pas d'image après {max_attempts} essais[/yellow]")
            continue
        out_path = output_dir / f"{name}.png"
        out_path.write_bytes(out_bytes)
        console.print(f"[green]✅ {out_path}[/green]")

    console.print(f"\n[green]Terminé. Fichiers dans {output_dir}[/green]")


@images.command("generate-batch")
@click.option("--input-dir", "input_dir", required=True, type=click.Path(path_type=Path), help="Dossier parent : un sous-dossier par ref (nom = ref avec '-' au lieu de '/', ex. L100001-V09A)")
@click.option("--refs-dir", "refs_dir", default="refs", type=click.Path(path_type=Path), help="Dossier refs (sous-dossiers face/, back/, details/, lifestyle/ ou fichiers à la racine)")
@click.option("-o", "output_dir", default="./output_batch", type=click.Path(path_type=Path), help="Dossier de sortie (un sous-dossier par ref)")
@click.option("--skip-existing", is_flag=True, help="Ne pas régénérer si 1_face.png existe déjà pour cette ref")
@click.option("--upload", "do_upload", is_flag=True, help="Après chaque génération, uploader les images vers le backend")
@click.option("--backend", "backend_url", default="http://localhost:3001", help="URL du backend (pour --upload)")
@click.option("--gemini-flash", "use_flash", is_flag=True, help="Utiliser Gemini 2.5 Flash (économique)")
@click.option("--delay", default=2, type=float, help="Délai en secondes entre chaque ref (éviter rate limit 429, défaut 2)")
def generate_batch(input_dir, refs_dir, output_dir, skip_existing, do_upload, backend_url, use_flash, delay):
    """Parcourt les sous-dossiers de --input-dir, génère les images pour chaque ref (un sous-dossier = une ref). Optionnel : --upload pour enchaîner l'upload."""
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
                if _upload_one(ref, out_dir, backend_url, False, silent=True):
                    console.print(f"  [green]✅ déjà présent + uploadé[/green]")
                else:
                    fail_count += 1
                    failed_refs.append(ref)
            continue
        console.print(f"[blue][{i}/{len(subdirs)}] {ref}[/blue]")
        if _run_generate_one(api_key, subdir, refs_dir, out_dir, use_flash):
            if do_upload:
                if _upload_one(ref, out_dir, backend_url, False, silent=True):
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
        if delay > 0 and i < len(subdirs):
            time.sleep(delay)
    console.print(f"\n[green]Terminé : {ok_count} générés, {skip_count} ignorés (--skip-existing), {fail_count} échec(s)[/green]")
    if failed_refs:
        console.print("[red]Refs en échec : %s[/red]" % ", ".join(failed_refs))


ADJUST_SYSTEM = (
    "You are an image editor. You MUST modify this product photography image according to the following instruction. "
    "The output MUST be visibly different where the instruction applies. Do NOT return the image unchanged. "
    "Instruction: {prompt}. "
    "Keep the same background and lighting unless the instruction says otherwise. Output only the modified image, no text."
)


@images.command("adjust")
@click.option("--image", "image_path", required=True, type=click.Path(exists=True, path_type=Path), help="Image à ajuster (ex: output/1_face.png)")
@click.option("--prompt", "adjust_prompt", required=True, help="Consigne d'ajustement (ex: More relaxed sleeves)")
@click.option("--ref", "ref_path", default=None, type=click.Path(exists=True, path_type=Path), help="Image de référence (ex: output/1_face.png pour caler les couleurs)")
@click.option("-o", "output_path", default=None, type=click.Path(path_type=Path), help="Fichier de sortie (défaut: même dossier, suffixe _adjusted)")
@click.option("--gemini-pro", "use_pro", is_flag=True, help="Utiliser Gemini 3 Pro (plus cher, meilleur rendu)")
def adjust(image_path, adjust_prompt, ref_path, output_path, use_pro):
    """Deuxième passe : envoie une image déjà générée + une consigne d'ajustement. Sortie : image modifiée. --ref pour s'appuyer sur une image (ex: couleurs)."""
    _load_env()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        console.print("[red]❌ GEMINI_API_KEY manquante. Ajoute-la dans .env à la racine.[/red]")
        raise SystemExit(1)

    image_path = Path(image_path).resolve()
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
        use_pro = True

    if output_path is not None:
        output_path = Path(output_path).resolve()
        if output_path.is_dir() or output_path.suffix not in (".png", ".jpg", ".jpeg"):
            output_path = output_path / f"{image_path.stem}_adjusted.png"
    else:
        output_path = image_path.parent / f"{image_path.stem}_adjusted.png"

    output_path.parent.mkdir(parents=True, exist_ok=True)

    console.print(f"[blue]🔄 Ajustement : {image_path.name} avec « {adjust_prompt} »[/blue]")
    if ref_b64:
        console.print(f"[dim]   Référence : {ref_path.name}[/dim]")
    img_b64, mime = _encode_image(image_path)
    try:
        out_bytes = _call_gemini(
            api_key, img_b64, mime, prompt_text,
            ref_b64=ref_b64, ref_mime=ref_mime, use_ref_model=use_pro or bool(ref_b64),
        )
        if not out_bytes:
            console.print("[yellow]⚠️ Pas d'image dans la réponse.[/yellow]")
            raise SystemExit(1)
        output_path.write_bytes(out_bytes)
        console.print(f"[green]✅ {output_path}[/green]")
    except requests.HTTPError as e:
        console.print(f"[red]❌ {e.response.status_code} {e.response.text[:200]}[/red]")
        raise SystemExit(1)
    except Exception as e:
        console.print(f"[red]❌ {e}[/red]")
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


# Ordre des images pour l'upload (nom de base sans extension)
UPLOAD_IMAGE_ORDER = ["1_face", "2_back", "3_detail_logo"]


def _upload_one(
    reference: str,
    image_dir: Path,
    backend_url: str,
    do_append: bool,
    silent: bool = False,
) -> bool:
    """Upload les images du dossier vers le produit (ref). Retourne True en cas de succès."""
    image_dir = Path(image_dir).resolve()
    if not image_dir.is_dir():
        if not silent:
            console.print(f"[red]❌ Dossier introuvable : {image_dir}[/red]")
        return False
    product_id = _get_product_id_by_ref(reference)
    if not product_id:
        if not silent:
            console.print(f"[red]❌ Aucun produit pour « {reference} »[/red]")
        return False
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
            return False
    files_to_upload = []
    for name in UPLOAD_IMAGE_ORDER:
        for ext in (".png", ".jpg", ".jpeg"):
            p = image_dir / (name + ext)
            if p.exists():
                files_to_upload.append((name, p))
                break
    if not files_to_upload:
        if not silent:
            console.print(f"[yellow]⚠️ Aucune image dans {image_dir}[/yellow]")
        return False
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
        return False
    finally:
        for fh in file_handles:
            fh.close()
    if not silent:
        console.print(f"[green]✅ {len(files_to_upload)} image(s) → {reference}[/green]")
    return True


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
