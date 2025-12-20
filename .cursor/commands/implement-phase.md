# implement-phase

**Commande** : `/implement-phase [numéro-phase]`

Guide pour **implémenter une phase complète** de la roadmap, en suivant le workflow pédagogique et en mettant à jour la documentation.

---

## 📂 Fichiers impliqués

- `docs/context/ROADMAP_COMPLETE.md` ⭐  
  → Phase à implémenter, liste des tâches

- `docs/context/CONTEXT.md`  
  → Contexte général, état actuel

- `backend/BACKEND.md` ou `frontend/FRONTEND.md`  
  → Documentation technique à mettre à jour

---

## 🎯 Processus d'implémentation

### 1. Préparation

1. **Lire la phase** dans `ROADMAP_COMPLETE.md`
2. **Identifier les dépendances** (phases précédentes à compléter)
3. **Vérifier le contexte** dans `CONTEXT.md`
4. **Consulter la documentation** technique (BACKEND.md ou FRONTEND.md)

### 2. Planification

1. **Décomposer la phase** en sous-tâches logiques
2. **Identifier l'ordre d'implémentation** (backend → frontend ou inversement)
3. **Prévoir les tests** nécessaires
4. **Prévoir la documentation** à mettre à jour

### 3. Implémentation (Mode pédagogique)

#### Backend

1. **L'IA te guide** pour créer les fichiers nécessaires
2. **Tu codes** les fichiers toi-même
3. **L'IA vérifie** ton code
4. **On corrige** ensemble si besoin
5. **On teste** les endpoints

#### Frontend

1. **L'IA te guide** pour créer les composants/pages
2. **Tu codes** les fichiers toi-même
3. **L'IA vérifie** ton code
4. **On corrige** ensemble si besoin
5. **On teste** l'interface

### 4. Mise à jour documentation

1. **Cocher les tâches** dans `ROADMAP_COMPLETE.md` au fur et à mesure
   - **Recommandé** : Utiliser le CLI (`python cli/main.py roadmap update --task "..."`)
2. **Mettre à jour** `CONTEXT.md` si changement d'état
   - **Recommandé** : Utiliser le CLI (`python cli/main.py context sync`)
3. **Mettre à jour** `BACKEND.md` ou `FRONTEND.md` avec les nouvelles fonctionnalités
4. **Ajouter ✅** au titre de la phase quand terminée
   - **Recommandé** : Utiliser le CLI (`python cli/main.py roadmap update --phase X --complete`)

---

## 📋 Exemple : Implémenter Phase 15 (Cloudinary)

### 1. Préparation

- Lire Phase 15 dans `ROADMAP_COMPLETE.md`
- Vérifier que les phases précédentes sont complètes
- Consulter `BACKEND.md` pour voir l'état actuel

### 2. Planification

- **15.1** : Configuration Cloudinary (module, service)
- **15.2** : Intégration dans Products (upload, delete)
- **15.3** : Upload multiple (bulk endpoint)
- **15.4** : Tests et documentation

### 3. Implémentation

- Créer `CloudinaryModule` et `CloudinaryService`
- Modifier `ProductsService` pour utiliser Cloudinary
- Ajouter endpoint bulk upload
- Créer script de test

### 4. Documentation

- Cocher toutes les tâches dans `ROADMAP_COMPLETE.md`
- Ajouter ✅ au titre "Phase 15"
- Mettre à jour `BACKEND.md` avec les nouveaux endpoints
- Créer `IMAGES_UPLOAD.md` pour la documentation

---

## 🔄 Workflow détaillé

### Étape 1 : Backend (si applicable)

1. Créer/modifier les entités si nécessaire
2. Créer les DTOs avec validation
3. Créer/modifier les services
4. Créer/modifier les controllers
5. Tester les endpoints (curl, Insomnia, Postman)

### Étape 2 : Frontend (si applicable)

1. Créer/modifier les services API
2. Créer/modifier les composants
3. Créer/modifier les pages
4. Ajouter les routes si nécessaire
5. Tester l'interface

### Étape 3 : Tests

1. Tests manuels (endpoints, interface)
2. Scripts de test automatisés si nécessaire
3. Validation des fonctionnalités

### Étape 4 : Documentation

1. Cocher les tâches dans `ROADMAP_COMPLETE.md`
2. Mettre à jour `CONTEXT.md`
3. Mettre à jour `BACKEND.md` ou `FRONTEND.md`
4. Ajouter ✅ au titre de la phase

---

## 🎯 Bonnes pratiques

1. **Une tâche à la fois** : Ne pas tout faire en même temps
2. **Tester au fur et à mesure** : Ne pas attendre la fin pour tester
3. **Documenter immédiatement** : Cocher les tâches dès qu'elles sont terminées
4. **Respecter le mode pédagogique** : L'IA guide, tu codes
5. **Demander de l'aide** : Si bloqué, utiliser `/getcontext` ou `/brainstorm-topic`

---

## 🔗 Commandes associées

- `/cli-workflow` : Guide complet du CLI Python (recommandé pour automatiser)
- `/update-roadmap` : Mettre à jour la roadmap (ou utiliser le CLI)
- `/roadmap-phase-workflow` : Créer/modifier une phase
- `/backend-workflow` : Workflow backend complet
- `/frontend-workflow` : Workflow frontend complet
- `/documentation-workflow` : Workflow documentation

---

## ⚠️ Important

- **Ne pas oublier** de cocher les tâches dans `ROADMAP_COMPLETE.md`
- **Toujours tester** avant de passer à la suite
- **Mettre à jour la doc** après chaque étape
- **Respecter le mode pédagogique** sauf demande explicite

