# test-workflow

**Commande** : `/test-workflow`

Guide complet pour **créer et exécuter des tests** dans Reboul Store (backend et frontend).

---

## 📂 Fichiers impliqués

- `backend/test/`  
  → Tests E2E backend

- `backend/scripts/test-*.ts`  
  → Scripts de test fonctionnels (ex: `test-images-upload.ts`)

- `frontend/src/` (à venir)  
  → Tests unitaires composants React

---

## 🎯 Types de tests

### Tests fonctionnels (Scripts Node.js)

- **Objectif** : Tester les fonctionnalités end-to-end
- **Exemple** : `backend/scripts/test-images-upload.ts`
- **Usage** : Scripts TypeScript exécutables avec `ts-node`

### Tests E2E (Backend)

- **Objectif** : Tester les endpoints API complets
- **Framework** : Jest + Supertest
- **Fichiers** : `backend/test/*.e2e-spec.ts`

### Tests unitaires (À venir)

- **Backend** : Tests unitaires services/controllers
- **Frontend** : Tests unitaires composants React
- **Framework** : Jest + React Testing Library (frontend)

---

## 🔧 Créer un script de test fonctionnel

### Structure

```typescript
#!/usr/bin/env ts-node

import * as fs from 'fs';
import FormData from 'form-data';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';

async function testFeature() {
  // Test 1: Cas nominal
  // Test 2: Cas d'erreur
  // Test 3: Cas limites
}

main().catch(console.error);
```

### Exemple : Test upload images

Voir `backend/scripts/test-images-upload.ts` pour un exemple complet :
- Tests upload simple
- Tests upload multiple
- Tests erreurs (format, taille, nombre)
- Résumé coloré des résultats

---

## 🧪 Exécuter les tests

### Scripts de test fonctionnels

```bash
cd backend
npx ts-node -r tsconfig-paths/register scripts/test-images-upload.ts [args]
```

### Tests E2E (Backend)

```bash
cd backend
npm run test:e2e
```

### Tests unitaires (À venir)

```bash
# Backend
cd backend
npm run test

# Frontend
cd frontend
npm run test
```

---

## 📝 Bonnes pratiques

1. **Un test = une fonctionnalité** : Tester une feature complète
2. **Cas nominal + cas d'erreur** : Tester le happy path et les erreurs
3. **Résumé clair** : Afficher un résumé coloré des résultats
4. **Documentation** : Documenter les tests dans la doc du projet

---

## 🔗 Commandes associées

- `/backend-workflow` : Workflow backend complet
- `/frontend-workflow` : Workflow frontend complet
- `/implement-phase` : Implémenter une phase complète

---

## ⚠️ Important

- **Toujours tester** avant de marquer une phase comme terminée
- **Documenter les tests** dans la documentation du projet
- **Créer des scripts réutilisables** pour les tests fonctionnels

