"""Commandes roadmap — vault Obsidian (obsidian-vault/Projet/roadmap.md)."""

from __future__ import annotations

import re
from typing import Dict, List, Optional

from utils.vault_paths import (
    ROADMAP_PATH,
    RoadmapSection,
    check_task_in_content,
    extract_sections,
    resolve_roadmap_path,
    touch_roadmap_maj,
)


def _read() -> str:
    path = resolve_roadmap_path()
    if not path.exists():
        raise FileNotFoundError(f"Roadmap introuvable : {path}")
    return path.read_text(encoding="utf-8")


def _write(content: str) -> None:
    path = resolve_roadmap_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content, encoding="utf-8")


class RoadmapUpdater:
    @staticmethod
    def check_task(task_description: str) -> bool:
        content = _read()
        new_content, ok = check_task_in_content(content, task_description)
        if not ok:
            return False
        new_content = touch_roadmap_maj(new_content)
        _write(new_content)
        return True

    @staticmethod
    def mark_section_complete(section_title: str) -> bool:
        """Coche toutes les tâches ouvertes d'une section ##."""
        content = _read()
        sections = extract_sections(content)
        key = _match_section_key(sections, section_title)
        if not key:
            return False
        _, body_start = _split_at_section(content, key)
        if body_start is None:
            return False
        # Cocher toutes les [ ] dans le bloc section
        pattern = rf"(## {re.escape(key)}\n.*?)(?=## |\Z)"
        m = re.search(pattern, content, re.DOTALL)
        if not m:
            return False
        block = m.group(1)
        new_block = re.sub(r"- \[ \]", "- [x]", block)
        if block == new_block:
            return True
        content = content.replace(block, new_block, 1)
        content = touch_roadmap_maj(content)
        _write(content)
        return True

    @staticmethod
    def mark_phase_complete(phase_num: int) -> bool:
        """Compat legacy — mappe vers une section si le numéro n'existe plus."""
        # Plus de phases numérotées : no-op silencieux
        return False


def _match_section_key(sections: Dict[str, RoadmapSection], query: str) -> Optional[str]:
    q = query.strip().lower()
    for title in sections:
        if q in title.lower():
            return title
    return None


def _split_at_section(content: str, section_title: str) -> tuple:
    idx = content.find(f"## {section_title}")
    return (idx >= 0, idx)


class RoadmapChecker:
    @staticmethod
    def validate() -> List[dict]:
        issues: List[dict] = []
        try:
            content = _read()
        except FileNotFoundError as e:
            return [{"type": "Fichier manquant", "message": str(e)}]

        if not ROADMAP_PATH.exists() and resolve_roadmap_path() != ROADMAP_PATH:
            issues.append(
                {
                    "type": "Vault",
                    "message": "obsidian-vault/Projet/roadmap.md absent — fallback legacy",
                }
            )

        sections = extract_sections(content)
        for title, sec in sections.items():
            if sec.total == 0:
                continue
            if sec.completed == sec.total and sec.pending_tasks:
                pass  # cohérent
        return issues


class PhaseGetter:
    @staticmethod
    def details(phase_num: int) -> Optional[dict]:
        return None

    @staticmethod
    def section_details(section_query: str) -> Optional[dict]:
        content = _read()
        sections = extract_sections(content)
        key = _match_section_key(sections, section_query)
        if not key:
            return None
        sec = sections[key]
        pending_preview = "\n".join(f"- {t}" for t in sec.pending_tasks[:5])
        return {
            "title": key,
            "status": "✅ Complète" if sec.total and sec.completed == sec.total else "⏳ En cours",
            "completed": sec.completed,
            "total": sec.total,
            "description": pending_preview or "(aucune tâche en attente)",
        }


class RoadmapStatus:
    @staticmethod
    def all_sections() -> Dict[str, RoadmapSection]:
        return extract_sections(_read())


update_roadmap = RoadmapUpdater()
check_roadmap = RoadmapChecker()
get_phase = PhaseGetter()
