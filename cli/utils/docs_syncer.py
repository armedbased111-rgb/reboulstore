"""
Synchronisation documentation — vault Obsidian + BACKEND.md / FRONTEND.md
"""

from __future__ import annotations

from datetime import datetime
from pathlib import Path
from typing import Dict, Optional, Tuple
import re

from utils.vault_paths import (
    BACKEND_DOC,
    FRONTEND_DOC,
    ROADMAP_PATH,
    extract_sections,
    global_task_stats,
    resolve_roadmap_path,
    touch_roadmap_maj,
)


def _touch_doc_date(doc_path: Path, label: str) -> Tuple[bool, str]:
    if not doc_path.exists():
        return False, f"⚠️  {label} introuvable"
    content = doc_path.read_text(encoding="utf-8")
    new_date = datetime.now().strftime("%d/%m/%Y à %H:%M")
    date_pattern = r"(\*\*Dernière mise à jour\*\* : ).*"
    if re.search(date_pattern, content):
        content = re.sub(date_pattern, f"\\g<1>{new_date}", content)
    else:
        content = f"**Dernière mise à jour** : {new_date}\n\n" + content
    doc_path.write_text(content, encoding="utf-8")
    return True, f"✅ {label} — date mise à jour"


def _update_vault_roadmap(roadmap_path: Path) -> Tuple[bool, str]:
    if not roadmap_path.exists():
        return False, f"❌ Roadmap introuvable : {roadmap_path}"
    content = roadmap_path.read_text(encoding="utf-8")
    content = touch_roadmap_maj(content)
    roadmap_path.write_text(content, encoding="utf-8")
    done, total = global_task_stats(content)
    rel = "obsidian-vault/Projet/roadmap.md" if roadmap_path.name == "roadmap.md" else roadmap_path.name
    return True, f"✅ {rel} — maj + {done}/{total} tâches"


def _generate_changelog_from_vault(roadmap_path: Path, output_path: Optional[Path] = None) -> Optional[str]:
    if not roadmap_path.exists():
        return None
    content = roadmap_path.read_text(encoding="utf-8")
    sections = extract_sections(content)
    changelog = f"""# Changelog — Reboul Store

> Généré automatiquement le {datetime.now().strftime("%d/%m/%Y à %H:%M")}
> Source : `obsidian-vault/Projet/roadmap.md`

"""
    for title, sec in sections.items():
        if sec.completed == 0:
            continue
        changelog += f"## {title} ({sec.completed}/{sec.total})\n\n"
        for line in content.splitlines():
            if line.strip().startswith("- [x]") and title in content:
                # tâches cochées dans le fichier — inclure si dans la section (approximation)
                task = re.sub(r"^- \[x\]\s+", "", line.strip())
                if len(task) > 3:
                    changelog += f"- {task}\n"
        changelog += "\n"
    if output_path:
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(changelog, encoding="utf-8")
    return changelog


def synchronize_all_docs() -> Dict[str, str]:
    results: Dict[str, str] = {}
    roadmap_path = resolve_roadmap_path()

    ok, msg = _update_vault_roadmap(roadmap_path)
    results["roadmap"] = msg

    sections = {}
    if roadmap_path.exists():
        sections = extract_sections(roadmap_path.read_text(encoding="utf-8"))
    results["sections"] = f"✅ {len(sections)} sections thématiques"

    ok_b, msg_b = _touch_doc_date(BACKEND_DOC, "BACKEND.md")
    results["backend_sync"] = msg_b

    ok_f, msg_f = _touch_doc_date(FRONTEND_DOC, "FRONTEND.md")
    results["frontend_sync"] = msg_f

    return results


def generate_changelog(output_file: Optional[str] = None) -> Optional[str]:
    from utils.vault_paths import project_root

    base = project_root()
    roadmap_path = resolve_roadmap_path()
    if output_file:
        output_path = base / output_file
    else:
        output_path = base / "docs" / "CHANGELOG.md"
    changelog = _generate_changelog_from_vault(roadmap_path, output_path)
    if changelog:
        return str(output_path.relative_to(base))
    return None
