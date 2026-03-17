from pydantic import BaseModel
from typing import Literal, Optional


class BrandConfig(BaseModel):
    name: str
    input_dir: str
    output_dir: str
    product_type: Literal["garment", "shoe"] = "garment"
    refs_dir: str = "refs_empty"
    flash_attempts: int = 4
    delay: int = 30
    use_flash: bool = True


class RefStatus(BaseModel):
    name: str
    status: Literal["empty", "needs_generation", "needs_upload", "done"]
    images: list[str] = []
    input_photo_count: int = 0


class BrandStats(BaseModel):
    name: str
    config: BrandConfig
    total_refs: int
    empty_count: int
    needs_generation_count: int
    needs_upload_count: int
    done_count: int


class BatchStartRequest(BaseModel):
    brand: str
    skip_existing: bool = True
    use_flash: bool = True
    flash_attempts: int = 4
    delay: int = 30
    product_type: str = "garment"
    refs_dir: str = "refs_empty"
