# bug-report-workflow

**Commande** : `/bug-report-workflow`

Workflow pour **décrire un bug proprement**, le reproduire, le diagnostiquer et le relier à la documentation / roadmap.

---

## 1. Comment décrire un bug dans le chat

Toujours fournir au minimum :

1. **Contexte**  
   - Page / composant : ex. `frontend/src/pages/Checkout.tsx`  
   - Action : ce que tu fais (“je clique sur…”, “je rafraîchis…”)  
   - Environnement : dev (Docker), navigateur, etc.

2. **Résultat attendu vs observé**  
   - _Attendu_ : “Je devrais voir le récapitulatif de commande.”  
   - _Observé_ : “La page reste vide / erreur 500 / spinner infini…”

3. **Logs / messages d’erreur** (si possible)  
   - Console navigateur  
   - Logs backend (`docker-compose logs backend`)

---

## 2. Où documenter les bugs importants

Selon le type de bug :

- **Bug fonctionnel lié à une phase**  
  - Vérifier la phase correspondante dans `obsidian-vault/Projet/roadmap.md`.  
  - Si le bug remet en cause une phase, noter une entrée dans :  
    - `docs/context/CLARIFICATIONS_BRAINSTORMING.md` (décisions / ajustements).

- **Bug récurrent / à suivre**  
  - Option : créer une section “Bugs connus” dans :  
    - `obsidian-vault/REBOUL.md` (si global)  
    - ou dans `frontend/FRONTEND.md` / `backend/BACKEND.md` (si spécifique).

---

## 3. Processus de debugging conseillé

1. **Reproduction**  
   - Reproduire le bug 2–3 fois.  
   - Noter les étapes exactes.

2. **Isolation**  
   - Identifier si c’est plutôt :  
     - Frontend (console navigateur, React errors)  
     - Backend (logs NestJS, erreurs API)  
     - Données (DB, Stripe, etc.)

3. **Inspection**  
   - Front : vérifier :
     - `frontend/src/pages/...`  
     - `frontend/src/components/...`  
     - `frontend/src/services/...`
   - Back : vérifier :
     - `backend/src/modules/...`  
     - `backend/src/entities/...`  
     - `backend/src/config/...`

4. **Hypothèse & test**  
   - Proposer 1–2 hypothèses dans le chat.  
   - L’IA t’aide à tester / corriger en **mode pédagogique**.

---

## 4. Utiliser les outils existants

- Pour les bugs de services API frontend :  
  - Utiliser `frontend/TEST_SERVICES.md` + page `/test-services`.  
  - Vérifier que les appels bruts fonctionnent avant de blâmer l’UI.

- Pour les bugs de checkout / Stripe :  
  - Utiliser `/stripe-workflow` + `docs/stripe/TESTS_CHECKOUT.md`.

---

## 🔗 Commandes associées

- `/getcontext [sujet]` : Trouver où est la doc liée au bug.  
- `/frontend-workflow` : Pour bugs côté frontend.  
- `/backend-workflow` : Pour bugs côté backend.  
- `/stripe-workflow` : Pour bugs checkout/paiement.  
- `/brainstorm-topic [sujet]` : Pour brainstormer sur un bug complexe (ex. perfs, race condition).


