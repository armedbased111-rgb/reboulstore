# export-context-workflow

**Commande** : `/export-context-workflow`

Workflow complet pour **réutiliser tout le contexte Reboul** et créer un **nouveau projet e‑commerce** (comme Dawgz).

---

## 🎯 Objectif

- Partir de Reboul (docs, archi, workflows)
- Brainstormer avec le client
- Créer un nouveau dépôt/projet
- Laisser l’IA générer la doc de base (roadmap, contexte, archi, backend/front docs)

Tout est centralisé dans :

- `docs/CONTEXT_INDEX.md`
- `docs/EXPORT_CONTEXT_INDEX.md`

---

## 1. Pendant le rendez-vous client

1. Ouvrir **Reboul** dans Cursor.
2. Ouvrir :
   - `docs/context/brainstorm_nouveauprojet.md`
   - `docs/export/TRAME_RAPIDE_RENDEZ_VOUS.md`
3. Remplir `brainstorm_nouveauprojet.md` **en live** avec le client :
   - Contexte, vision, objectifs
   - Produits, stock, design
   - Paiement, checkout, livraison
   - Stack technique, admin, fonctionnalités
4. Sauvegarder le fichier (éventuellement le renommer : `brainstorm_[nom_projet].md`).

---

## 2. Après le rendez-vous

1. Créer un nouveau dossier projet, par ex. :

```bash
mkdir /Users/.../[nom_projet]
cd /Users/.../[nom_projet]
git init  # optionnel
```

2. Ouvrir **une nouvelle fenêtre Cursor** sur ce nouveau dossier.
3. Dans le chat, envoyer le message type décrit dans :
   - `docs/export/GUIDE_DEMARRAGE_NOUVEAU_PROJET.md`

Ce message doit contenir :

- Le **contenu complet** de `brainstorm_nouveauprojet.md`
- La liste des tâches à faire pour l’IA :
  - Créer `obsidian-vault/Projet/roadmap.md`
  - Créer `CONTEXT.md`
  - Créer `ARCHITECTURE_[NOM].md`
  - Créer `API_CONFIG.md`
  - Créer `frontend/FRONTEND.md`
  - Créer `backend/BACKEND.md`
  - Copier les workflows (`FIGMA_WORKFLOW.md`, `ANIMATIONS_GUIDE.md`, etc.)

---

## 3. Dans le nouveau projet

L’IA doit, à partir du message :

1. Lire et analyser le brainstorming.
2. Créer tous les fichiers de documentation de base :
   - `obsidian-vault/Projet/roadmap.md`
   - `CONTEXT.md`
   - `ARCHITECTURE_[NOM].md`
   - `API_CONFIG.md`
   - `frontend/FRONTEND.md`
   - `backend/BACKEND.md`
3. Copier/adapter les templates :
   - `TEMPLATE_CONTEXTE_PROJET.md`
   - `FIGMA_WORKFLOW.md`
   - `ANIMATIONS_GUIDE.md`
4. Mettre en place les **mêmes règles** que Reboul :
   - Mode pédagogique par défaut
   - Workflow Figma → Code
   - Animations GSAP
   - Documentation continue
   - Roadmap comme source de vérité

---

## 4. Fichiers impliqués côté Reboul

- `docs/EXPORT_CONTEXT_INDEX.md`  
  → Sommaire de tout ce qui concerne l’export.

- `docs/context/TEMPLATE_CONTEXTE_PROJET.md`  
  → Template de contexte projet e‑commerce.

- `docs/context/brainstorm_nouveauprojet.md`  
  → Template de brainstorming client.

- `docs/export/GUIDE_EXPORT_CONTEXTE.md`  
  → Guide détaillé d’export de contexte.

- `docs/export/GUIDE_DEMARRAGE_NOUVEAU_PROJET.md`  
  → Guide pas‑à‑pas pour démarrer un nouveau projet.

- `docs/export/TRAME_RAPIDE_RENDEZ_VOUS.md`  
  → Trame rapide pour le rendez-vous client.

---

## 5. Checklists rapides

### Avant rendez-vous

- [ ] Ouvrir `docs/context/brainstorm_nouveauprojet.md`
- [ ] Ouvrir `docs/export/TRAME_RAPIDE_RENDEZ_VOUS.md`

### Pendant rendez-vous

- [ ] Remplir toutes les sections du brainstorming
- [ ] Valider les choix de stack, design, fonctionnalités

### Après rendez-vous

- [ ] Créer le nouveau dossier projet
- [ ] Ouvrir Cursor sur ce dossier
- [ ] Envoyer le message type avec le brainstorming complet
- [ ] Vérifier que l’IA a créé tous les fichiers de doc

---

## 🔗 Commandes associées

- `/getcontext export` : Savoir où sont les fichiers d’export dans Reboul.
- `/documentation-workflow` : Rappel de la discipline de doc.
- `/frontend-workflow` : Workflow frontend (à utiliser dans le nouveau projet).
- `/backend-workflow` : Workflow backend (à utiliser dans le nouveau projet).


