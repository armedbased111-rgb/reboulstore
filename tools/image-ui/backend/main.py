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

<<<<<<< HEAD
from routers import brands, refs, images_serve, batch, upload, adjust, images_manage, campaign, hero
=======
from routers import brands, refs, images_serve, batch, upload
>>>>>>> 13352e957ee49dc96dc57f1e5d05db5286374c16

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
app.include_router(upload.router, prefix="/api")
<<<<<<< HEAD
app.include_router(adjust.router, prefix="/api")
app.include_router(images_manage.router, prefix="/api")
app.include_router(campaign.router, prefix="/api")
app.include_router(hero.router, prefix="/api")
=======
>>>>>>> 13352e957ee49dc96dc57f1e5d05db5286374c16

# Sert le frontend buildé
dist_dir = Path(__file__).parent.parent / "dist"
if dist_dir.exists():
    app.mount("/", StaticFiles(directory=str(dist_dir), html=True), name="frontend")
