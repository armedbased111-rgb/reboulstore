# 🚀 Optimisation Cursor IDE - Reboul Store

## 📊 Diagnostic Actuel

### Consommation CPU/RAM

**Cursor consomme beaucoup de ressources** :

- **CPU principal (Renderer)** : 35.4% CPU, 913MB RAM
- **GPU Process** : 9.6% CPU, 73MB RAM
- **Plugin Host** : 4.0% CPU, 269MB RAM
- **Extensions** : Plusieurs processus (ESLint, Volar, TypeScript, etc.)

**Total estimé** : ~50% CPU, ~1.5-2GB RAM

### Espace Disque

- **Application Support** : 5.1GB (`~/Library/Application Support/Cursor`)
- **Extensions** : 660MB (`~/.cursor`)
- **Logs process-monitor** : S'accumulent au fil du temps

---

## 🛠️ Solutions pour Réduire la Charge CPU

### 1. Nettoyer les Logs et Cache ⭐⭐⭐

**Logs process-monitor :**
```bash
# Voir la taille des logs
du -sh ~/Library/Application\ Support/Cursor/process-monitor

# Supprimer les anciens logs (garder les 7 derniers jours)
find ~/Library/Application\ Support/Cursor/process-monitor -name "*.log" -mtime +7 -delete
```

**Cache Cursor :**
```bash
# Vérifier l'espace utilisé
du -sh ~/Library/Application\ Support/Cursor/Cache
du -sh ~/Library/Application\ Support/Cursor/CachedData

# Supprimer le cache (Cursor le recréera)
rm -rf ~/Library/Application\ Support/Cursor/Cache/*
rm -rf ~/Library/Application\ Support/Cursor/CachedData/*
```

**⚠️ Attention** : Fermer Cursor avant de supprimer le cache.

---

### 2. Désactiver les Extensions Non Utilisées ⭐⭐⭐

**Certaines extensions peuvent consommer beaucoup de CPU :**

- **ESLint** : Peut être lourd sur de gros projets
- **Prettier** : Formatage automatique
- **Extensions de langage** (TypeScript, Volar, etc.) : Nécessaires mais peuvent être optimisées

**Comment identifier une extension problématique :**

1. **Mode sans extensions** :
   ```bash
   cursor --disable-extensions
   ```
   Si CPU baisse → une extension est en cause

2. **Désactiver les extensions une par une** :
   - Cmd+Shift+P → "Extensions: Show Installed Extensions"
   - Désactiver les extensions non essentielles
   - Tester la consommation CPU

3. **Extensions à vérifier en priorité** :
   - Extensions de linting (ESLint, Prettier)
   - Extensions de language servers (TypeScript, Volar)
   - Extensions de Git
   - Extensions de thèmes/UI

---

### 3. Limiter les Processus TypeScript/Language Servers ⭐⭐

**TypeScript et les language servers peuvent consommer beaucoup de CPU :**

**Paramètres Cursor (settings.json) :**

```json
{
  // Limiter les vérifications TypeScript
  "typescript.tsserver.maxTsServerMemory": 2048,
  "typescript.tsserver.watchOptions": {
    "excludeDirectories": ["**/node_modules", "**/dist", "**/build"]
  },
  
  // Désactiver la vérification automatique sur gros projets
  "typescript.tsserver.useSeparateSyntaxServer": false,
  
  // Limiter les extensions de language servers
  "volar.takeOverMode.enabled": true,
  
  // Réduire les suggestions automatiques
  "editor.quickSuggestions": {
    "other": "on",
    "comments": "off",
    "strings": "off"
  }
}
```

**Accès aux settings :**
- Cmd+, (Settings) → Rechercher "typescript" ou "tsserver"
- Ou éditer directement : `~/.cursor/User/settings.json`

---

### 4. Nettoyer les Extensions Non Utilisées ⭐⭐

**Supprimer les extensions inutiles :**

```bash
# Lister les extensions installées
ls -la ~/.cursor/extensions/

# Supprimer une extension (exemple)
rm -rf ~/.cursor/extensions/dbaeumer.vscode-eslint-3.0.20-universal
```

**Via l'interface Cursor :**
- Cmd+Shift+P → "Extensions: Show Installed Extensions"
- Désinstaller les extensions non utilisées

---

### 5. Réduire les Fichiers Surveillés (Watch) ⭐⭐

**Cursor surveille tous les fichiers du projet, ce qui peut être lourd :**

**Exclure des dossiers du watch :**

**`.cursorignore` ou `.gitignore` (si pas déjà fait) :**

```
node_modules/
dist/
build/
.next/
.cache/
*.log
.DS_Store
```

**Settings Cursor :**

