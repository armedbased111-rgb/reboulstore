# Vérifier GA4 depuis le CLI

## 🎯 Méthodes disponibles

### Méthode 1 : Vérifier la configuration (CLI)

Vérifier que GA4 est bien configuré :

```bash
cd cli
python main.py analytics status
```

Affiche :
- ✅ Variables d'environnement configurées
- ✅ Statut pour Reboul Store et Admin Central

---

### Méthode 2 : Vérifier que le code est présent (CLI)

Vérifier que le code GA4 est bien présent dans la page HTML :

```bash
cd cli
python main.py analytics verify
```

Ou pour une URL spécifique :

```bash
python main.py analytics verify --url https://www.reboulstore.com
```

Affiche :
- ✅ Code GA4 détecté
- ✅ Measurement ID trouvé
- ✅ Scripts GA4 présents

---

### Méthode 3 : GA4 Realtime (Interface web - RECOMMANDÉ)

Pour du **vrai realtime**, utilise l'interface web GA4 :

1. Aller sur https://analytics.google.com
2. Reports > Realtime
3. Voir les visiteurs en temps réel (délai max 30 secondes)

**Pourquoi pas depuis le CLI ?**

Les requêtes GA4 sont envoyées **depuis le navigateur** vers Google, pas depuis le serveur. Pour accéder aux données realtime depuis le CLI, il faudrait :

1. Configurer l'API GA4 Realtime API (complexe)
2. Créer des credentials OAuth2
3. Utiliser la bibliothèque `google-analytics-data`

C'est possible mais plus complexe que d'utiliser l'interface web.

---

## 🔧 Configuration API GA4 (Avancé - Optionnel)

Si tu veux vraiment accéder aux données GA4 depuis le CLI/Grafana, voici les étapes :

### 1. Activer l'API Google Analytics Data API

1. Aller sur https://console.cloud.google.com
2. Créer un projet ou sélectionner un projet existant
3. Activer l'API "Google Analytics Data API"
4. Créer des credentials (Service Account ou OAuth2)

### 2. Installer la bibliothèque Python

```bash
pip install google-analytics-data
```

### 3. Utiliser l'API

```python
from google.analytics.data import BetaAnalyticsDataClient
from google.analytics.data_v1beta.types import RunRealtimeReportRequest

client = BetaAnalyticsDataClient(credentials=...)
request = RunRealtimeReportRequest(
    property=f"properties/{PROPERTY_ID}",
    metrics=[{"name": "activeUsers"}],
)
response = client.run_realtime_report(request)
```

**Note** : Configuration assez complexe, nécessite OAuth2/Service Account.

---

## ✅ Recommandation

Pour vérifier rapidement que GA4 fonctionne :

1. **CLI** : `python cli/main.py analytics status` (vérifie la config)
2. **CLI** : `python cli/main.py analytics verify` (vérifie le code dans la page)
3. **Web** : https://analytics.google.com > Realtime (voir les visiteurs)

Pour du **monitoring continu**, utilise l'interface GA4 ou configure l'API (avancé).
