## 📦 Index – Export de contexte & nouveaux projets

Ce fichier regroupe **tout ce qui sert à réutiliser la méthodologie Reboul** pour créer de nouveaux projets e‑commerce (comme `dawgz`).

Les fichiers sont physiquement à la racine, mais tu peux considérer cette page comme la **porte d’entrée** pour l’export de contexte.

---

### 🧠 Brainstorm & découverte client

- `brainstorm_nouveauprojet.md`  
  Template de brainstorming client : toutes les questions importantes (contexte, produits, design, stack, paiement, admin, etc.).

> Exemple : utilisé en live avec le client **Dawgz** pour remplir tout le contexte avant la création du projet.

---

### 📦 Templates & guides d’export

- `TEMPLATE_CONTEXTE_PROJET.md`  
  Template de **contexte de projet e‑commerce** :  
  - Stack backend/frontend standard  
  - Entités, endpoints, workflows  
  - Conventions de code  
  - Checklists de démarrage  
  → À copier dans tout nouveau projet pour partir sur une base propre.

- `GUIDE_EXPORT_CONTEXTE.md`  
  Guide qui explique **comment exporter tout le contexte Reboul** vers un nouveau projet :  
  - Quels fichiers utiliser  
  - Dans quel ordre  
  - Comment adapter au nouveau projet

- `GUIDE_DEMARRAGE_NOUVEAU_PROJET.md`  
  Guide **pas‑à‑pas** pour démarrer un nouveau projet :  
  - Checklist avant rendez‑vous  
  - Message type à envoyer à l’IA  
  - Étapes pour créer le nouveau dépôt et lancer la génération automatique des fichiers.

- `TRAME_RAPIDE_RENDEZ_VOUS.md`  
  Version courte, pensée pour être utilisée **pendant le rendez‑vous client** :  
  - Ce qu’il faut demander  
  - Dans quel ordre  
  - Rappel du message à envoyer à l’IA après le rendez‑vous.

---

### 🧪 Exemple concret : projet Dawgz

Le projet `dawgz` (dossier `/Users/tripleseptinteractive/code/dawgz`) a été créé en suivant exactement ce workflow :

1. Utilisation de `brainstorm_nouveauprojet.md` pendant le rendez‑vous avec l’équipe Dawgz.  
2. Finalisation du brainstorming et validation avec le client.  
3. Création du nouveau dossier `dawgz`.  
4. Utilisation de `GUIDE_DEMARRAGE_NOUVEAU_PROJET.md` pour :  
   - Copier le brainstorming  
   - Envoyer le message à l’IA dans le nouveau projet  
   - Laisser l’IA générer :  
     - `ROADMAP_COMPLETE.md`  
     - `CONTEXT.md`  
     - `ARCHITECTURE_DAWGZ.md`  
     - `API_CONFIG.md`  
     - `frontend/FRONTEND.md`  
     - `backend/BACKEND.md`  
     - etc.

---

### 🤖 Commandes Cursor utiles pour l’export

> Les fichiers de commandes sont dans `.cursor/commands/*.md`, mais voici les plus utiles pour l’export / nouveaux projets :

- `/getcontext [sujet]`  
  → Où trouver la bonne doc (ROADMAP, CONTEXT, ARCHITECTURE, etc.).

- `/backend-workflow`  
  → Workflow backend complet (modules NestJS, entités, DTOs, endpoints).

- `/frontend-workflow`  
  → Workflow frontend complet (pages, composants, services).

- `/figma-workflow`  
  → Rappel du workflow Figma → code.

- `/animation-workflow`  
  → Workflow animations GSAP (structure `animations/`, presets, composants).

- `/documentation-workflow`  
  → Comment maintenir ROADMAP / CONTEXT / FRONTEND / BACKEND à jour.

- `/update-roadmap`  
  → Rappel de la manière de cocher les tâches dans `ROADMAP_COMPLETE.md` après chaque étape.

---

### 🧭 Comment lancer un NOUVEAU projet e‑commerce

1. **Pendant le rendez‑vous client**  
   - Utiliser `brainstorm_nouveauprojet.md`  
   - Option : ouvrir aussi `TRAME_RAPIDE_RENDEZ_VOUS.md` pour suivre la trame.

2. **Après le rendez‑vous**  
   - Vérifier que le brainstorming est complet  
   - Suivre `GUIDE_DEMARRAGE_NOUVEAU_PROJET.md` pour :  
     - Créer le nouveau dossier  
     - Ouvrir Cursor dessus  
     - Envoyer le message complet à l’IA avec le contenu du brainstorming.

3. **Dans le nouveau projet**  
   - L’IA génère la doc de base (roadmap, contexte, architecture, backend/front docs).  
   - Adapter `TEMPLATE_CONTEXTE_PROJET.md` au projet.  
   - Travailler ensuite **exactement comme sur Reboul** (mêmes workflows, mêmes règles).

---

### 📌 Rappel

- Ce dossier logique sert à **centraliser tout ce qui concerne l’export du contexte**.  
- Le `README.md` à la racine décrit aussi ces fichiers dans une vue plus globale du projet.  
- Pour tout nouveau projet, **commence toujours par ici** :  
  - `brainstorm_nouveauprojet.md`  
  - `GUIDE_DEMARRAGE_NOUVEAU_PROJET.md`  
  - `TEMPLATE_CONTEXTE_PROJET.md`.


