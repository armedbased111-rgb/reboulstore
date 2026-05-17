# new-project-workflow

**Commande** : `/new-project-workflow`

Workflow ultra‑synthétique pour démarrer **un nouveau projet e‑commerce** basé sur Reboul (par ex. Dawgz).

---

## 1. Préparer le brainstorming (dans Reboul)

1. Ouvrir le dépôt Reboul Store dans Cursor.
2. Ouvrir :
   - `docs/context/brainstorm_nouveauprojet.md`
   - `docs/export/TRAME_RAPIDE_RENDEZ_VOUS.md`
3. Pendant le rendez‑vous client :
   - Remplir **toutes les sections** du brainstorming.
   - Sauvegarder (option : renommer en `docs/context/brainstorm_[nom_projet].md`).

> Si besoin d’aide en live, l’IA peut guider section par section (communication à trois).

---

## 2. Créer le nouveau dépôt/projet

1. Dans le terminal :

```bash
mkdir /Users/.../[nom_projet]
cd /Users/.../[nom_projet]
git init  # optionnel
```

2. Ouvrir **une nouvelle fenêtre Cursor** sur ce dossier.

---

## 3. Message à envoyer à l’IA (dans le NOUVEAU projet)

1. Copier **tout le contenu** de `docs/context/brainstorm_nouveauprojet.md` (ou `brainstorm_[nom_projet].md`).
2. Envoyer un message de ce type (voir version complète dans `docs/export/GUIDE_DEMARRAGE_NOUVEAU_PROJET.md`) :

```text
Bonjour ! Je démarre un nouveau projet e-commerce [Nom] et j'ai besoin que tu crées toute la structure de base automatiquement.

📋 BRAINSTORMING COMPLÉTÉ :

[COLLER ICI LE CONTENU COMPLET DU BRAINSTORMING]

🎯 TÂCHES À EFFECTUER :

1. Lire et analyser le brainstorming
2. Créer la documentation de base :
   - obsidian-vault/Projet/roadmap.md
   - CONTEXT.md
   - ARCHITECTURE_[NOM].md
   - API_CONFIG.md
   - frontend/FRONTEND.md
   - backend/BACKEND.md
3. Copier/adapter les workflows :
   - TEMPLATE_CONTEXTE_PROJET.md
   - FIGMA_WORKFLOW.md
   - ANIMATIONS_GUIDE.md
4. Mettre en place la même méthodo que Reboul :
   - Mode pédagogique
   - Workflow Figma → Code
   - Animations GSAP
   - Documentation continue
   - Roadmap = source de vérité
```

---

## 4. Vérifier ce que l’IA doit générer

Dans le **nouveau projet**, tu dois voir au minimum :

- `obsidian-vault/Projet/roadmap.md`
- `CONTEXT.md`
- `ARCHITECTURE_[NOM].md`
- `API_CONFIG.md`
- `frontend/FRONTEND.md`
- `backend/BACKEND.md`
- `TEMPLATE_CONTEXTE_PROJET.md`
- Workflows copiés (Figma, animations, doc)

Si quelque chose manque : le signaler à l’IA dans ce nouveau projet.

---

## 5. Ensuite : travailler comme dans Reboul

Une fois la base créée :

1. **Toujours** :
   - Lire `obsidian-vault/Projet/roadmap.md` avant de commencer
   - Mettre à jour roadmap + contexte après chaque tâche
2. Utiliser les mêmes commandes :
   - `/frontend-workflow`
   - `/backend-workflow`
   - `/figma-workflow`
   - `/animation-workflow`
   - `/documentation-workflow`

---

## 🔗 Commandes associées

- `/export-context-workflow` : Version détaillée de l’export de contexte.
- `/getcontext export` : Où sont les fichiers d’export dans Reboul.
- `/documentation-workflow` : Discipline de documentation.


