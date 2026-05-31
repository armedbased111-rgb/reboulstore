import sys
from pathlib import Path

# Ajoute le CLI au path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent
CLI_PATH = PROJECT_ROOT / "cli"
if str(CLI_PATH) not in sys.path:
    sys.path.insert(0, str(CLI_PATH))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from routers import brands, refs, images_serve, batch, batch2, upload, adjust, images_manage, campaign, hero, pil

app = FastAPI(title="Reboul Image UI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(brands.router, prefix="/api")
app.include_router(refs.router, prefix="/api")
app.include_router(images_serve.router, prefix="/api")
app.include_router(batch.router, prefix="/api")
app.include_router(batch2.router, prefix="/api")
app.include_router(upload.router, prefix="/api")
app.include_router(adjust.router, prefix="/api")
app.include_router(images_manage.router, prefix="/api")
app.include_router(campaign.router, prefix="/api")
app.include_router(hero.router, prefix="/api")
app.include_router(pil.router, prefix="/api")

# Sert le frontend buildé
dist_dir = Path(__file__).parent.parent / "dist"
if dist_dir.exists():
    app.mount("/", StaticFiles(directory=str(dist_dir), html=True), name="frontend")
