# auth-workflow

**Commande** : `/auth-workflow`

Workflow pour travailler sur l’**authentification** (frontend + backend) dans Reboul Store.

---

## 📂 Fichiers auth importants

- **Frontend** :
  - `frontend/AUTH_USAGE.md` : Documentation du système d’auth (useAuth, AuthContext, routes protégées).
  - `frontend/src/contexts/AuthContext.tsx` : Contexte auth.
  - `frontend/src/services/auth.ts` : Appels API auth.
  - Pages :
    - `frontend/src/pages/Login.tsx`
    - `frontend/src/pages/Register.tsx`
    - `frontend/src/pages/Profile.tsx`

- **Backend** :
  - `backend/src/modules/auth/…` : Module NestJS Auth (controllers, services, stratégies).
  - `backend/src/entities/user.entity.ts` : Entité User.
  - `backend/src/entities/address.entity.ts` : Entité Address (liée à User).

- **Docs globales** :
  - `obsidian-vault/Projet/roadmap.md` : Phases auth (backend + frontend).
  - `obsidian-vault/REBOUL.md` : État actuel auth.

---

## 1. Comprendre l’existant

1. Lire `frontend/AUTH_USAGE.md` :
   - Comment `AuthContext` fonctionne.
   - Comment `useAuth()` est utilisé.
   - Comment les routes protégées sont configurées.

2. Lire `backend/src/modules/auth/` :
   - Endpoints : `/auth/register`, `/auth/login`, `/auth/logout`, `/auth/me`, etc.
   - Utilisation de JWT.

3. Lire `obsidian-vault/Projet/roadmap.md` (phases 10, 12, 18, etc.) pour voir :
   - Ce qui est déjà fait.
   - Ce qui reste à faire (reset password, OAuth, etc.).

---

## 2. Travailler sur le frontend auth

1. Toujours commencer par :
   - `frontend/AUTH_USAGE.md`
   - `frontend/src/contexts/AuthContext.tsx`

2. Pour une nouvelle page / feature auth (ex : Forgot Password, Reset Password) :
   - Créer la page dans `frontend/src/pages/`.
   - Ajouter les routes dans `frontend/src/App.tsx` ou équivalent.
   - Utiliser les hooks de `AuthContext` (ou en créer de nouveaux si besoin).

3. Mettre à jour :
   - `frontend/FRONTEND.md` (section Auth).
   - `obsidian-vault/Projet/roadmap.md` (cocher la tâche).

---

## 3. Travailler sur le backend auth

1. Vérifier d’abord dans `backend/src/modules/auth/` ce qui existe déjà :
   - Local (email + password)
   - Futur : OAuth Google/Apple (phases roadmap).

2. Pour une nouvelle fonctionnalité backend auth (ex : reset password, OAuth) :
   - Ajouter la logique dans `backend/src/modules/auth/…`.
   - Ajouter/adapter entités si nécessaire (`user.entity.ts`, `address.entity.ts`, tokens…).
   - Exposer des endpoints cohérents (documenter dans `backend/BACKEND.md`).

3. Mettre à jour :
   - `obsidian-vault/Projet/roadmap.md` (phase correspondante).
   - `backend/BACKEND.md` (section Auth).

---

## 4. Checklist sécurité

Avant de considérer une feature auth comme “OK” :

- [ ] Mots de passe **jamais en clair** (toujours hashés).
- [ ] JWT avec expiration configurée.
- [ ] Routes sensibles protégées par guards (NestJS).
- [ ] Côté frontend :
  - [ ] Tokens **non** stockés dans `localStorage` en clair si possible.
  - [ ] Redirections correctes après login/logout.
- [ ] Erreurs auth **non verbeuses** (ne pas dire “email existe / n’existe pas” trop précisément).

---

## 🔗 Commandes associées

- `/frontend-workflow` : Workflow général frontend.
- `/backend-workflow` : Workflow général backend.
- `/getcontext auth` : Pour retrouver rapidement tous les fichiers auth.


