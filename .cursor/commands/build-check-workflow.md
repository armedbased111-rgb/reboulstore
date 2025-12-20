# 🔨 Build Check Workflow

Guide pour vérifier et corriger les erreurs de build avant déploiement.

## 🎯 Objectif

S'assurer que tous les builds (Backend Reboul, Frontend Reboul, Backend Admin, Frontend Admin) fonctionnent sans erreur avant de déployer sur le serveur de production.

**Workflow automatique** : Analyser → Corriger → Vérifier → Répéter jusqu'à ce qu'il n'y ait plus d'erreurs.

## 📋 Processus Automatique (Recommandé)

### 🚀 Workflow Automatique : `build verify`

**Commande unique qui fait tout :**
```bash
python cli/main.py build verify
```

Cette commande va **automatiquement** :
1. ✅ Analyser tous les builds
2. 🔧 Corriger automatiquement les erreurs détectables
3. 🔄 Vérifier à nouveau
4. 🔁 Répéter jusqu'à ce qu'il n'y ait plus d'erreurs (max 10 itérations)

**Résultat attendu :**
- ✅ Tous les builds réussis sans erreurs
- ⚠️ Warnings acceptables (mais à vérifier)
- 📊 Rapport final avec nombre d'itérations nécessaires

**Avantages :**
- ✨ Automatique : Pas besoin d'intervention manuelle pour les erreurs courantes
- 🔄 Boucle de vérification : S'assure que les corrections n'ont pas cassé autre chose
- ⏱️ Gain de temps : Corrige plusieurs erreurs en une seule commande

---

## 📋 Processus Manuel (Si nécessaire)

### Étape 1 : Analyser tous les builds

**Commande CLI :**
```bash
python cli/main.py build analyze
```

Cette commande va :
1. Vérifier que `node_modules` existe dans chaque projet
2. Lancer `npm run build` pour chaque projet
3. Détecter et lister toutes les erreurs et warnings
4. Générer un rapport complet

**Résultat attendu :**
- ✅ Tous les builds réussis sans erreurs
- ⚠️ Warnings acceptables (mais à vérifier)
- ❌ Erreurs doivent être corrigées avant déploiement

### Étape 2 : Analyser les erreurs détectées

**Types d'erreurs communes :**

#### Erreurs TypeScript
- Types manquants ou incorrects
- Imports manquants
- Propriétés non définies

#### Erreurs de compilation
- Fichiers manquants
- Dépendances non installées
- Configuration incorrecte

#### Erreurs de build
- Variables d'environnement manquantes
- Chemins incorrects
- Conflits de dépendances

### Étape 2 : Corriger automatiquement les erreurs

**Commande CLI :**
```bash
python cli/main.py build fix
```

Cette commande va :
1. Analyser tous les builds
2. Corriger automatiquement les erreurs détectables :
   - ✅ Imports type (verbatimModuleSyntax)
   - ✅ Imports/variables non utilisés
   - ✅ Problèmes RefObject null
   - ⚠️ Certaines erreurs nécessitent une intervention manuelle

**Puis vérifier à nouveau :**
```bash
python cli/main.py build analyze
```

### Étape 3 : Corriger manuellement (si nécessaire)

Pour les erreurs non corrigées automatiquement :

1. **Analyser l'erreur** :
   - Lire le message d'erreur complet
   - Identifier le fichier et la ligne
   - Comprendre la cause

2. **Corriger** :
   - Corriger le code directement
   - Ou utiliser le CLI pour générer/réparer le code

3. **Vérifier** :
   - Relancer `python cli/main.py build verify` ou `build analyze`
   - S'assurer que l'erreur est corrigée

### Étape 4 : Vérifier manuellement les builds (si nécessaire)

Si le CLI ne détecte pas tout, vérifier manuellement :

**Backend Reboul Store :**
```bash
cd backend
npm run build
```

**Frontend Reboul Store :**
```bash
cd frontend
npm run build
```

**Backend Admin Central :**
```bash
cd admin-central/backend
npm run build
```

**Frontend Admin Central :**
```bash
cd admin-central/frontend
npm run build
```

## 🔧 Commandes Disponibles

