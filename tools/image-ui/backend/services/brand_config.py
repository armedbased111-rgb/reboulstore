import json
from pathlib import Path
from typing import Optional

# brand_configs.json est dans tools/image-ui/
CONFIGS_PATH = Path(__file__).resolve().parent.parent.parent / "brand_configs.json"
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent


def load_configs() -> dict:
    if not CONFIGS_PATH.exists():
        return {}
    with open(CONFIGS_PATH) as f:
        return json.load(f)


def save_configs(configs: dict):
    with open(CONFIGS_PATH, "w") as f:
        json.dump(configs, f, indent=2, ensure_ascii=False)


def get_brand(name: str) -> Optional[dict]:
    configs = load_configs()
    return configs.get(name)


def upsert_brand(name: str, config: dict):
    configs = load_configs()
    configs[name] = config
    save_configs(configs)


def delete_brand(name: str):
    configs = load_configs()
    configs.pop(name, None)
    save_configs(configs)


def resolve_output_dir(output_dir: str) -> Path:
    """Résout output_dir relatif à PROJECT_ROOT."""
    p = Path(output_dir)
    if p.is_absolute():
        return p
    return (PROJECT_ROOT / output_dir).resolve()
