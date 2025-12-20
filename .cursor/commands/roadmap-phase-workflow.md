# roadmap-phase-workflow

**Commande** : `/roadmap-phase-workflow`

Workflow pour **concevoir, ajouter et contextualiser de nouvelles phases** dans `docs/context/ROADMAP_COMPLETE.md`, en restant cohérent avec tout le projet.

---

## 📂 Fichiers impliqués

- `docs/context/ROADMAP_COMPLETE.md` ⭐  
  → Roadmap complète, toutes les phases, **source de vérité**.

- `docs/context/CONTEXT.md`  
  → Contexte général + “État actuel”.

- `docs/context/BRAINSTORMING_ROADMAP.md`  
  → Brainstorms de roadmap (idées, versions futures).

- `docs/context/CLARIFICATIONS_BRAINSTORMING.md`  
  → Décisions validées sur la roadmap.

---

## 1. Quand ajouter / modifier une phase

Utiliser `/roadmap-phase-workflow` quand :

- Tu veux **ajouter une nouvelle phase** (ex : “Phase 19 – Programme de fidélité Dawgz”).  
- Tu veux **réorganiser** des phases existantes.  
- Tu veux **contextualiser** une grosse feature (nouvelle section du site, nouvelle partie admin…) avant de coder.

---

## 2. Étapes pour créer une nouvelle phase

1. **Brainstorm rapide** (option : utiliser `/brainstorm-topic [sujet]`) :
   - Quel est l’objectif de la phase ?
   - Backend ? Frontend ? Les deux ?
   - Quelles dépendances avec les phases précédentes ?

2. **Noter les idées brutes** dans :
   - `docs/context/BRAINSTORMING_ROADMAP.md`

3. **Valider les décisions** dans :
   - `docs/context/CLARIFICATIONS_BRAINSTORMING.md`

4. **Créer la phase** dans `docs/context/ROADMAP_COMPLETE.md` :
   - Ajouter un bloc :

```markdown
## 🔜 Phase X : Titre de la phase

### X.1 Backend – [domaine]
- [ ] Tâche 1
- [ ] Tâche 2

### X.2 Frontend – [domaine]
- [ ] Tâche 1
- [ ] Tâche 2
```

5. **Mettre à jour** `docs/context/CONTEXT.md` si ça change l’“État actuel” ou les objectifs globaux.

---

## 3. Bonne pratique : toujours garder la vision globale

Avant de créer une phase :

1. Relire les sections **Objectifs** / **Phases suivantes** de :
   - `docs/context/ROADMAP_COMPLETE.md`
   - `docs/context/CONTEXT.md`
2. Vérifier :
   - Est‑ce que la nouvelle phase est vraiment nécessaire maintenant ?  
   - Est‑ce qu’elle ne duplique pas une phase déjà prévue ?  
   - Est‑ce qu’elle respecte la logique Backend ↔ Frontend alternés ?

---

## 4. Mettre à jour une phase existante

1. Identifier la phase et la sous‑section (ex : “Phase 14 – Historique commandes”).  
2. Si tu ajoutes des tâches :
   - Les ajouter dans la bonne sous‑section (Backend / Frontend).
3. Si tu changes le contenu :
   - Noter les raisons dans `docs/context/CLARIFICATIONS_BRAINSTORMING.md`.
4. Si tu termines la phase :
   - Ajouter un ✅ au titre de la phase.
   - Mettre à jour `docs/context/CONTEXT.md` (“État actuel”).

---

## 5. Utilisation avec l’IA (mode pédagogique)

Quand tu tapes `/roadmap-phase-workflow`, l’IA doit :

1. Lire :
   - `docs/context/ROADMAP_COMPLETE.md`
   - `docs/context/CONTEXT.md`
2. Te poser des questions :
   - “Quel est l’objectif de la nouvelle phase ?”
   - “Côté backend, qu’est‑ce qu’il faut ?”
   - “Côté frontend, qu’est‑ce qu’il faut ?”
3. Proposer :
   - Un **squelette de phase** prêt à coller dans la roadmap.
   - Une **liste de tâches** cohérente avec le reste du projet.

---

## 🔗 Commandes associées

- `/documentation-workflow` : Discipline de mise à jour de la doc.
- `/getcontext roadmap` : Pour lister les fichiers de roadmap/contexte.
- `/brainstorm-topic [sujet]` : Pour brainstormer sur une future phase précise.