### ⭐ Workflow Automatique (RECOMMANDÉ)
```bash
# Analyse, corrige et vérifie automatiquement jusqu'à ce qu'il n'y ait plus d'erreurs
python cli/main.py build verify
```

### Analyse seule
```bash
# Analyser tous les builds (sans correction)
python cli/main.py build analyze
```

### Correction seule
```bash
# Analyser et corriger automatiquement (une seule fois)
python cli/main.py build fix
```

### Analyse avec correction automatique
```bash
# Analyser et corriger automatiquement en une fois
python cli/main.py build analyze --fix
```

### Autres analyses
```bash
# Analyser le code pour cohérence
python cli/main.py analyze code

# Analyser les dépendances
python cli/main.py analyze dependencies
```

### Installer les dépendances manquantes
```bash
# Backend Reboul
cd backend && npm install

# Frontend Reboul
cd frontend && npm install

# Backend Admin
cd admin-central/backend && npm install

# Frontend Admin
cd admin-central/frontend && npm install
```

## 📝 Checklist avant déploiement

- [ ] Tous les builds réussissent sans erreurs
- [ ] Warnings critiques corrigés
- [ ] Dépendances à jour (`npm install` exécuté)
- [ ] Tests de build locaux passés
- [ ] Pas d'erreurs TypeScript
- [ ] Configuration production vérifiée

## ⚠️ Notes Importantes

- **Ne pas déployer** si des erreurs de build existent
- Les warnings sont généralement acceptables, mais à vérifier
- Toujours tester les builds en local avant de déployer
- Utiliser `npm ci` en production (au lieu de `npm install`) pour des builds reproductibles

## 🔄 Workflow Recommandé

### 🚀 Workflow Automatique (RECOMMANDÉ)

1. **Avant chaque déploiement** :
   ```bash
   python cli/main.py build verify
   ```
   - ✅ Analyse automatiquement
   - ✅ Corrige les erreurs automatiquement
   - ✅ Vérifie à nouveau
   - ✅ Répète jusqu'à ce qu'il n'y ait plus d'erreurs

2. **Si des erreurs nécessitent une intervention manuelle** :
   - Lire les erreurs restantes
   - Corriger manuellement
   - Relancer `build verify`

3. **Une fois tous les builds OK** :
   - Passer à la phase de déploiement
   - Cloner le repository sur le serveur
   - Déployer

### 📝 Workflow Manuel (Si nécessaire)

1. **Analyser** :
   ```bash
   python cli/main.py build analyze
   ```

2. **Corriger** :
   ```bash
   python cli/main.py build fix
   ```

3. **Vérifier** :
   ```bash
   python cli/main.py build analyze
   ```

4. **Répéter** si nécessaire

## 🎓 Patterns de Correction Documentés

Basé sur l'expérience réelle de correction automatique, voici les patterns courants et leurs solutions :

### 1. Imports Type (verbatimModuleSyntax)

**Erreur** : `'RefObject' is a type and must be imported using a type-only import when 'verbatimModuleSyntax' is enabled.`

**Solution** : Séparer les imports value et type en deux imports distincts :
```typescript
// ❌ Avant
import { useEffect, useRef, RefObject } from 'react';

// ✅ Après
import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
```

**Pattern de correction** :
- Extraire les types identifiés dans les erreurs
- Les séparer dans un `import type` séparé
- Garder les valeurs dans l'import normal

### 2. Variables/Imports Non Utilisés

**Erreur** : `'X' is declared but its value is never read.`

**Solution 1** : Supprimer l'import/la variable
```typescript
// ❌ Avant
import { Upload, X, ImageIcon } from 'lucide-react';

// ✅ Après (si X et ImageIcon non utilisés)
import { Upload } from 'lucide-react';
```

**Solution 2** : Préfixer avec `_` si temporairement non utilisé
```typescript
// Si la variable sera utilisée plus tard
const _setSessionId = useLocalStorage(...);
```

**Pattern de correction** :
- Vérifier si vraiment non utilisé
- Supprimer si définitivement inutile
- Préfixer avec `_` si temporaire

### 3. RefObject<Type | null> vs RefObject<Type>

**Erreur** : `Type 'RefObject<HTMLDivElement | null>' is not assignable to type 'RefObject<HTMLDivElement>'`

