"""Contexte Cursor — génération et sync depuis le vault Obsidian."""

from __future__ import annotations

from datetime import datetime
from typing import Dict

from utils.docs_syncer import synchronize_all_docs
from utils.vault_paths import (
    CURSOR_CONTEXT_SUMMARY,
    REBOUL_PATH,
    ROADMAP_PATH,
    SESSIONS_DIR,
    extract_sections,
    global_task_stats,
    resolve_roadmap_path,
    touch_roadmap_maj,
)


def _read_reboul_excerpt(max_chars: int = 600) -> str:
    if not REBOUL_PATH.exists():
        return "_REBOUL.md introuvable_"
    text = REBOUL_PATH.read_text(encoding="utf-8")
    # Corps après premier titre
    if "# " in text:
        text = text.split("# ", 1)[-1]
        text = "# " + text
    return text.strip()[:max_chars] + ("..." if len(text) > max_chars else "")


def _latest_sessions(n: int = 3) -> str:
    if not SESSIONS_DIR.is_dir():
        return ""
    files = sorted(SESSIONS_DIR.glob("*.md"), reverse=True)[:n]
    if not files:
        return ""
    lines = ["### Dernières sessions\n"]
    for f in files:
        lines.append(f"- `{f.name}`")
    return "\n".join(lines) + "\n"


class ContextGenerator:
    @staticmethod
    def create_summary() -> str:
        roadmap_path = resolve_roadmap_path()
        if not roadmap_path.exists():
            return "# Erreur\n\nRoadmap vault introuvable.\n"

        content = roadmap_path.read_text(encoding="utf-8")
        sections = extract_sections(content)
        done, total = global_task_stats(content)

        summary = f"""# Résumé de contexte — Reboul Store

**Généré le** : {datetime.now().strftime("%d/%m/%Y %H:%M")}
**Source** : vault Obsidian (`obsidian-vault/`)

## Progression globale

**Tâches** : {done}/{total} cochées dans `Projet/roadmap.md`

## Sections roadmap

"""
        for title, sec in sections.items():
            if sec.total == 0:
                continue
            icon = "✅" if sec.completed == sec.total else "🟡"
            summary += f"- {icon} **{title}** — {sec.progress}\n"
            for task in sec.pending_tasks[:3]:
                summary += f"  - [ ] {task[:80]}{'…' if len(task) > 80 else ''}\n"

        summary += f"""
## État projet (extrait REBOUL.md)

{_read_reboul_excerpt()}

{_latest_sessions()}

## Fichiers de référence

| Besoin | Fichier |
|--------|---------|
| État global | `obsidian-vault/REBOUL.md` |
| Roadmap | `obsidian-vault/Projet/roadmap.md` |
| Tâches | `obsidian-vault/TODO.md` |
| Backend | `backend/BACKEND.md` |
| Frontend | `frontend/FRONTEND.md` |

## Commandes utiles

```bash
./rcli roadmap update --task "libellé partiel de la tâche"
./rcli context sync          # maj dates + BACKEND/FRONTEND
./rcli context generate      # ce fichier
./rcli docs sync             # alias sync technique
```

> Anciens fichiers obsolètes : `docs/context/ROADMAP_COMPLETE.md`, `CONTEXT.md`
"""
        return summary


class ContextSyncer:
    @staticmethod
    def synchronize() -> Dict[str, str]:
        """Sync vault + docs techniques + résumé Cursor."""
        results: Dict[str, str] = {}

        roadmap_path = resolve_roadmap_path()
        if roadmap_path.exists():
            try:
                content = roadmap_path.read_text(encoding="utf-8")
                content = touch_roadmap_maj(content)
                roadmap_path.write_text(content, encoding="utf-8")
                results["obsidian-vault/Projet/roadmap.md"] = "✅ maj mise à jour"
            except Exception as e:
                results["obsidian-vault/Projet/roadmap.md"] = f"❌ {e}"
        else:
            results["obsidian-vault/Projet/roadmap.md"] = "❌ fichier absent"

        # BACKEND.md / FRONTEND.md (dates)
        doc_results = synchronize_all_docs()
        results.update(doc_results)

        # Résumé Cursor
        try:
            summary = ContextGenerator.create_summary()
            CURSOR_CONTEXT_SUMMARY.parent.mkdir(parents=True, exist_ok=True)
            CURSOR_CONTEXT_SUMMARY.write_text(summary, encoding="utf-8")
            results[".cursor/context-summary.md"] = "✅ généré"
        except Exception as e:
            results[".cursor/context-summary.md"] = f"❌ {e}"

        if REBOUL_PATH.exists():
            results["obsidian-vault/REBOUL.md"] = "✅ présent (mise à jour manuelle si besoin)"
        else:
            results["obsidian-vault/REBOUL.md"] = "⚠️ absent"

        return results


generate_context = ContextGenerator()
sync_context = ContextSyncer()
