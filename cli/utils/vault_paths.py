"""Chemins vault Obsidian — source de vérité projet Reboul Store."""

from __future__ import annotations

import re
from dataclasses import dataclass
from datetime import date
from pathlib import Path
from typing import Dict, List, Optional, Tuple


def project_root() -> Path:
    return Path(__file__).resolve().parent.parent.parent


VAULT_DIR = project_root() / "obsidian-vault"
REBOUL_PATH = VAULT_DIR / "REBOUL.md"
ROADMAP_PATH = VAULT_DIR / "Projet" / "roadmap.md"
TODO_PATH = VAULT_DIR / "TODO.md"
SESSIONS_DIR = VAULT_DIR / "Sessions"
BACKEND_DOC = project_root() / "backend" / "BACKEND.md"
FRONTEND_DOC = project_root() / "frontend" / "FRONTEND.md"
CURSOR_CONTEXT_SUMMARY = project_root() / ".cursor" / "context-summary.md"

# Anciens chemins (fallback lecture seule si vault absent)
LEGACY_ROADMAP = project_root() / "docs" / "context" / "ROADMAP_COMPLETE.md"
LEGACY_CONTEXT = project_root() / "docs" / "context" / "CONTEXT.md"


def resolve_roadmap_path() -> Path:
    if ROADMAP_PATH.exists():
        return ROADMAP_PATH
    if LEGACY_ROADMAP.exists():
        return LEGACY_ROADMAP
    return ROADMAP_PATH


@dataclass
class RoadmapSection:
    title: str
    completed: int
    total: int
    pending_tasks: List[str]

    @property
    def progress(self) -> str:
        return f"{self.completed}/{self.total}"


def _strip_frontmatter(content: str) -> Tuple[Optional[str], str]:
    if not content.startswith("---"):
        return None, content
    end = content.find("\n---", 3)
    if end == -1:
        return None, content
    fm = content[3:end].strip()
    body = content[end + 4 :].lstrip("\n")
    return fm, body


def _parse_frontmatter_maj(fm: Optional[str]) -> Optional[str]:
    if not fm:
        return None
    m = re.search(r"^maj:\s*(\S+)", fm, re.MULTILINE)
    return m.group(1) if m else None


def extract_sections(content: str) -> Dict[str, RoadmapSection]:
    """Sections ## de la roadmap thématique (hors frontmatter)."""
    _, body = _strip_frontmatter(content)
    sections: Dict[str, RoadmapSection] = {}
    parts = re.split(r"\n(?=## )", body)

    for part in parts:
        if not part.strip().startswith("## "):
            continue
        lines = part.split("\n")
        title = lines[0].replace("## ", "").strip()
        if title.startswith("#"):
            continue
        block = "\n".join(lines[1:])
        completed = len(re.findall(r"- \[x\]", block))
        total = len(re.findall(r"- \[[ x]\]", block))
        pending: List[str] = []
        for line in block.splitlines():
            m = re.match(r"- \[ \]\s+(.+)", line.strip())
            if m:
                pending.append(m.group(1).strip())

        sections[title] = RoadmapSection(
            title=title,
            completed=completed,
            total=total,
            pending_tasks=pending[:8],
        )
    return sections


def find_task_line(content: str, query: str) -> Optional[str]:
    """Trouve une ligne tâche contenant query (insensible à la casse)."""
    q = query.strip().lower()
    if not q:
        return None
    for line in content.splitlines():
        if not re.match(r"- \[[ x]\]", line.strip()):
            continue
        if q in line.lower():
            return line
    return None


def check_task_in_content(content: str, query: str) -> Tuple[str, bool]:
    """Coche la tâche correspondant à query. Retourne (nouveau contenu, succès)."""
    line = find_task_line(content, query)
    if not line:
        return content, False
    if "- [x]" in line:
        return content, True
    new_line = re.sub(r"- \[ \]", "- [x]", line, count=1)
    return content.replace(line, new_line, 1), True


def touch_roadmap_maj(content: str) -> str:
    """Met à jour maj: dans le frontmatter YAML."""
    today = date.today().isoformat()
    fm, body = _strip_frontmatter(content)
    if fm is None:
        return f"---\nmaj: {today}\n---\n\n{content}"
    if re.search(r"^maj:\s*", fm, re.MULTILINE):
        fm = re.sub(r"^maj:\s*\S+", f"maj: {today}", fm, flags=re.MULTILINE)
    else:
        fm = fm.rstrip() + f"\nmaj: {today}"
    return f"---\n{fm}\n---\n\n{body}"


def global_task_stats(content: str) -> Tuple[int, int]:
    completed = len(re.findall(r"- \[x\]", content))
    total = len(re.findall(r"- \[[ x]\]", content))
    return completed, total
