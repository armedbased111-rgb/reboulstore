# Configuration GA4 CLI - Étapes détaillées

## ✅ Property ID configuré
**Property ID** : `517129434`

---

## 📋 Checklist de configuration

### Étape 1 : Créer le projet Google Cloud ✅

1. Aller sur : https://console.cloud.google.com
2. Cliquer sur **"Select a project"** (en haut à gauche)
3. Cliquer **"New Project"**
4. **Nom du projet** : `reboulstore-analytics`
5. Cliquer **"Create"**
6. Attendre 1-2 minutes que le projet soit créé

### Étape 2 : Activer l'API ✅

1. Une fois le projet créé, aller dans **"APIs & Services"** > **"Library"**
2. Dans la barre de recherche, taper : `Google Analytics Data API`
3. Cliquer sur **"Google Analytics Data API"**
4. Cliquer sur le bouton **"Enable"** (Activer)
5. Attendre quelques secondes que l'API soit activée

### Étape 3 : Créer un Service Account ✅

1. Aller dans **"APIs & Services"** > **"Credentials"**
2. Cliquer sur **"Create Credentials"** (en haut)
3. Sélectionner **"Service Account"**
4. Remplir :
   - **Service account name** : `ga4-cli-access`
   - **Service account ID** : (se remplit automatiquement)
   - **Description** : `Accès CLI pour GA4 Realtime`
5. Cliquer **"Create and Continue"**
6. **Skip** l'étape "Grant this service account access to project" (laisser vide)
7. Cliquer **"Done"**

### Étape 4 : Créer la clé JSON ✅

1. Tu devrais être sur la page des Service Accounts
2. Cliquer sur le Service Account que tu viens de créer : `ga4-cli-access@[PROJECT-ID].iam.gserviceaccount.com`
3. Aller dans l'onglet **"Keys"**
4. Cliquer **"Add Key"** > **"Create new key"**
5. Sélectionner **"JSON"**
6. Cliquer **"Create"**
7. **Le fichier JSON se télécharge automatiquement** (garde-le en sécurité !)

### Étape 5 : Donner accès dans GA4 ✅

1. **Noter l'email du Service Account** : Il est de la forme `ga4-cli-access@[PROJECT-ID].iam.gserviceaccount.com`
   - Tu peux le trouver dans la page du Service Account (onglet "Details")
   - Ou dans le nom du fichier JSON téléchargé

2. Aller sur : https://analytics.google.com
3. Sélectionner la propriété **"Reboul Store"**
4. Aller dans **"Admin"** (⚙️ en bas à gauche)
5. Dans la colonne **"Property"**, cliquer sur **"Property Access Management"**
6. Cliquer sur le bouton **"+"** (en haut à droite)
7. Cliquer **"Add users"**
8. Dans **"Email addresses"**, coller l'email du Service Account
9. Sélectionner le rôle : **"Viewer"**
10. Cliquer **"Add"**

---

## 💻 Configuration locale

Une fois toutes les étapes ci-dessus terminées, dis-moi et je t'aiderai à configurer localement !