**Solution** : Accepter null dans le type de retour
```typescript
// ❌ Avant
): RefObject<HTMLDivElement> => {
  const scopeRef = useRef<HTMLDivElement>(null);
  return scopeRef; // useRef(null) crée RefObject<HTMLDivElement | null>
}

// ✅ Après
): RefObject<HTMLDivElement | null> => {
  const scopeRef = useRef<HTMLDivElement>(null);
  return scopeRef;
}
```

**Pattern de correction** :
- `useRef<Type>(null)` crée toujours `RefObject<Type | null>`
- Le type de retour doit accepter `| null`

### 4. Props Lucide Icons

**Erreur** : `Type '{ className: string; title: string; }' is not assignable to type 'LucideProps'`

**Solution** : Supprimer les props non supportées (comme `title`)
```typescript
// ❌ Avant
<ImageIcon className="w-4 h-4" title="Logo présent" />

// ✅ Après
<ImageIcon className="w-4 h-4" />
```

**Pattern de correction** :
- Les composants Lucide ne supportent pas toutes les props HTML
- Supprimer les props non reconnues (`title`, etc.)

### 5. Enum avec erasableSyntaxOnly

**Erreur** : `This syntax is not allowed when 'erasableSyntaxOnly' is enabled.`

**Solution** : Utiliser `const` object au lieu d'enum
```typescript
// ❌ Avant (enum)
export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
}

// ✅ Après (const object)
export const OrderStatus = {
  PENDING: 'pending',
  PAID: 'paid',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];
```

**Pattern de correction** :
- Avec `erasableSyntaxOnly: true`, les enums ne sont pas autorisés
- Utiliser un objet const avec `as const` + type union

### 6. Types null/undefined dans Form Values

**Erreur** : `Type 'string | null | undefined' is not assignable to type 'string | number | readonly string[] | undefined'`

**Solution** : Convertir null en chaîne vide
```typescript
// ❌ Avant
<textarea value={formData.description} />

// ✅ Après
<textarea value={formData.description || ''} />
```

**Pattern de correction** :
- Les inputs/textarea n'acceptent pas `null`
- Toujours utiliser `|| ''` pour convertir null → string

### 7. Number | undefined dans Functions

**Erreur** : `Argument of type 'number | undefined' is not assignable to parameter of type 'string | number'`

**Solution** : Ajuster la signature de la fonction
```typescript
// ❌ Avant
const updateItem = (index: number, field: string, value: string | number) => { ... }
updateItem(index, 'chest', parseFloat(e.target.value) || undefined); // ❌ undefined non accepté

// ✅ Après
const updateItem = (index: number, field: string, value: string | number | undefined) => { ... }
updateItem(index, 'chest', val !== undefined && !isNaN(val) ? val : undefined); // ✅
```

**Pattern de correction** :
- Ajouter `| undefined` au type du paramètre si nécessaire
- Gérer correctement `parseFloat` qui peut retourner `NaN`

### 8. Conflits de Types (User, Order, etc.)

**Erreur** : Type from service doesn't match type from types/index

**Solution** : Utiliser un seul source de vérité
```typescript
// ❌ Avant (conflit)
// ProfileInfoCard.tsx
interface User { ... } // Définition locale

// ✅ Après (source unique)
import type { User } from '../../services/auth';
```

**Pattern de correction** :
- Centraliser les types dans un fichier unique
- Ré-exporter depuis services si nécessaire : `export type { User }`

### 9. Modules CSS TypeScript (Swiper, etc.)

**Erreur** : `Cannot find module 'swiper/css'`

**Solution** : Utiliser `@ts-ignore` pour les imports CSS
```typescript
// ✅ Solution
// @ts-ignore - Swiper CSS imports (pas de déclarations TypeScript)
import 'swiper/css';
```

**Pattern de correction** :
- Les imports CSS n'ont pas de déclarations TypeScript
- Utiliser `@ts-ignore` pour les imports CSS externes

## 📚 Ressources

- **CLI Documentation** : `cli/README.md`
- **Build Configuration** : Voir `package.json` de chaque projet
- **TypeScript Config** : Voir `tsconfig.json` de chaque projet
