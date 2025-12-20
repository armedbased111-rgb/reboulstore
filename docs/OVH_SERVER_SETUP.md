# 🖥️ Configuration Serveur OVH - Guide Complet

**Version** : 1.1  
**Date** : 17 décembre 2025  
**Phase** : 17.11.5 - Achat & Configuration Serveur OVH  
**Statut** : 📋 Configuration actuelle (VPS Standard) - Migration prévue Phase 25

---

## 📋 Table des matières

1. [Analyse de l'Architecture](#1-analyse-de-larchitecture)
2. [Besoins en Ressources](#2-besoins-en-ressources)
3. [Recommandations Serveur](#3-recommandations-serveur)
4. [Achat Serveur OVH](#4-achat-serveur-ovh)
5. [Configuration Initiale](#5-configuration-initiale)
6. [Configuration DNS](#6-configuration-dns)
7. [Préparation Déploiement](#7-préparation-déploiement)
8. [Vérifications Finales](#8-vérifications-finales)
9. [Commandes Utiles](#9-commandes-utiles)
10. [Maintenance & Monitoring](#10-maintenance--monitoring)
11. [Troubleshooting](#11-troubleshooting)
12. [Migration Serveur (Phase 25)](#12-migration-serveur-phase-25)
13. [Checklist Complète](#13-checklist-complète)

---

## 1. Analyse de l'Architecture

### 1.1 Architecture Globale du Projet

Notre projet utilise une **architecture multi-sites** avec une **admin centralisée** :

```
📦 Architecture Production
│
├── 🏪 reboulstore/ (Site E-commerce Reboul - MVP Février 2025)
│   ├── PostgreSQL (Base de données)
│   ├── Backend NestJS (API REST)
│   ├── Frontend React (Build statique)
│   └── Nginx (Reverse proxy + serveur statique)
│
├── 🎛️ admin-central/ (Application Admin Centralisée)
│   ├── Backend NestJS (API REST - connexions multiples DB)
│   ├── Frontend React (Build statique)
│   └── Nginx (Reverse proxy + serveur statique)
│
└── 🔮 FUTUR (Post-Février 2025)
    ├── cpcompany/ (Site E-commerce CP Company)
    └── outlet/ (Site E-commerce Outlet)
```

### 1.2 Services Docker à Héberger

#### Services Actuels (MVP Février 2025)

**Reboul Store** (`docker-compose.prod.yml`) :
- ✅ `postgres` : PostgreSQL 15 Alpine (base de données)
- ✅ `backend` : NestJS (API REST, port interne 3001)
- ✅ `frontend` : React build statique (servi par Nginx)
- ✅ `nginx` : Reverse proxy (ports 80/443 exposés)

**Admin Central** (`admin-central/docker-compose.prod.yml`) :
- ✅ `backend` : NestJS (API REST, port interne 4001)
- ✅ `frontend` : React build statique (servi par Nginx)
- ✅ `nginx` : Reverse proxy (ports 4000/4443 internes, 80/443 via reboulstore nginx)

**Total actuel** : **7 containers Docker**

#### Services Futurs (Post-Février 2025)

**CP Company** (à ajouter) :
- `postgres` : PostgreSQL (base de données séparée)
- `backend` : NestJS (API REST)
- `frontend` : React build statique
- `nginx` : Reverse proxy

**Outlet** (à ajouter) :
- `postgres` : PostgreSQL (base de données séparée)
- `backend` : NestJS (API REST)
- `frontend` : React build statique
- `nginx` : Reverse proxy

**Total futur** : **15 containers Docker** (7 actuels + 8 futurs)

### 1.3 Ports et Réseaux

#### Ports Exposés (Host)

- **80** : HTTP (Nginx Reboul Store)
- **443** : HTTPS (Nginx Reboul Store)
- **22** : SSH (accès serveur)

#### Ports Internes (Docker Network)

- **3001** : Backend Reboul (interne)
- **4001** : Backend Admin (interne)
- **5432** : PostgreSQL Reboul (interne)
- **4000/4443** : Nginx Admin (interne, routé via Nginx Reboul)

#### Réseaux Docker

- `reboulstore-network` : Réseau partagé entre Reboul Store et Admin Central

### 1.4 Volumes et Stockage

#### Volumes Docker

**Reboul Store** :
- `postgres_data_prod` : Données PostgreSQL (persistant)
- `frontend_build` : Build statique frontend (partagé avec Nginx)

**Admin Central** :
- `frontend_build` : Build statique frontend (partagé avec Nginx)

**Estimation stockage** :
- PostgreSQL : ~2-5 GB (base de données + logs)
- Builds frontend : ~500 MB (builds statiques)
- Images Docker : ~3-5 GB (images de base)
- Logs : ~1-2 GB (rotation configurée)
- **Total estimé** : **~10-15 GB** (MVP)
- **Total futur** : **~30-50 GB** (avec CP Company + Outlet)

### 1.5 Trafic et Bande Passante

#### Estimation Trafic (MVP Février 2025)

**Scénario conservateur** :
- **Visiteurs/jour** : 100-500
- **Pages vues/jour** : 500-2000
- **Taille moyenne page** : 2-5 MB (images incluses)
- **Trafic sortant/jour** : ~5-10 GB
- **Trafic sortant/mois** : ~150-300 GB

**Scénario optimiste** :
- **Visiteurs/jour** : 500-2000
- **Pages vues/jour** : 2000-8000
- **Trafic sortant/mois** : ~500 GB - 1 TB

#### Bande Passante Requise

- **Minimum** : 100 Mbps (pour MVP)
- **Recommandé** : 250 Mbps (pour croissance)
- **Idéal** : 500 Mbps+ (pour scalabilité)

---

## 2. Besoins en Ressources

### 2.1 CPU (Processeur)

#### Analyse par Service

**PostgreSQL** :
- Usage : Base de données (requêtes, index, transactions)
- Besoin : 1-2 cores (modéré)
- Pic : 2-3 cores (requêtes complexes, backups)

**Backend NestJS (Reboul)** :
- Usage : API REST (requêtes HTTP, logique métier)
- Besoin : 1-2 cores (modéré)
- Pic : 2-3 cores (trafic élevé, traitement images)

**Backend NestJS (Admin)** :
- Usage : API REST (gestion admin, connexions DB multiples)
- Besoin : 0.5-1 core (faible à modéré)
- Pic : 1-2 cores (imports/exports, traitements batch)

**Nginx** :
- Usage : Reverse proxy, serveur statique (très léger)
- Besoin : 0.5 core (très faible)
- Pic : 1 core (trafic élevé)

**Total MVP** : **4-6 cores** recommandés  
**Total futur** : **8-12 cores** recommandés (avec CP Company + Outlet)

### 2.2 RAM (Mémoire)

#### Analyse par Service

**PostgreSQL** :
- Base : 512 MB - 1 GB
- Cache : 1-2 GB (pour performance)
- **Total** : 1.5-3 GB

**Backend NestJS (Reboul)** :
- Node.js base : 200-300 MB
- Application : 300-500 MB
- **Total** : 500-800 MB

**Backend NestJS (Admin)** :
- Node.js base : 200-300 MB
- Application : 200-400 MB
- **Total** : 400-700 MB

**Nginx** :
- Très léger : 50-100 MB par instance
- **Total** : 100-200 MB

**Système (OS, Docker, overhead)** :
- Ubuntu/Docker : 500 MB - 1 GB
- Overhead : 500 MB - 1 GB
- **Total** : 1-2 GB

**Total MVP** : **4-6 GB** recommandés  
**Total futur** : **8-12 GB** recommandés (avec CP Company + Outlet)

### 2.3 Stockage (Disque)

#### Besoins par Type

**Système d'exploitation** :
- Ubuntu 22.04 LTS : ~10 GB

**Docker & Images** :
- Images de base : ~3-5 GB
- Images builds : ~2-3 GB
- **Total** : ~5-8 GB

**Bases de données** :
- PostgreSQL Reboul : ~2-5 GB (données + logs)
- PostgreSQL CP Company (futur) : ~2-5 GB
- PostgreSQL Outlet (futur) : ~2-5 GB
- **Total MVP** : ~2-5 GB
- **Total futur** : ~6-15 GB

**Builds Frontend** :
- Reboul : ~200 MB
- Admin : ~200 MB
- CP Company (futur) : ~200 MB
- Outlet (futur) : ~200 MB
- **Total MVP** : ~400 MB
- **Total futur** : ~800 MB

**Logs** :
- Rotation configurée (10MB max, 3-5 fichiers)
- **Total** : ~500 MB - 1 GB

**Backups** :
- Backups DB (30 derniers) : ~5-10 GB
- **Total** : ~5-10 GB

**Espace libre (sécurité)** :
- 20% d'espace libre recommandé
- **Total** : ~5-10 GB

**Total MVP** : **~30-50 GB** recommandés  
**Total futur** : **~60-100 GB** recommandés

**Type de disque** : **SSD obligatoire** (performance bases de données)

### 2.4 Réseau

#### Bande Passante

- **Minimum** : 100 Mbps
- **Recommandé** : 250 Mbps
- **Idéal** : 500 Mbps+

#### Latence

- **Localisation** : France (pour latence réduite)
- **Cible** : < 50ms (France métropolitaine)

---

## 3. Recommandations Serveur

### 3.1 VPS-3 (VPS 2026) ✅ CHOIX FINAL

**Caractéristiques VPS-3** :
- **Gamme** : VPS-3 (VPS 2026 - Nouvelle gamme OVHcloud)
- **CPU** : 8 vCores
- **RAM** : 24 GB
- **Stockage** : 200 GB SSD NVMe
- **Bande passante** : 1,5 Gbit/s (illimitée)
- **Sauvegarde** : Automatique incluse (1 jour)
- **OS** : Ubuntu 22.04 LTS (à installer)
- **Localisation** : France (Gravelines, Roubaix, ou Paris)

**Avantages** :
- ✅ Suffisant pour architecture complète (3 sites + Admin = 15 containers)
- ✅ Pas de migration nécessaire (supporte MVP + expansion)
- ✅ Ressources confortables (24 GB RAM, 200 GB SSD)
- ✅ Excellent rapport qualité/prix (14,28€ TTC/mois)
- ✅ Économie sur le long terme (évite migration + coûts supplémentaires)
- ✅ Upgrade possible en 1 clic (vers VPS-4, VPS-5, etc.)
- ✅ Sauvegarde automatique incluse
- ✅ Trafic illimité

**Prix** : **11,90 € HT/mois (14,28 € TTC/mois)**

**📝 Note** : Cette configuration évite la Phase 25 (migration serveur). Upgrade possible en 1 clic si besoin.

### 3.2 Option 2 : Serveur Dédié (Recommandé pour Production)

**Caractéristiques recommandées** :
- **Type** : Serveur Dédié
- **CPU** : 4-8 cores (Intel ou AMD)
- **RAM** : 16 GB (minimum 8 GB)
- **Stockage** : 2x 250 GB SSD (RAID 1 recommandé)
- **Bande passante** : 250 Mbps
- **OS** : Ubuntu 22.04 LTS
- **Localisation** : France

**Avantages** :
- ✅ Performance garantie (ressources dédiées)
- ✅ Scalabilité élevée
- ✅ Sécurité renforcée (isolation totale)
- ✅ Parfait pour production et croissance

**Inconvénients** :
- ⚠️ Coût plus élevé (~50-100€/mois)
- ⚠️ Gestion plus complexe

**Prix estimé OVH** : **~60-120€/mois**

### 3.3 Option 3 : VPS Scalable (Compromis)

**Caractéristiques recommandées** :
- **Type** : VPS Scalable (OVH)
- **CPU** : 4 cores (scalable jusqu'à 8)
- **RAM** : 8 GB (scalable jusqu'à 16 GB)
- **Stockage** : 100 GB SSD (scalable)
- **Bande passante** : 250 Mbps
- **OS** : Ubuntu 22.04 LTS

**Avantages** :
- ✅ Coût initial réduit (~25-40€/mois)
- ✅ Upgrade facile sans migration
- ✅ Parfait compromis MVP → Production

**Prix estimé OVH** : **~30-50€/mois**

### 3.4 Recommandation Finale ✅

**✅ Notre choix : VPS-3 (VPS 2026) - Architecture complète dès le départ**

**Configuration choisie** : **VPS-3 - 8 vCores / 24 GB RAM / 200 GB SSD NVMe** (~14,28€ TTC/mois)
- ✅ Suffisant pour architecture complète (Reboul + CP Company + Outlet + Admin Central = 15 containers)
- ✅ Pas besoin de migration future
- ✅ Ressources confortables (24 GB RAM, 200 GB SSD)
- ✅ Excellent rapport qualité/prix
- ✅ Économie sur le long terme (évite migration + coûts supplémentaires)

**Caractéristiques VPS-3** :
- **CPU** : 8 vCores (suffisant pour 15 containers)
- **RAM** : 24 GB (large marge, recommandé : 8-12 GB)
- **Stockage** : 200 GB SSD NVMe (large marge, recommandé : 60-100 GB)
- **Prix** : 11,90 € HT/mois (14,28 € TTC/mois)
- **Bande passante** : 1,5 Gbit/s (illimitée)
- **Sauvegarde** : Automatique incluse (1 jour)

**Avantages** :
- ✅ Supporte MVP (Reboul + Admin) + architecture complète (3 sites)
- ✅ Pas de migration nécessaire (économies ~550€ sur 24 mois vs migration)
- ✅ Ressources confortables dès le départ
- ✅ Moins de risque opérationnel (pas de downtime migration)
- ✅ Upgrade possible en 1 clic si besoin (vers VPS-4, VPS-5, etc.)

**📝 Note** : Phase 25 (Migration serveur) devient optionnelle, seulement si upgrade vers VPS supérieur nécessaire

---

## 4. Achat Serveur OVH

### 4.1 Checklist Avant Achat

- [ ] ✅ Analyse architecture complétée
- [ ] ✅ Besoins en ressources déterminés
- [ ] ✅ Type de serveur choisi (VPS / Dédié)
- [ ] ✅ Budget validé
- [ ] ✅ Localisation choisie (France)
- [ ] ⏳ **À FAIRE** : Commander le serveur OVH
- [ ] ⏳ **À FAIRE** : Noter les informations d'accès

### 4.2 Processus d'Achat OVH

#### Étape 1 : Connexion Espace Client

1. Se connecter à https://www.ovh.com/manager/
2. Aller dans **"Bare Metal Cloud"** → **"Serveurs"**

#### Étape 2 : Choix du Type de Serveur

**Pour VPS** :
- Cliquer sur **"VPS"** → **"Commander un VPS"**
- Choisir la gamme (Value, Essential, Elite, etc.)

**Pour Serveur Dédié** :
- Cliquer sur **"Serveurs Dédiés"** → **"Commander un serveur"**
- Choisir la gamme (Eco, Advance, High Grade, etc.)

#### Étape 3 : Configuration

**Caractéristiques à sélectionner (VPS-3)** :

✅ **Gamme** : VPS-3 (VPS 2026)  
✅ **CPU** : 8 vCores  
✅ **RAM** : 24 GB  
✅ **Stockage** : 200 GB SSD NVMe  
✅ **OS** : Ubuntu 22.04 LTS  
✅ **Localisation** : France (Gravelines, Roubaix, ou Paris)  
✅ **Bande passante** : 1,5 Gbit/s (illimitée)  
✅ **Sauvegarde** : Automatique incluse (1 jour)

**Note** : Cette configuration couvre l'architecture complète (Reboul + CP Company + Outlet + Admin Central).  
Pas de migration nécessaire pour l'ajout de CP Company ou Outlet.

#### Étape 4 : Options (Optionnel)

- [ ] Backup automatique (recommandé)
- [ ] IP Failover (si besoin de plusieurs IP)
- [ ] Monitoring (optionnel, on a déjà notre monitoring)

#### Étape 5 : Commande

1. Vérifier le récapitulatif
2. Choisir la durée d'engagement (1 mois, 12 mois, etc.)
3. Valider la commande
4. Payer

#### Étape 6 : Réception Informations

**À noter immédiatement** (dans un fichier sécurisé) :

- ✅ **IP publique** : `XXX.XXX.XXX.XXX`
- ✅ **Identifiant root** : `root`
- ✅ **Mot de passe root** : `XXXXXXXX` (généré par OVH)
- ✅ **URL accès** : `https://www.ovh.com/manager/...`
- ✅ **Date d'activation** : `XX/XX/XXXX`

**⚠️ IMPORTANT** : Ne jamais commiter ces informations dans Git !

---

## 5. Configuration Initiale

### 5.1 Accès Initial au Serveur

#### Connexion SSH

```bash
# Connexion avec mot de passe root (première fois)
ssh root@VOTRE_IP_SERVEUR

# Ou depuis votre machine locale
ssh root@XXX.XXX.XXX.XXX
```

**Première connexion** : Accepter la clé SSH (taper `yes`)

### 5.2 Mise à Jour Système

```bash
# Mise à jour des packages
apt update && apt upgrade -y

# Installation des outils de base
apt install -y curl wget git vim ufw htop fail2ban

# Vérifier la version Ubuntu
lsb_release -a
# Doit afficher : Ubuntu 22.04 LTS
```

### 5.3 Installation Docker

```bash
# Installation Docker (script officiel)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Vérifier l'installation
docker --version
# Doit afficher : Docker version 24.x.x ou supérieur

# Vérifier Docker Compose
docker compose version
# Doit afficher : Docker Compose version v2.x.x

# Démarrer Docker au boot
systemctl enable docker
systemctl start docker

# Vérifier que Docker fonctionne
docker ps
# Doit afficher une liste vide (pas d'erreur)
```

### 5.4 Configuration Firewall (UFW)

```bash
# ⚠️ IMPORTANT : Autoriser SSH AVANT d'activer le firewall
ufw allow 22/tcp

# Activer UFW
ufw enable

# Autoriser HTTP et HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Vérifier le statut
ufw status
# Doit afficher :
# Status: active
# 22/tcp    ALLOW    Anywhere
# 80/tcp    ALLOW    Anywhere
# 443/tcp   ALLOW    Anywhere
```

### 5.5 Créer Utilisateur Non-Root

```bash
# Créer un utilisateur pour le déploiement
adduser deploy
# Suivre les instructions (mot de passe fort, infos optionnelles)

# Ajouter l'utilisateur au groupe docker
usermod -aG docker deploy

# Ajouter l'utilisateur au groupe sudo
usermod -aG sudo deploy

# Vérifier les groupes
groups deploy
# Doit afficher : deploy sudo docker
```

### 5.6 Configuration SSH avec Clés

#### Sur votre machine locale

```bash
# Générer une clé SSH si vous n'en avez pas
ssh-keygen -t ed25519 -C "votre-email@example.com"

# Copier la clé publique sur le serveur
ssh-copy-id deploy@VOTRE_IP_SERVEUR
```

#### Sur le serveur

```bash
# Se connecter en tant que deploy
su - deploy

# Vérifier que la clé est bien copiée
cat ~/.ssh/authorized_keys

# Configurer les permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

#### Sécuriser SSH (désactiver password auth)

```bash
# Éditer la configuration SSH
sudo nano /etc/ssh/sshd_config

# Modifier les lignes suivantes :
# PasswordAuthentication no
# PermitRootLogin no
# PubkeyAuthentication yes

# Redémarrer SSH
sudo systemctl restart sshd

# ⚠️ TESTER la connexion SSH AVANT de fermer la session actuelle
# Ouvrir un nouveau terminal et tester :
# ssh deploy@VOTRE_IP_SERVEUR
```

### 5.7 Installation Fail2ban (Protection contre bruteforce)

```bash
# Installer Fail2ban
sudo apt install -y fail2ban

# Démarrer Fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Vérifier le statut
sudo systemctl status fail2ban
```

---

## 6. Configuration DNS

### 6.1 Enregistrements DNS à Créer

Dans votre gestionnaire DNS (OVH ou autre) :

```
Type    Nom                    Valeur              TTL     Priorité
A       reboulstore.com        IP_SERVEUR          3600    -
A       www                    IP_SERVEUR          3600    -
A       admin                  IP_SERVEUR          3600    -
```

**Exemple** :
```
Type    Nom                    Valeur              TTL
A       reboulstore.com        51.XXX.XXX.XXX       3600
A       www                    51.XXX.XXX.XXX       3600
A       admin                  51.XXX.XXX.XXX       3600
```

### 6.2 Vérifier la Propagation DNS

```bash
# Depuis votre machine locale
dig reboulstore.com
nslookup reboulstore.com
ping reboulstore.com

# Vérifier admin.reboulstore.com
dig admin.reboulstore.com
nslookup admin.reboulstore.com
```

**⏰ Note** : La propagation DNS peut prendre **24-48 heures**.  
**✅ Test** : Quand `dig` retourne votre IP serveur, c'est bon !

---

## 7. Préparation Déploiement

### 7.1 Cloner le Repository

```bash
# Sur le serveur (en tant que deploy)
cd /opt
sudo mkdir -p /opt/reboulstore
sudo chown deploy:deploy /opt/reboulstore
cd /opt/reboulstore

# Cloner le repository
git clone https://github.com/votre-repo/reboulstore.git .
# OU si repository privé :
# git clone git@github.com:votre-repo/reboulstore.git .
```

### 7.2 Créer les Fichiers d'Environnement

#### Reboul Store

```bash
# Copier le template
cp env.production.example .env.production

# Éditer avec les vraies valeurs
nano .env.production
```

**Variables à configurer** :
```env
# Database
DB_USERNAME=reboulstore
DB_PASSWORD=<GÉNÉRER_UN_MOT_DE_PASSE_FORT>
DB_DATABASE=reboulstore_db

# JWT
JWT_SECRET=<GÉNÉRER_UN_SECRET_FORT>

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# URLs
FRONTEND_URL=https://reboulstore.com
VITE_API_URL=https://reboulstore.com/api
```

#### Admin Central

```bash
cd admin-central
cp env.production.example .env.production
nano .env.production
```

**Variables à configurer** :
```env
# Port
PORT=4001

# URLs
FRONTEND_URL=https://admin.reboulstore.com
VITE_API_URL=https://admin.reboulstore.com/api

# JWT
JWT_SECRET=<MÊME_QUE_REBOUL_OU_DIFFÉRENT>

# Connexion Reboul Database
REBOUL_DB_USER=reboulstore
REBOUL_DB_PASSWORD=<MÊME_QUE_REBOUL>
REBOUL_DB_NAME=reboulstore_db

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### 7.3 Générer les Secrets

```bash
# Générer JWT_SECRET (32 caractères)
openssl rand -base64 32

# Générer mot de passe DB (24 caractères)
openssl rand -base64 24

# Copier les résultats dans .env.production
```

### 7.4 Vérifier les Ports Disponibles

```bash
# Vérifier que les ports 80 et 443 sont libres
sudo netstat -tulpn | grep -E ':(80|443)'

# Si rien n'est affiché, les ports sont libres ✅
```

---

## 8. Vérifications Finales

### 8.1 Checklist Avant Premier Déploiement

- [ ] ✅ Serveur acheté et activé
- [ ] ✅ Accès SSH fonctionnel (avec clés)
- [ ] ✅ Docker installé et fonctionnel
- [ ] ✅ Firewall configuré (ports 22, 80, 443)
- [ ] ✅ Utilisateur `deploy` créé (avec sudo + docker)
- [ ] ✅ Repository cloné sur le serveur
- [ ] ✅ Fichiers `.env.production` créés (Reboul + Admin)
- [ ] ✅ Secrets générés et configurés
- [ ] ✅ DNS configuré (reboulstore.com, admin.reboulstore.com)
- [ ] ✅ Propagation DNS vérifiée
- [ ] ⏳ **À FAIRE** : Premier déploiement (Phase 23)

### 8.2 Test de Connexion

```bash
# Depuis votre machine locale
ssh deploy@VOTRE_IP_SERVEUR

# Vérifier Docker
docker ps
docker compose version

# Vérifier les fichiers
ls -la /opt/reboulstore
ls -la /opt/reboulstore/.env.production
ls -la /opt/reboulstore/admin-central/.env.production
```

---

## 9. Commandes Utiles

### 9.1 Gestion Docker

```bash
# Voir les containers en cours
docker ps

# Voir tous les containers (y compris arrêtés)
docker ps -a

# Voir les logs d'un container
docker logs reboulstore-backend-prod -f

# Redémarrer un service
docker compose -f docker-compose.prod.yml restart backend

# Arrêter tous les services
docker compose -f docker-compose.prod.yml down

# Démarrer tous les services
docker compose -f docker-compose.prod.yml up -d
```

### 9.2 Monitoring Ressources

```bash
# Utilisation disque
df -h

# Utilisation mémoire
free -h

# Utilisation CPU
top
# ou
htop

# Utilisation réseau
iftop
```

### 9.3 Logs

```bash
# Logs Docker
docker compose -f docker-compose.prod.yml logs -f

# Logs système
journalctl -u docker -f

# Logs Nginx
docker logs reboulstore-nginx-prod -f
```

---

## 10. Maintenance & Monitoring

### 10.1 Backups Automatiques

```bash
# Configurer cron pour backup quotidien
crontab -e

# Ajouter cette ligne (backup à 2h du matin)
0 2 * * * /opt/reboulstore/scripts/backup-db.sh
```

### 10.2 Mises à Jour Système

```bash
# Mise à jour packages (mensuel recommandé)
sudo apt update && sudo apt upgrade -y

# Redémarrer si nécessaire
sudo reboot
```

### 10.3 Mises à Jour Application

```bash
# Pull les dernières modifications
cd /opt/reboulstore
git pull origin main

# Rebuild et redéployer
./scripts/deploy-reboul.sh --build
cd admin-central
./scripts/deploy-admin.sh --build
```

---

## 11. Troubleshooting

### 11.1 Container ne Démarre pas

```bash
# Vérifier les logs
docker compose -f docker-compose.prod.yml logs backend

# Vérifier la configuration
docker compose -f docker-compose.prod.yml config

# Vérifier les erreurs
docker compose -f docker-compose.prod.yml ps
```

### 11.2 Problème de Connexion DB

```bash
# Vérifier que PostgreSQL est accessible
docker exec reboulstore-postgres-prod psql -U reboulstore -d reboulstore_db -c "SELECT 1;"

# Vérifier les logs PostgreSQL
docker logs reboulstore-postgres-prod -f
```

### 11.3 Problème Nginx

```bash
# Vérifier la syntaxe
docker exec reboulstore-nginx-prod nginx -t

# Vérifier les logs
docker logs reboulstore-nginx-prod -f

# Redémarrer Nginx
docker compose -f docker-compose.prod.yml restart nginx
```

### 11.4 Problème de Mémoire

```bash
# Vérifier l'utilisation mémoire
free -h

# Nettoyer les images Docker inutilisées
docker system prune -a

# Vérifier les containers qui consomment le plus
docker stats
```

---

## 12. Checklist Complète

### Phase 1 : Analyse & Préparation ✅

- [x] ✅ Analyse architecture complétée
- [x] ✅ Besoins en ressources déterminés
- [x] ✅ Type de serveur choisi
- [x] ✅ Documentation créée

### Phase 2 : Achat Serveur ⏳

- [ ] ⏳ Serveur OVH commandé
- [ ] ⏳ Informations d'accès notées (IP, credentials)
- [ ] ⏳ Serveur activé et accessible

### Phase 3 : Configuration Initiale ⏳

- [ ] ⏳ Accès SSH fonctionnel
- [ ] ⏳ Système mis à jour
- [ ] ⏳ Docker installé
- [ ] ⏳ Firewall configuré
- [ ] ⏳ Utilisateur `deploy` créé
- [ ] ⏳ SSH sécurisé (clés, password auth désactivé)
- [ ] ⏳ Fail2ban installé

### Phase 4 : Configuration DNS ⏳

- [ ] ⏳ Enregistrements DNS créés
- [ ] ⏳ Propagation DNS vérifiée
- [ ] ⏳ Domaines accessibles (reboulstore.com, admin.reboulstore.com)

### Phase 5 : Préparation Déploiement ⏳

- [ ] ⏳ Repository cloné
- [ ] ⏳ Fichiers `.env.production` créés
- [ ] ⏳ Secrets générés et configurés
- [ ] ⏳ Ports vérifiés (80, 443 libres)

### Phase 6 : Vérifications Finales ⏳

- [ ] ⏳ Tous les services testés
- [ ] ⏳ Documentation complétée
- [ ] ⏳ Prêt pour Phase 23 (Déploiement)

### Phase 7 : Upgrade/Migration Serveur (Phase 25 - Optionnel) ⏳

**📝 Note** : VPS-3 supporte déjà l'architecture complète. Cette phase n'est nécessaire que pour upgrade vers VPS supérieur ou migration vers Dédié.

- [ ] ⏳ Analyse besoins (si upgrade nécessaire)
- [ ] ⏳ Upgrade VPS en 1 clic (VPS-3 → VPS-4/5/6) OU Achat nouveau serveur (Dédié)
- [ ] ⏳ Configuration nouveau serveur (si migration)
- [ ] ⏳ Migration données & application (si migration)
- [ ] ⏳ Tests & validation
- [ ] ⏳ Bascule DNS (si migration)
- [ ] ⏳ Cleanup ancien serveur (si migration)
- [ ] ⏳ Documentation upgrade/migration complétée

---

## 📝 Notes Importantes

### Sécurité

- ⚠️ **Ne jamais commiter** les credentials serveur dans Git
- 🔐 **Utiliser des mots de passe forts** (générés avec `openssl rand`)
- 🔑 **SSH avec clés uniquement** (désactiver password auth)
- 🛡️ **Firewall activé** (ports 22, 80, 443 uniquement)
- 📋 **Backups automatiques** configurés

### Performance

- 💾 **SSD obligatoire** (performance bases de données)
- 🚀 **RAM suffisante** (4-8 GB minimum pour MVP)
- 🌐 **Bande passante** (250 Mbps recommandé)
- 📊 **Monitoring** (logs, ressources, uptime)

### Maintenance

- 🔄 **Mises à jour régulières** (système, packages)
- 💾 **Backups quotidiens** (base de données)
- 📝 **Logs rotation** (configurée dans Docker)
- 🔍 **Monitoring** (UptimeRobot, Sentry optionnel)

---

## 12. Migration Serveur (Phase 25) - OPTIONNEL

### 12.1 Contexte de la Migration

**⚠️ NOTE IMPORTANTE** : Avec le choix du **VPS-3 (8 vCores / 24 GB RAM / 200 GB SSD)**, la migration n'est **PAS NÉCESSAIRE** pour ajouter CP Company et Outlet.

Le VPS-3 supporte déjà l'architecture complète (Reboul + CP Company + Outlet + Admin Central = 15 containers).

**Quand migrer alors ?**

La migration ne devient nécessaire que si :
- Upgrade vers VPS supérieur nécessaire (VPS-4, VPS-5, VPS-6)
- Besoin de ressources supplémentaires (CPU, RAM, stockage)
- Migration vers Serveur Dédié pour performance garantie

**Phase** : Phase 25 dans ROADMAP_COMPLETE.md (devenue optionnelle)

### 12.2 Upgrade VPS (Recommandé si besoin)

**Avantages upgrade VPS en 1 clic** :

- ✅ Upgrade instantané (VPS-3 → VPS-4, VPS-5, VPS-6)
- ✅ Pas de migration manuelle nécessaire
- ✅ Pas de downtime
- ✅ Upgrade progressif possible

**Options upgrade** :

1. **VPS-4** : 12 vCores / 48 GB RAM / 300 GB SSD (~25,50€ TTC/mois)
2. **VPS-5** : 16 vCores / 64 GB RAM / 350 GB SSD (~37,74€ TTC/mois)
3. **VPS-6** : 24 vCores / 96 GB RAM / 400 GB SSD (~49,98€ TTC/mois)

**Quand upgrader ?**

- Trafic très élevé (milliers de visiteurs/jour)
- Applications très gourmandes en ressources
- Besoin de plus de CPU/RAM/stockage

### 12.3 Migration vers Serveur Dédié (Si nécessaire)

**Si upgrade VPS insuffisant**, migration vers Serveur Dédié possible :

- CPU : 8+ cores (fixe)
- RAM : 16+ GB (fixe)
- Stockage : 2x 250 GB SSD (RAID 1)
- Coût : ~80-120€/mois
- Avantage : Performance garantie, isolation totale

**Plan de migration** (si nécessaire) :

1. ✅ **Planification** : Choisir fenêtre maintenance, prévoir backups
2. ✅ **Achat nouveau serveur** : Commander Serveur Dédié
3. ✅ **Configuration nouveau serveur** : Docker, firewall, utilisateur deploy
4. ✅ **Migration données** : Backup DB, restauration, déploiement app
5. ✅ **Tests** : Vérifier fonctionnement complet
6. ✅ **Bascule DNS** : Mettre à jour enregistrements DNS
7. ✅ **Cleanup** : Arrêter ancien serveur après 1 semaine

**📝 Documentation complète** : Voir Phase 25 dans `docs/context/ROADMAP_COMPLETE.md`

---

## 13. Checklist Complète

### Documentation

- **Déploiement** : `DEPLOY_PRODUCTION.md`
- **Monitoring** : `backend/MONITORING.md`
- **Architecture** : `docs/architecture/ARCHITECTURE_ADMIN_CENTRAL.md`

### Commandes Rapides

```bash
# Statut des services
docker compose -f docker-compose.prod.yml ps

# Logs en temps réel
docker compose -f docker-compose.prod.yml logs -f

# Backup base de données
./scripts/backup-db.sh

# Déploiement
./scripts/deploy-reboul.sh
```

---

**🎯 Prochaine Étape** : Phase 23 - Déploiement & Production

**📅 Date de complétion** : À compléter après achat et configuration serveur