```json
{
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/**": true,
    "**/dist/**": true,
    "**/build/**": true,
    "**/.cache/**": true
  },
  
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/build": true,
    "**/.cache": true
  }
}
```

---

### 6. Redémarrer Cursor Régulièrement ⭐

**Cursor peut accumuler de la mémoire au fil du temps :**

- **Fermer et rouvrir Cursor** : Libère la mémoire accumulée
- **Redémarrer le Mac** : Solution ultime si Cursor devient trop lent

---

## 📋 Checklist d'Optimisation

### Nettoyage Immédiat (1x)

- [ ] Fermer Cursor
- [ ] Nettoyer les logs process-monitor : `find ~/Library/Application\ Support/Cursor/process-monitor -name "*.log" -mtime +7 -delete`
- [ ] Vérifier la taille : `du -sh ~/Library/Application\ Support/Cursor`
- [ ] Redémarrer Cursor

### Optimisation Settings (1x)

- [ ] Configurer TypeScript settings (limiter mémoire, watch)
- [ ] Configurer files.watcherExclude (exclure node_modules, dist, etc.)
- [ ] Vérifier les extensions installées
- [ ] Désactiver les extensions non essentielles

### Maintenance Périodique (1x/mois)

- [ ] Nettoyer les logs anciens (> 7 jours)
- [ ] Vérifier les extensions non utilisées
- [ ] Redémarrer Cursor (libère mémoire)

---

## 🎯 Script de Nettoyage Automatique

**Script à créer :** `scripts/cleanup-cursor.sh`

```bash
#!/bin/bash
# Script de nettoyage Cursor IDE

echo "🧹 Nettoyage Cursor IDE..."

# Fermer Cursor (optionnel, demander confirmation)
read -p "Fermer Cursor maintenant ? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    killall Cursor 2>/dev/null
    sleep 2
fi

# Nettoyer les logs process-monitor (> 7 jours)
echo "📋 Nettoyage des logs process-monitor..."
find ~/Library/Application\ Support/Cursor/process-monitor -name "*.log" -mtime +7 -delete 2>/dev/null
echo "✅ Logs nettoyés"

# Afficher l'espace utilisé
echo ""
echo "📊 Espace utilisé :"
du -sh ~/Library/Application\ Support/Cursor 2>/dev/null
du -sh ~/.cursor 2>/dev/null

echo ""
echo "✅ Nettoyage terminé !"
echo "💡 Redémarrer Cursor pour appliquer les changements"
```

**Utilisation :**

```bash
chmod +x scripts/cleanup-cursor.sh
./scripts/cleanup-cursor.sh
```

---

## ⚠️ Notes Importantes

1. **Ne pas supprimer tout le dossier Cursor** :
   - Supprimer uniquement les logs et le cache
   - Les settings et extensions doivent rester

2. **Fermer Cursor avant nettoyage** :
   - Éviter les conflits de fichiers
   - Permettre la recréation propre du cache

3. **Backup settings avant nettoyage** (optionnel) :
   ```bash
   cp ~/.cursor/User/settings.json ~/.cursor/User/settings.json.backup
   ```

4. **TypeScript/Language Servers** :
   - Peuvent consommer beaucoup de CPU sur gros projets
   - Limiter la mémoire allouée peut aider
   - Exclure node_modules du watch est essentiel

5. **Extensions** :
   - Certaines extensions sont nécessaires (TypeScript, ESLint pour le projet)
   - Désactiver uniquement celles non essentielles
   - Tester en mode sans extensions pour identifier les problèmes

---

## 🔍 Différences Cursor vs Docker

### Cursor (IDE/Éditeur de Code)

- **Rôle** : Éditeur de code avec IA (comme VS Code)
- **Ressources** : CPU/RAM pour éditer, linting, suggestions
- **Optimisation** : Nettoyage cache/logs, désactiver extensions
- **Usage** : Continu quand tu développes
- **Problème** : Peut consommer beaucoup de CPU/RAM (normal pour un IDE moderne)

### Docker (Containers)

- **Rôle** : Containers pour backend/frontend/database
- **Ressources** : CPU/RAM pour les containers
- **Optimisation** : Build cache, logs, processus docker compose logs
- **Usage** : Continu quand les containers tournent
- **Problème** : Build cache volumineux, logs qui s'accumulent

**Conclusion** : Ce sont deux choses différentes. Cursor = IDE, Docker = containers. Les deux peuvent consommer du CPU, mais pour des raisons différentes.

---

## 📚 Références

- **Forum Cursor** : https://forum.cursor.com/t/high-cpu-usage-on-cursor-macos
- **Documentation Cursor** : https://docs.cursor.com/
- **VS Code Settings** (Cursor est basé sur VS Code) : https://code.visualstudio.com/docs/getstarted/settings

