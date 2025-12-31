# Configuration API GA4 pour CLI Realtime

## 🎯 Objectif

Configurer l'API GA4 Realtime pour accéder aux données depuis le CLI Python.

---

## ⚠️ Prérequis

1. **Compte Google Analytics** avec accès à la propriété GA4
2. **Compte Google Cloud** (gratuit, même compte Google)
3. **Property ID** de GA4 (format: `123456789`)

---

## 🚀 Étape 1 : Obtenir le Property ID

1. Aller sur https://analytics.google.com
2. Sélectionner la propriété "Reboul Store"
3. Aller dans **Admin** (⚙️ en bas à gauche)
4. Cliquer sur **"Property Settings"**
5. Copier le **Property ID** (format numérique, ex: `123456789`)

---

## 🔧 Étape 2 : Créer un projet Google Cloud

1. Aller sur https://console.cloud.google.com
2. Cliquer sur **"Select a project"** > **"New Project"**
3. Nom du projet : `reboulstore-analytics` (ou autre)
4. Cliquer **"Create"**

---

## 🔌 Étape 3 : Activer l'API Google Analytics Data API

1. Dans Google Cloud Console, aller dans **"APIs & Services"** > **"Library"**
2. Chercher **"Google Analytics Data API"**
3. Cliquer sur **"Enable"**

---

## 🔑 Étape 4 : Créer des credentials (Service Account - RECOMMANDÉ)

### Option A : Service Account (Pour CLI/Scripts)

1. Aller dans **"APIs & Services"** > **"Credentials"**
2. Cliquer **"Create Credentials"** > **"Service Account"**
3. Nom : `ga4-cli-access`
4. Cliquer **"Create and Continue"**
5. Rôle : **"Viewer"** (ou laisser vide)
6. Cliquer **"Done"**

### 4.1 Créer une clé JSON

1. Cliquer sur le Service Account créé
2. Onglet **"Keys"**
3. **"Add Key"** > **"Create new key"**
4. Type : **JSON**
5. Cliquer **"Create"**
6. Le fichier JSON se télécharge automatiquement

### 4.2 Donner accès au Service Account dans GA4

1. Aller sur https://analytics.google.com
2. **Admin** > **Property Access Management**
3. Cliquer **"+"** > **"Add users"**
4. Email du Service Account : `ga4-cli-access@[PROJECT-ID].iam.gserviceaccount.com`
5. Rôle : **"Viewer"**
6. Cliquer **"Add"**

---

## 🔑 Étape 5 : Alternative - OAuth2 (Pour applications interactives)

Si tu préfères OAuth2 (nécessite authentification dans le navigateur) :

1. **APIs & Services** > **"Credentials"**
2. **"Create Credentials"** > **"OAuth client ID"**
3. Type : **"Desktop app"**
4. Nom : `GA4 CLI`
5. Cliquer **"Create"**
6. Télécharger le fichier `credentials.json`

**Note** : OAuth2 nécessite une authentification interactive, Service Account est plus simple pour le CLI.

---

## 📦 Étape 6 : Installer la bibliothèque Python

```bash
cd cli
pip install google-analytics-data
```

---

## 🔐 Étape 7 : Configurer les credentials

### Avec Service Account (Recommandé)

1. Télécharger le fichier JSON du Service Account
2. Le sauvegarder dans le projet (ne PAS commiter dans git !) :
   ```bash
   # Exemple : cli/credentials/ga4-service-account.json
   mkdir -p cli/credentials
   # Copier le fichier JSON téléchargé ici
   ```

3. Ajouter au `.gitignore` :
   ```
   cli/credentials/*.json
   ```

### Variables d'environnement

Créer un fichier `cli/.env.ga4` (ne PAS commiter) :

```env
GA4_PROPERTY_ID=123456789
GA4_CREDENTIALS_PATH=credentials/ga4-service-account.json
```

Ou utiliser des variables d'environnement système :

```bash
export GA4_PROPERTY_ID=123456789
export GA4_CREDENTIALS_PATH=/path/to/ga4-service-account.json
```

---

## ✅ Étape 8 : Tester l'API

```bash
cd cli
python main.py analytics realtime --test
```

---

## 📊 Utilisation

Une fois configuré :

```bash
# Voir les utilisateurs actifs en temps réel
python main.py analytics realtime

# Voir avec plus de détails
python main.py analytics realtime --detailed

# Exporter en JSON
python main.py analytics realtime --json

# Monitoring continu (refresh toutes les 30 secondes)
python main.py analytics realtime --watch
```

---

## 🐛 Dépannage

### Erreur : "Permission denied"

- Vérifier que le Service Account a bien accès à la propriété GA4
- Vérifier que l'API est bien activée

### Erreur : "Invalid credentials"

- Vérifier le chemin vers le fichier JSON
- Vérifier que le fichier JSON est valide

### Erreur : "Property not found"

- Vérifier le Property ID (format numérique, pas le Measurement ID G-XXX)

---

## 🔗 Ressources

- [Documentation API GA4](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Bibliothèque Python](https://googleapis.dev/python/analytics-data/latest/)
