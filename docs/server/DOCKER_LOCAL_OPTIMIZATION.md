# 💻 Optimisation Docker Local (macOS) - Reboul Store

## 📊 Différences Local vs Production

### Contexte Local (macOS)

**Docker Desktop** sur macOS a des caractéristiques différentes du serveur de production :

1. **Usage intermittent** : Développement local (pas de trafic utilisateurs continu)
2. **Ressources partagées** : CPU/RAM partagés avec macOS (pas dédiés)
3. **Pas de contraintes production** : Pas de SLA, pas de monitoring continu
4. **Build cache plus petit** : Généralement 1-5GB (vs 80-90GB sur serveur)

### Contexte Production (VPS)

1. **Usage continu** : Services 24/7, trafic utilisateurs
2. **Ressources dédiées** : CPU/RAM dédiés au serveur
3. **Contraintes production** : Performance critique, monitoring
4. **Build cache volumineux** : Peut atteindre 80-90GB

---

## 🎯 Recommandations Docker Local

### ❌ PAS Besoin de Cronjobs Automatiques

**Pourquoi ?**
- Usage intermittent (tu arrêtes Docker quand tu ne l'utilises pas)
- Pas de contraintes de production
- Build cache plus petit (1-5GB, pas 80-90GB)
- Nettoyage manuel suffit

**Contrairement au serveur** où les cronjobs sont **essentiels** (services 24/7, build cache volumineux).

---

### ✅ Bonnes Pratiques Docker Local

#### 1. Nettoyage Manuel Périodique ⭐⭐

**Quand nettoyer ?**
- Avant un gros build (libère de l'espace)
- Quand Docker Desktop est lent
- Avant de fermer Docker Desktop pour plusieurs jours
- **Pas besoin de le faire tous les jours** (contrairement au serveur)

**Commandes utiles :**

```bash
# Voir l'utilisation de l'espace
docker system df

# Nettoyer le build cache (si besoin)
docker builder prune -f

# Nettoyer images non utilisées
docker image prune -a -f

# Nettoyer volumes non utilisés (⚠️ ATTENTION : peut supprimer des volumes de données)
docker volume prune -f

# Nettoyage complet (⚠️ ATTENTION : supprime tout ce qui n'est pas utilisé)
docker system prune -a --volumes -f
```

**Recommandation :** Nettoyer manuellement **1x par semaine ou 1x par mois**, selon l'usage.

---

#### 2. Configurer Docker Desktop Settings ⭐⭐⭐

**Limites de ressources recommandées :**

1. **CPU** : 2-4 cores (selon ton Mac)
   - Settings → Resources → Advanced → CPUs
   - Ne pas allouer tous les cores (garder pour macOS)

2. **RAM** : 4-8GB (selon ton Mac)
   - Settings → Resources → Advanced → Memory
   - Ne pas allouer toute la RAM (garder pour macOS)

3. **Swap** : 1-2GB
   - Settings → Resources → Advanced → Swap

4. **Disk image size** : 64-128GB (selon l'espace disque)
   - Settings → Resources → Advanced → Disk image size

**Comment accéder :**
- Docker Desktop → Settings (⚙️) → Resources → Advanced

---

#### 3. Arrêter Docker Desktop Quand Pas Utilisé ⭐⭐⭐

**Pourquoi ?**
- Libère CPU/RAM pour macOS
- Économise la batterie (MacBook)
- Pas besoin de Docker qui tourne en arrière-plan

**Comment :**
- Docker Desktop → Quit Docker Desktop (Cmd+Q)
- Redémarrer quand tu développes : `docker compose up`

---

#### 4. Nettoyer Avant de Fermer Docker Desktop ⭐

**Avant de fermer Docker Desktop pour plusieurs jours :**

```bash
# Arrêter les containers
docker compose down

# Nettoyer le build cache (optionnel)
docker builder prune -f

# Puis fermer Docker Desktop
```

**Bénéfice :** Redémarrage plus rapide, moins de ressources utilisées.

---

## 📊 État Actuel Docker Local

### Métriques Typiques

**Build cache :** 1-5GB (normal, pas besoin de nettoyer souvent)

**Images :** 2-5GB (normal, images nécessaires au projet)

**Volumes :** 500MB-2GB (normal, données de développement)

**Containers :** Généralement arrêtés (normal pour développement)

---

## 🆚 Comparaison Local vs Production

| Aspect | Local (macOS) | Production (VPS) |
|--------|---------------|------------------|
| **Usage** | Intermittent | Continu 24/7 |
| **Build cache** | 1-5GB | 80-90GB |
| **Optimisation CPU** | Optionnel | **Critique** ⭐⭐⭐ |
| **Cronjobs automatiques** | ❌ Pas nécessaire | ✅ **Essentiel** |
| **Nettoyage** | Manuel (1x/semaine) | Automatique (hebdomadaire) |
| **Ressources** | Partagées (macOS) | Dédiées (VPS) |
| **Monitoring** | Optionnel | **Essentiel** |
| **Performance** | Acceptable | **Critique** |

---

## 🎯 Checklist Docker Local

### Configuration Initiale (1x)

- [ ] Configurer Docker Desktop Settings (CPU, RAM, Swap)
- [ ] Vérifier l'espace disque disponible

### Maintenance Périodique (1x/semaine ou 1x/mois)

- [ ] Vérifier l'espace utilisé : `docker system df`
- [ ] Nettoyer le build cache si > 5GB : `docker builder prune -f`
- [ ] Nettoyer les images non utilisées si besoin : `docker image prune -a -f`

### Avant de Fermer Docker Desktop

- [ ] Arrêter les containers : `docker compose down`
- [ ] Nettoyer le build cache (optionnel) : `docker builder prune -f`
- [ ] Quitter Docker Desktop (Cmd+Q)

---

## ⚠️ Notes Importantes

1. **Ne pas sur-optimiser local** :
   - Le contexte local est différent du serveur
   - Pas besoin de cronjobs automatiques
   - Nettoyage manuel suffit

2. **Docker Desktop Settings** :
   - Limiter les ressources allouées (2-4 CPU, 4-8GB RAM)
   - Ne pas allouer toutes les ressources (garder pour macOS)

3. **Nettoyage prudent** :
   - ⚠️ `docker system prune -a --volumes` peut supprimer des volumes de données
   - Toujours vérifier avant de nettoyer : `docker system df`
   - Ne pas nettoyer les volumes si tu as des données importantes

4. **Build cache local** :
   - 1-5GB est normal
   - Pas besoin de nettoyer souvent (vs 80-90GB sur serveur)
   - Le build cache accélère les rebuilds

---

## 📚 Références

- **DOCKER_CPU_OPTIMIZATION.md** : `docs/server/DOCKER_CPU_OPTIMIZATION.md` - Optimisations serveur
- **Docker Desktop Settings** : https://docs.docker.com/desktop/settings/mac/
- **Docker system prune** : https://docs.docker.com/engine/reference/commandline/system_prune/

