# 🔧 Améliorations Workflow & Script de Déploiement

## 📋 Problèmes Identifiés (Session du 07/01/2026)

### 1. Build Docker avec `--no-cache` trop long
**Problème** :
- Build avec `--no-cache` prend 10-15 minutes
- Bloque le script et timeout
- On a dû arrêter le build et le relancer sans `--no-cache`

**Solution proposée** :
- Option `--fast-build` : Build sans `--no-cache` (utilise le cache)
- Option `--full-build` : Build avec `--no-cache` (par défaut pour releases majeures)
- Détection automatique : Si build > 10 min, proposer d'arrêter et relancer sans cache

### 2. Pas de timeout sur commandes SSH
**Problème** :
- Les commandes SSH peuvent bloquer indéfiniment
- Le script attend sans limite de temps

**Solution proposée** :
- Ajouter timeout sur toutes les commandes SSH longues (build, etc.)
- Timeout configurable : `DEPLOY_TIMEOUT=600` (10 min par défaut)
- Si timeout : proposer de continuer en arrière-plan ou annuler

### 3. Upload source puis rebuild vs Upload dist/
**Problème** :
- Le script upload les fichiers source puis rebuild sur le serveur
- On a dû uploader directement `dist/` à la fin pour gagner du temps
- Deux approches possibles mais pas claires

**Solution proposée** :
- **Mode 1 (défaut)** : Build local → Upload `dist/` → Copier dans container
- **Mode 2 (optionnel)** : Upload source → Build sur serveur (pour vérification)
- Option `--build-mode=local|server` pour choisir

### 4. Pas de build local puis upload
**Problème** :
- On rebuild toujours sur le serveur
- On pourrait builder localement et uploader les images ou le dist/

**Solution proposée** :
- **Mode local** : `npm run build` local → Upload `dist/` → Copier dans container
- Plus rapide, moins de charge serveur
- Vérification locale avant upload

### 5. Gestion des erreurs de build
**Problème** :
- Si le build échoue, on doit tout recommencer
- Pas de rollback automatique
- Pas de sauvegarde de l'état avant build

**Solution proposée** :
- Sauvegarder l'état des containers avant build
- Si build échoue : rollback automatique vers état précédent
- Option `--continue-on-error` pour continuer malgré erreurs mineures

### 6. Workflow pas optimisé
**Problème** :
- Trop d'étapes manuelles
- Pas de mode "quick deploy" pour corrections mineures
- Pas de mode "full deploy" pour releases majeures

**Solution proposée** :
- **Mode quick** : Build local → Upload dist/ → Restart (2-3 min)
- **Mode full** : Backup → Build serveur → Vérification complète (10-15 min)
- **Mode incremental** : Upload uniquement fichiers modifiés

## 🎯 Améliorations Proposées

### Option 1 : Mode Quick Deploy (Recommandé pour corrections)
```bash
./scripts/deploy-prod.sh --quick
```
- Build local (`npm run build`)
- Upload `dist/` directement
- Copie dans container
- Restart services
- **Temps** : 2-3 minutes

### Option 2 : Mode Full Deploy (Recommandé pour releases)
```bash
./scripts/deploy-prod.sh --full
```
- Backup DB
- Upload source
- Build sur serveur avec `--no-cache`
- Vérification complète
- **Temps** : 10-15 minutes

### Option 3 : Mode Fast Build (Build avec cache)
```bash
./scripts/deploy-prod.sh --fast-build
```
- Build sur serveur SANS `--no-cache` (utilise cache)
- **Temps** : 3-5 minutes

### Option 4 : Timeout configurable
```bash
DEPLOY_TIMEOUT=300 ./scripts/deploy-prod.sh  # 5 min timeout
```

### Option 5 : Build en arrière-plan
```bash
./scripts/deploy-prod.sh --background-build
```
- Build en arrière-plan
- Notification quand terminé
- Possibilité de suivre les logs

## 📝 Nouveau Workflow Proposé

### Workflow Quick (Corrections mineures)
1. ✅ Build local (`npm run build`)
2. ✅ Vérification build local (TypeScript, lint)
3. ✅ Upload `dist/` sur serveur
4. ✅ Copie dans container
5. ✅ Restart services
6. ✅ Vérification rapide

### Workflow Full (Releases majeures)
1. ✅ Backup DB
2. ✅ Vérification préalable (build TS, lint)
3. ✅ Upload source sur serveur
4. ✅ Build sur serveur (avec timeout)
5. ✅ Redémarrage services
6. ✅ Vérification complète
7. ✅ Monitoring

## 🔄 Modifications Script

### Ajouts proposés :
- [ ] Option `--quick` : Mode quick deploy
- [ ] Option `--fast-build` : Build sans `--no-cache`
- [ ] Option `--timeout=N` : Timeout configurable
- [ ] Option `--background-build` : Build en arrière-plan
- [ ] Détection automatique timeout et proposition d'arrêt
- [ ] Rollback automatique si build échoue
- [ ] Mode build local puis upload dist/

## 📊 Comparaison Temps

| Mode | Temps | Usage |
|------|-------|-------|
| Quick (local build) | 2-3 min | Corrections mineures |
| Fast (cache) | 3-5 min | Corrections moyennes |
| Full (no-cache) | 10-15 min | Releases majeures |

## 🎯 Prochaines Étapes

1. **Créer le nouveau workflow dans Obsidian**
2. **Modifier le script avec les nouvelles options**
3. **Tester les différents modes**
4. **Documenter les cas d'usage**
