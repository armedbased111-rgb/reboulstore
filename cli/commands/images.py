"""
Commandes images IA (phase 24.10) – pipeline 1 photo → 3–4 images via API Gemini.
"""
import base64
import json
import os
import subprocess
import sys
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

# Règle absolue : Image 1 = LE PRODUIT à photographier (dossier photos/ = "les trucs").
# Image 2 = LA REF de style uniquement (dossier refs/ = cadrage, flat lay, fond). On envoie product puis ref dans l'API.
REFERENCE_PROMPT = (
    "You receive two images. IMAGE 1 = THE PRODUCT TO PHOTOGRAPH (our garment—may be on a hanger, any background). "
    "IMAGE 2 = STYLE REFERENCE ONLY: copy ONLY the composition, framing, background and lighting from Image 2. "
    "DO NOT copy or draw the garment from Image 2. The output MUST show THE GARMENT FROM IMAGE 1 ONLY. "
    "Task: put the garment from Image 1 into the exact same setup as Image 2 (same flat lay or same angle, same crop, same grey/white background, same lighting). "
    "Result = Image 1's product, photographed like Image 2. One image only, no text."
)

# Pour les vues 3 (détail) et 4 (lifestyle) : Image 1 = la 1_face DÉJÀ GÉNÉRÉE (source de vérité du vêtement).
# Le modèle doit garder ce vêtement à l’identique et ne changer que la présentation (personne qui porte, cadrage).
REFERENCE_FROM_SOURCE_OF_TRUTH = (
    "IMAGE 1 = THE EXACT GARMENT (source of truth—this is the product already generated). "
    "IMAGE 2 = style reference for this view (framing, pose, background). "
    "Output = THE GARMENT FROM IMAGE 1 ONLY, presented in the style of Image 2. "
    "DO NOT change the garment: same color, same design, same logo, same details. Only change how it is presented (person wearing, crop, angle). "
    "One image only, no text."
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


def _call_gemini(
    api_key: str,
    image_b64: str,
    mime: str,
    prompt: str,
    ref_b64: Optional[str] = None,
    ref_mime: Optional[str] = None,
    use_ref_model: bool = False,
) -> Optional[bytes]:
    # Ordre envoyé à Gemini : 1) prompt, 2) image produit (photos/ = truc), 3) image ref (refs/ = style). Ne pas inverser.
    parts = [{"text": prompt}, {"inline_data": {"mime_type": mime, "data": image_b64}}]
    if ref_b64 and ref_mime:
        parts.append({"inline_data": {"mime_type": ref_mime, "data": ref_b64}})
    model = GEMINI_REF_MODEL if ((ref_b64 and ref_mime) or use_ref_model) else GEMINI_MODEL
    url = f"{GEMINI_BASE}/{model}:generateContent"
    body = {
        "contents": [{"parts": parts}],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]},
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


@click.group()
def images():
    """Images IA (Gemini) – 1 photo → 3–4 images produit"""
    pass


@images.command("generate")
@click.option("--input-dir", "input_dir", default="photos", type=click.Path(path_type=Path), help="Dossier des photos produit (face.jpg, back.jpg)")
@click.option("--refs-dir", "refs_dir", default="refs", type=click.Path(path_type=Path), help="Dossier des images de référence (1_face.png, 2_back.png, …)")
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

    ref_face_path = _find_in_dir(refs_dir, "1_face", "face")
    ref_back_path = _find_in_dir(refs_dir, "2_back", "back")
    ref_detail_path = _find_in_dir(refs_dir, "3_detail_logo", "3_details_logo", "3-detail")
    ref_lifestyle_path = _find_in_dir(refs_dir, "4_lifestyle", "4-lifestyle")

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
        ("4_lifestyle", face_b64, face_mime, PROMPT_LIFESTYLE, ref_lifestyle_b64, ref_lifestyle_mime),
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
    for name, img_b64, mime, prompt, r_b64, r_mime in steps:
        console.print(f"[blue]🔄 {name}...[/blue]")
        if use_pro:
            prompt_to_use = REFERENCE_PROMPT if (r_b64 and r_mime) else prompt
            pass_r_b64, pass_r_mime, use_ref_model = r_b64, r_mime, True
            # Vues 3 et 4 : s’appuyer sur la 1_face déjà générée comme source de vérité (même vêtement)
            if name in ("3_detail_logo", "4_lifestyle") and (r_b64 and r_mime):
                source_path = output_dir / "1_face.png"
                if source_path.exists():
                    img_b64, mime = _encode_image(source_path)
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
                )
                if out_bytes:
                    break
                if attempt < max_attempts - 1:
                    console.print(f"[yellow]  Retry {attempt + 2}/{max_attempts}...[/yellow]")
            except requests.HTTPError as e:
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
UPLOAD_IMAGE_ORDER = ["1_face", "2_back", "3_detail_logo", "4_lifestyle"]


@images.command("upload")
@click.option("--ref", "reference", required=True, help="Référence produit (ex: L100001/V09A)")
@click.option("--dir", "image_dir", default="output", type=click.Path(path_type=Path), help="Dossier contenant les images (1_face.png, 2_back.png, …)")
@click.option("--backend", "backend_url", default="http://localhost:3001", help="URL du backend Reboul (pour POST /products/:id/images/bulk)")
@click.option("--replace", "do_replace", is_flag=True, help="Remplacer les images existantes (supprime les anciennes sur Cloudinary + BDD puis upload)")
def upload(reference, image_dir, backend_url, do_replace):
    """Upload les images du dossier vers Cloudinary et les attache au produit (ref). Backend doit être démarré."""
    image_dir = Path(image_dir).resolve()
    if not image_dir.is_dir():
        console.print(f"[red]❌ Dossier introuvable : {image_dir}[/red]")
        raise SystemExit(1)

    product_id = _get_product_id_by_ref(reference)
    if not product_id:
        console.print(f"[red]❌ Aucun produit trouvé pour la référence « {reference} ». Lance : ./rcli db product-find --ref {reference}[/red]")
        raise SystemExit(1)

    base_url = backend_url.rstrip("/")

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
