# `/claude-code-workflow` – Workflow Toi + Cursor + Claude Code + CLI

**Objectif** : Faire travailler ensemble **toi**, **Cursor** (moi), **Claude Code** (terminal) et le **CLI** (`./rcli`) dans un même flux. Cursor ne peut pas lancer Claude, mais peut te dire **quand** passer par Claude et **quel prompt** coller.

---

## 1. Qui fait quoi

| Acteur | Rôle |
|--------|------|
| **Toi** | Tu décides, tu valides, tu passes d’un outil à l’autre. |
| **Cursor** (moi) | Code, architecture, règles projet, revue, explications. Je suggère d’utiliser Claude Code pour les tâches batch/CLI et je te donne un prompt prêt à coller. |
| **Claude Code** | Terminal : exécute `./rcli`, git, enchaînements (batch images, db ref, docs sync, commits). Il lit `CLAUDE.md` et les docs. |
| **CLI `./rcli`** | Point d’entrée commun : db, images, roadmap, docs, server. Utilisé par toi, par Cursor (terminal), et par Claude quand il exécute des commandes. |

**Boucle typique** : Tu travailles dans Cursor avec moi → tu as une tâche batch/CLI → je te dis « pour ça ouvre Claude Code et colle ce prompt » → tu exécutes dans le terminal → tu reviens dans Cursor pour la suite (code, revue, etc.).

---

## 2. Quand utiliser Claude Code (et pas Cursor)

- **Batch images** : liste de refs → pour chaque ref : `db ref` puis `images generate` puis `images upload`.
- **Vérif de refs en masse** : feuille de stock / CSV → pour chaque ref : `./rcli db ref REF` et résumer les erreurs.
- **Doc / roadmap** : `./rcli docs sync`, cocher des tâches dans ROADMAP_COMPLETE.md, commit avec message conventionnel.
- **Après une session** : « commit mes changements avec un message feat: … », « mets à jour la roadmap pour la tâche X ».
- **Code front (optionnel)** : refactors ciblés, ajout d’un composant/page sur demande (« add a price filter to Catalog »). Claude a le contexte dans CLAUDE.md (section Frontend) et peut lire `frontend/FRONTEND.md`. Pour les features avec Figma / animations AnimeJS / règles détaillées, privilégier Cursor.

**Quand rester dans Cursor** : features avec Figma, animations AnimeJS, règles projet détaillées, architecture, revue pas à pas.

---

## 3. Prompts prêts à coller dans Claude Code

Ouvre un terminal dans le repo, lance `claude`, puis colle l’un des prompts ci‑dessous (à adapter si besoin).

### Batch images (plusieurs refs)

```text
I have a list of product refs in refs_batch.txt (one ref per line). For each ref: 1) Run ./rcli db ref REF to check the product exists. 2) If it exists, run ./rcli images generate --input-dir photos/REF -o output/ (assume I have photos in photos/REF for each ref). 3) Then run ./rcli images upload --ref REF --dir output/ (replace existing images by default). Skip refs that don't exist. Summarize successes and failures.
```

*(Adapte le chemin des photos si ta structure est différente, ex. un seul dossier `photos/` avec des sous-dossiers par ref.)*

### Vérifier des refs (feuille de stock)

```text
I have a file refs.txt with one product reference per line. For each line, run ./rcli db ref REF and tell me which refs exist and which don't. At the end give a summary: X found, Y not found, list the not found refs.
```

### Sync doc + mise à jour roadmap

```text
Run ./rcli docs sync and tell me the result. Then in docs/context/ROADMAP_COMPLETE.md, check the following task: [COLLER LA TÂCHE EXACTE]. Don't change anything else.
```

### Commit après session

```text
What files have I changed? Then commit with a conventional message: type(scope): short description. Use feat, fix, docs, or chore as appropriate.
```

### Backup avant migration

```text
Before we run a database migration, run ./rcli db backup --server and confirm the backup file was created.
```

### Exemple tâche frontend

```text
Read frontend/FRONTEND.md and the Frontend section in CLAUDE.md. Then add a price range filter (min/max) to frontend/src/pages/Catalog.tsx using Tailwind and shadcn if needed. Keep the code concise and follow the existing structure.
```

*(À adapter selon la tâche : composant, page, hook, etc.)*

---

## 4. Workflow automatique (ce que je fais de mon côté)

- Quand tu demandes un **batch images**, une **vérif de refs en masse**, un **docs sync**, une **mise à jour roadmap** ou un **commit de session**, je peux :
  1. Te dire d’utiliser **Claude Code** pour cette partie.
  2. Te donner un **prompt prêt à coller** (comme ceux ci‑dessus), adapté à ta demande.
- On garde le **même contexte** : CLAUDE.md pour Claude, project-rules pour Cursor, `./rcli` pour les deux.

---

## 5. Références

- **Contexte détaillé** : `docs/context/CLAUDE_CODE_CURSOR_CONTEXT.md`
- **Contexte Claude** : `CLAUDE.md` (racine)
- **Pipeline images** : `docs/integrations/IMAGES_PRODUIT_PIPELINE.md`
- **CLI DB** : `docs/context/DB_CLI_USAGE.md`
- **Plan 24.11** : `docs/context/ROADMAP_COMPLETE.md` § 24.11
