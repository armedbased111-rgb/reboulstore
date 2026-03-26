from fastapi import APIRouter, HTTPException
from models import BrandConfig
from services.brand_config import load_configs, upsert_brand, delete_brand
from services.ref_status import scan_brand_refs

router = APIRouter()


@router.get("/brands")
def list_brands():
    configs = load_configs()
    result = []
    for name, config in configs.items():
        refs = scan_brand_refs(config)
        counts = {"empty": 0, "needs_generation": 0, "needs_upload": 0, "done": 0}
        for ref in refs:
            counts[ref["status"]] += 1
        result.append({
            "name": name,
            "config": config,
            "total_refs": len(refs),
            **{f"{k}_count": v for k, v in counts.items()},
        })
    return result


@router.post("/brands")
def create_brand(config: BrandConfig):
    upsert_brand(config.name, config.model_dump())
    return {"ok": True}


@router.put("/brands/{name}")
def update_brand(name: str, config: BrandConfig):
    upsert_brand(name, config.model_dump())
    return {"ok": True}


@router.delete("/brands/{name}")
def remove_brand(name: str):
    delete_brand(name)
    return {"ok": True}
