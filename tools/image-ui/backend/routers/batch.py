import asyncio
import json
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import StreamingResponse
<<<<<<< HEAD
from models import BatchStartRequest
from services.batch_runner import batch_runner
from services.brand_config import load_configs
=======
from ..models import BatchStartRequest
from ..services.batch_runner import batch_runner
from ..services.brand_config import load_configs
>>>>>>> 13352e957ee49dc96dc57f1e5d05db5286374c16

router = APIRouter()


@router.post("/batch/start")
async def start_batch(req: BatchStartRequest):
    if batch_runner.is_running:
        raise HTTPException(409, "Un batch est déjà en cours")
    configs = load_configs()
    if req.brand not in configs:
        raise HTTPException(404, f"Marque '{req.brand}' introuvable")
    config = configs[req.brand]
    job_params = {
        "input_dir": config["input_dir"],
        "output_dir": config["output_dir"],
        "refs_dir": req.refs_dir or config.get("refs_dir", "refs_empty"),
        "product_type": req.product_type or config.get("product_type", "garment"),
        "use_flash": req.use_flash,
        "flash_attempts": req.flash_attempts or config.get("flash_attempts", 4),
        "delay": req.delay if req.delay is not None else config.get("delay", 30),
        "skip_existing": req.skip_existing,
<<<<<<< HEAD
        "target_refs": req.target_refs or None,
=======
>>>>>>> 13352e957ee49dc96dc57f1e5d05db5286374c16
    }
    loop = asyncio.get_event_loop()
    batch_runner.start(job_params, loop)
    return {"ok": True, "message": "Batch démarré"}


@router.post("/batch/stop")
def stop_batch():
    batch_runner.stop()
    return {"ok": True}


@router.get("/batch/status")
def batch_status():
    return {
        "is_running": batch_runner.is_running,
        "current_job": batch_runner.current_job,
    }


@router.get("/batch/stream")
async def batch_stream(request: Request):
    queue: asyncio.Queue = asyncio.Queue()
    batch_runner.register_listener(queue)

    async def event_generator():
        try:
            while True:
                if await request.is_disconnected():
                    break
                try:
                    event = await asyncio.wait_for(queue.get(), timeout=15.0)
                    yield f"data: {json.dumps(event)}\n\n"
                    if event.get("type") in ("batch_done", "stopped", "error"):
                        break
                except asyncio.TimeoutError:
                    yield ": keepalive\n\n"
        finally:
            batch_runner.unregister_listener(queue)

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
