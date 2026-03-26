import json
import os
import sys
import time
from pathlib import Path
from fastapi import APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from pydantic import BaseModel
from dotenv import dotenv_values

router = APIRouter()

HERO_CONFIG = Path(__file__).resolve().parent.parent.parent.parent.parent / "backend" / "hero_slides.json"
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent
CLI_PATH = PROJECT_ROOT / "cli"


def read_slides() -> list:
    if not HERO_CONFIG.exists():
        return []
    return json.loads(HERO_CONFIG.read_text())


def write_slides(slides: list):
    HERO_CONFIG.write_text(json.dumps(slides, indent=2, ensure_ascii=False))


class HeroSlideCreate(BaseModel):
    imageSrc: str
    title: str
    subtitle: str
    buttonText: str = "Shop now"
    buttonLink: str = "/catalog"


class HeroSlideUpdate(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    buttonText: Optional[str] = None
    buttonLink: Optional[str] = None


@router.get("/hero")
def get_hero_slides():
    return read_slides()


@router.post("/hero")
def add_hero_slide(slide: HeroSlideCreate):
    slides = read_slides()
    new_slide = {
        "id": f"slide_{int(time.time())}",
        **slide.model_dump(),
    }
    slides.append(new_slide)
    write_slides(slides)
    return new_slide


@router.patch("/hero/{slide_id}")
def update_hero_slide(slide_id: str, data: HeroSlideUpdate):
    slides = read_slides()
    for s in slides:
        if s["id"] == slide_id:
            for k, v in data.model_dump(exclude_none=True).items():
                s[k] = v
            write_slides(slides)
            return s
    raise HTTPException(404, "Slide introuvable")


@router.delete("/hero/{slide_id}")
def delete_hero_slide(slide_id: str):
    slides = read_slides()
    updated = [s for s in slides if s["id"] != slide_id]
    if len(updated) == len(slides):
        raise HTTPException(404, "Slide introuvable")
    write_slides(updated)
    return {"ok": True}


@router.post("/hero/upload")
def upload_hero_image(
    brand: str,
    ref: str,
    filename: str,
    title: str = "SS26 Pre Release",
    subtitle: str = "",
    buttonText: str = "Shop now",
    buttonLink: str = "/catalog",
):
    """Upload une image locale vers Cloudinary et l'ajoute aux slides hero."""
    from services.brand_config import load_configs, resolve_output_dir

    configs = load_configs()
    if brand not in configs:
        raise HTTPException(404, "Marque introuvable")
    output_dir = resolve_output_dir(configs[brand]["output_dir"])

    # Cherche dans campaign/ ou directement dans le dossier ref
    img_path = output_dir / ref / "campaign" / filename
    if not img_path.exists():
        img_path = output_dir / ref / filename
    if not img_path.exists():
        raise HTTPException(404, "Image introuvable")

    env = dotenv_values(PROJECT_ROOT / "backend" / ".env")

    try:
        import cloudinary
        import cloudinary.uploader
        cloudinary.config(
            cloud_name=env.get("CLOUDINARY_CLOUD_NAME", ""),
            api_key=env.get("CLOUDINARY_API_KEY", ""),
            api_secret=env.get("CLOUDINARY_API_SECRET", ""),
        )

        slide_id = f"slide_{int(time.time())}"
        result = cloudinary.uploader.upload(
            str(img_path),
            public_id=f"homepage/hero/{slide_id}",
            overwrite=False,
            invalidate=True,
            resource_type="image",
        )

        slides = read_slides()
        new_slide = {
            "id": slide_id,
            "imageSrc": result["secure_url"],
            "title": title,
            "subtitle": subtitle,
            "buttonText": buttonText,
            "buttonLink": buttonLink,
        }
        slides.append(new_slide)
        write_slides(slides)
        return new_slide

    except Exception as e:
        raise HTTPException(500, f"Cloudinary error: {e}")
