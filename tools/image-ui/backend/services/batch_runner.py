import threading
import asyncio
from pathlib import Path
from typing import Optional
import sys
import os

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent
CLI_PATH = PROJECT_ROOT / "cli"


class BatchRunner:
    def __init__(self):
        self._thread: Optional[threading.Thread] = None
        self._stop_event = threading.Event()
        self._listeners: list[asyncio.Queue] = []
        self._listeners_lock = threading.Lock()
        self.is_running = False
        self.current_job: Optional[dict] = None
        self._loop: Optional[asyncio.AbstractEventLoop] = None

    def register_listener(self, queue: asyncio.Queue):
        with self._listeners_lock:
            self._listeners.append(queue)

    def unregister_listener(self, queue: asyncio.Queue):
        with self._listeners_lock:
            try:
                self._listeners.remove(queue)
            except ValueError:
                pass

    def start(self, job_params: dict, loop: asyncio.AbstractEventLoop):
        if self.is_running:
            raise ValueError("Batch already running")
        self._stop_event.clear()
        self._loop = loop
        self.is_running = True
        self.current_job = job_params
        self._thread = threading.Thread(target=self._run, args=(job_params,), daemon=True)
        self._thread.start()

    def stop(self):
        self._stop_event.set()

    def _emit(self, event: dict):
        if self._loop is None:
            return
        with self._listeners_lock:
            listeners = list(self._listeners)
        for queue in listeners:
            asyncio.run_coroutine_threadsafe(queue.put(event), self._loop)

    def _run(self, params: dict):
        try:
            if str(CLI_PATH) not in sys.path:
                sys.path.insert(0, str(CLI_PATH))
            from commands.images_core import run_generate_one, load_env
            load_env()
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                self._emit({"type": "error", "message": "GEMINI_API_KEY manquante"})
                return

            input_dir = Path(params["input_dir"])
            from services.brand_config import resolve_output_dir
            output_dir = resolve_output_dir(params["output_dir"])
            refs_dir_name = params.get("refs_dir", "refs_empty")
            refs_dir = PROJECT_ROOT / refs_dir_name
            skip_existing = params.get("skip_existing", True)
            delay = params.get("delay", 30)
            flash_attempts = params.get("flash_attempts", 4)
            brand_product_type = params.get("product_type", "garment")
            use_flash = params.get("use_flash", True)
            # DB lookup activé si product_type = "auto" ou si la marque est mixte
            use_db_detection = params.get("use_db_detection", True)

            subdirs = sorted([d for d in input_dir.iterdir() if d.is_dir() and not d.name.startswith(".")])
            total = len(subdirs)
            done = 0
            skipped = 0

            target_refs = params.get("target_refs")  # Optional[list[str]] — if set, only process these refs
            if target_refs:
                subdirs = [d for d in subdirs if d.name in target_refs]
                total = len(subdirs)

            for i, subdir in enumerate(subdirs):
                if self._stop_event.is_set():
                    self._emit({"type": "stopped", "message": "Batch interrompu par l'utilisateur"})
                    break

                ref = subdir.name

                # Détection du type via DB (shoe/garment) avec fallback sur brand default
                product_type = brand_product_type
                if use_db_detection:
                    from services.db_lookup import get_product_type_from_db
                    product_type = get_product_type_from_db(ref, fallback=brand_product_type)
                out_dir = output_dir / ref

                # Skip existing check
                if skip_existing and out_dir.exists():
                    files = list(out_dir.iterdir())
                    has_face = any("face" in f.name for f in files if f.is_file())
                    has_back = any("back" in f.name or "top" in f.name for f in files if f.is_file())
                    if has_face and has_back:
                        skipped += 1
                        self._emit({"type": "ref_skipped", "ref": ref, "index": i + 1, "total": total})
                        continue

                self._emit({"type": "ref_start", "ref": ref, "index": i + 1, "total": total})

                def progress_cb(evt_type: str, msg: str, ref=ref):
                    self._emit({"type": "log", "ref": ref, "message": msg})

                def stop_check(event=self._stop_event):
                    return event.is_set()

                try:
                    face_files = [f for f in subdir.iterdir() if f.is_file() and "face" in f.name.lower()]
                    back_files = [f for f in subdir.iterdir() if f.is_file() and "back" in f.name.lower()]
                    if not face_files:
                        all_photos = [
                            f for f in subdir.iterdir()
                            if f.is_file() and f.suffix.lower() in {'.jpg', '.jpeg', '.png'}
                        ]
                        if not all_photos:
                            self._emit({"type": "ref_error", "ref": ref, "error": "Aucune photo trouvée"})
                            continue
                        face_path = all_photos[0]
                        back_path = all_photos[1] if len(all_photos) > 1 else None
                    else:
                        face_path = face_files[0]
                        back_path = back_files[0] if back_files else None

                    success = run_generate_one(
                        api_key=api_key,
                        face_path=face_path,
                        back_path=back_path,
                        refs_dir=refs_dir,
                        output_dir=out_dir,
                        use_flash=use_flash,
                        flash_attempts=flash_attempts,
                        product_type=product_type,
                        progress_callback=progress_cb,
                        stop_check=stop_check,
                    )
                    done += 1
                    self._emit({
                        "type": "ref_done",
                        "ref": ref,
                        "success": success,
                        "index": i + 1,
                        "total": total,
                        "done": done,
                        "skipped": skipped,
                    })

                    if delay > 0 and i < len(subdirs) - 1 and not self._stop_event.is_set():
                        import time
                        time.sleep(delay)

                except Exception as e:
                    self._emit({"type": "ref_error", "ref": ref, "error": str(e)})

        except Exception as e:
            self._emit({"type": "error", "message": str(e)})
        finally:
            self.is_running = False
            self.current_job = None
            self._emit({"type": "batch_done", "message": "Batch terminé"})


batch_runner = BatchRunner()
