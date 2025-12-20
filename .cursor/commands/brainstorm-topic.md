# brainstorm-topic

**Commande** : `/brainstorm-topic [sujet]`

Commande pour lancer un **mini‑brainstorm guidé** sur un point précis pendant le développement (feature, problème, refactor, UX, archi, etc.).

---

## 🎯 Objectif

Permettre à l’IA de :
- Se caler sur le **contexte du projet** (ROADMAP, CONTEXT, docs)  
- Te poser des **questions ciblées** sur un sujet donné  
- Co‑construire une **stratégie / plan d’action** avant de coder

Typiquement utilisé pour :
- “Brainstorm UX pour la page Checkout”
- “Brainstorm architecture pour l’admin multi‑shops”
- “Brainstorm performance sur la page Product”

---

## 🧠 Comment l’utiliser

Dans le chat Cursor, tape par exemple :

```text
/brainstorm-topic UX checkout
/brainstorm-topic architecture admin centrale
/brainstorm-topic animations header
```

L’IA doit alors :

1. Lire rapidement le contexte :
   - `docs/context/ROADMAP_COMPLETE.md`
   - `docs/context/CONTEXT.md`
   - La doc spécifique (`frontend/FRONTEND.md`, `backend/BACKEND.md`, `docs/architecture/...`, etc. selon le sujet)
2. Te poser des **questions de clarification** :
   - Contexte fonctionnel
   - Contraintes (techniques, temps, UX, business)
   - Objectif final souhaité
3. Proposer :
   - Des **idées** (UX, archi, animations, flows)
   - Un **plan d’action** en plusieurs étapes, compatible avec ta roadmap

---

## 🧩 Structure type d’un mini‑brainstorm

1. **Clarification du sujet**
   - “Explique-moi en 2 phrases le problème / la feature.”
   - “Où ça se situe dans le site ? (page, composant)”

2. **Contexte & contraintes**
   - “Y a‑t‑il des contraintes de design (Figma existant) ?”
   - “Y a‑t‑il des contraintes de perf / SEO / responsive ?”

3. **Exploration d’options**
   - L’IA propose plusieurs approches (en listant clairement A / B / C).

4. **Choix & plan**
   - Tu choisis une option (ou un mix).
   - L’IA découpe en **tasks concrètes**, alignées avec la roadmap.

---

## 🔗 Commandes associées

- `/getcontext [sujet]` : Pour lister les fichiers pertinents avant le brainstorm.
- `/frontend-workflow` : Si le sujet est frontend.
- `/backend-workflow` : Si le sujet est backend.
- `/figma-workflow` : Si le sujet touche au design Figma.
- `/animation-workflow` : Si le sujet touche aux animations GSAP.


