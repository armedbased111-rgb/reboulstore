# Synchronisation AS400 → PostgreSQL (Temps Réel)

**Date de création** : 2026-01-05  
**Phase** : 20.1 - N8N Workflows  
**Objectif** : Synchronisation temps réel des produits AS400 vers PostgreSQL  
**Statut** : En réflexion

---

## 🎯 Objectif

Synchroniser la base de données AS400 (système de gestion stock/comptabilité) avec notre base PostgreSQL en **temps réel**.

**Cas d'usage** :
- Quand un produit est modifié dans AS400 → Mise à jour automatique dans PostgreSQL
- Quand le stock change dans AS400 → Mise à jour automatique dans PostgreSQL
- Quand un nouveau produit est créé dans AS400 → Création automatique dans PostgreSQL

---

## 🔍 Compréhension AS400

### Qu'est-ce qu'AS400 (IBM iSeries) ?

- **Système IBM legacy** : Système de gestion d'entreprise (ERP) très utilisé dans le commerce
- **Base de données** : DB2 for i (intégré au système)
- **Accès** : 
  - ODBC/JDBC (connexion SQL classique)
  - API REST (si configuré)
  - Webhooks (si configuré)
  - Fichiers (exports CSV/XML)

### Questions à clarifier

- [ ] **Type d'accès disponible** : 
  - AS400 expose-t-il une API REST ?
  - Peut-on accéder directement à la base DB2 ?
  - Y a-t-il des webhooks disponibles ?
  - Faut-il passer par des exports de fichiers ?

- [ ] **Structure des données AS400** :
  - Quelles tables contiennent les produits ?
  - Quels champs sont disponibles ? (référence, nom, prix, stock, etc.)
  - Y a-t-il un champ "date de modification" ou "timestamp" ?
  - Comment identifier un produit unique ? (clé primaire)

- [ ] **Fréquence des modifications** :
  - Combien de modifications par jour/heure ?
  - Y a-t-il des pics d'activité ?
  - Les modifications sont-elles groupées ou dispersées ?

- [ ] **Sécurité et accès** :
  - Quels sont les credentials d'accès ?
  - Y a-t-il des restrictions réseau (firewall, VPN) ?
  - Faut-il une autorisation spéciale pour accéder à AS400 ?

---

## 🚀 Approches possibles pour synchronisation temps réel

### Option 1 : Polling (Vérification périodique)

**Principe** : N8N vérifie régulièrement (toutes les X minutes) s'il y a des changements dans AS400.

**Avantages** :
- ✅ Simple à mettre en place
- ✅ Fonctionne même si AS400 n'a pas d'API temps réel
- ✅ Pas besoin de modifier AS400

**Inconvénients** :
- ❌ Pas vraiment "temps réel" (délai de X minutes)
- ❌ Charge sur AS400 (requêtes répétées)
- ❌ Peut manquer des modifications si polling trop espacé

**Implémentation** :
- N8N workflow avec trigger "Schedule" (cron : toutes les 5 minutes)
- Requête SQL AS400 : `SELECT * FROM PRODUITS WHERE updated_at > :last_check`
- Comparer avec PostgreSQL et mettre à jour les différences

**Délai réel** : 5-15 minutes (selon fréquence polling)

---

### Option 2 : Webhooks AS400 (si disponible)

**Principe** : AS400 envoie un webhook à N8N à chaque modification.

**Avantages** :
- ✅ Vraiment temps réel (< 1 seconde)
- ✅ Pas de charge inutile (seulement quand changement)
- ✅ Efficace et performant

**Inconvénients** :
- ❌ Nécessite que AS400 supporte les webhooks
- ❌ Peut nécessiter configuration/modification AS400
- ❌ Plus complexe à mettre en place

**Implémentation** :
- Configurer webhook dans AS400 (si possible)
- N8N reçoit webhook avec données produit modifié
- Mise à jour PostgreSQL immédiate

**Délai réel** : < 1 seconde (vraiment temps réel)

---

### Option 3 : Change Data Capture (CDC) - Avancé

**Principe** : Surveiller les journaux de transaction AS400 (logs de modifications).

**Avantages** :
- ✅ Vraiment temps réel
- ✅ Capture toutes les modifications (même manuelles)
- ✅ Pas de charge sur AS400 (lecture logs)

**Inconvénients** :
- ❌ Très complexe à mettre en place
- ❌ Nécessite accès aux logs système AS400
- ❌ Peut nécessiter outils spécialisés (IBM CDC, etc.)

**Implémentation** :
- Utiliser outil CDC (IBM InfoSphere, Debezium, etc.)
- Surveiller journaux de transaction AS400
- Déclencher webhook vers N8N à chaque modification

**Délai réel** : < 1 seconde (vraiment temps réel)

---

### Option 4 : Hybrid (Polling + Webhooks)

**Principe** : Combiner polling régulier + webhooks si disponibles.

**Avantages** :
- ✅ Redondance (si webhook échoue, polling rattrape)
- ✅ Flexibilité (fonctionne même si webhook indisponible)
- ✅ Sécurité (double vérification)

**Inconvénients** :
- ❌ Plus complexe à maintenir
- ❌ Peut créer des doublons (nécessite déduplication)

**Implémentation** :
- Webhook pour modifications immédiates
- Polling quotidien pour vérification complète
- Système de déduplication (éviter doublons)

**Délai réel** : < 1 seconde (webhook) + vérification quotidienne (polling)

---

## 📋 Mapping des données AS400 → PostgreSQL

### Champs à mapper

**AS400 (exemple)** → **PostgreSQL (notre modèle)** :

- [ ] **Référence produit** : `REF_PRODUIT` → `Product.reference`
- [ ] **Nom produit** : `LIBELLE` → `Product.name`
- [ ] **Prix** : `PRIX_VENTE` → `Product.price`
- [ ] **Stock total** : `STOCK_DISPONIBLE` → Calculer `Variant.stock` (par taille/couleur)
- [ ] **Catégorie** : `CATEGORIE` → `Product.categoryId` (mapping nécessaire)
- [ ] **Marque** : `MARQUE` → `Product.brandId` (mapping nécessaire)
- [ ] **Description** : `DESCRIPTION` → `Product.description`
- [ ] **Date modification** : `DATE_MODIF` → Utilisé pour détecter changements

### Questions de mapping

- [ ] **Variants (tailles/couleurs)** :
  - Comment AS400 stocke-t-il les variants ?
  - Une table séparée ? Un champ JSON ? Plusieurs lignes ?
  - Comment mapper vers notre modèle `Variant` ?

- [ ] **Images** :
  - AS400 stocke-t-il les images ?
  - Où sont les images ? (chemin fichier, URL, base64)
  - Comment les synchroniser vers Cloudinary ?

- [ ] **Catégories et marques** :
  - Comment mapper les catégories AS400 vers nos catégories ?
  - Table de mapping nécessaire ?
  - Création automatique si catégorie inconnue ?

- [ ] **Champs manquants** :
  - Quels champs avons-nous dans PostgreSQL mais pas dans AS400 ?
  - Comment les gérer ? (valeurs par défaut, null, etc.)

---

## 🔧 Architecture technique proposée

### Schéma de synchronisation

```
AS400 (Source)
    ↓
    [Trigger: Modification produit]
    ↓
N8N Workflow
    ├─→ Récupérer données AS400
    ├─→ Valider données
    ├─→ Mapper AS400 → PostgreSQL
    ├─→ Vérifier si produit existe (par référence)
    ├─→ Créer ou mettre à jour dans PostgreSQL
    ├─→ Gérer variants (tailles/couleurs)
    ├─→ Synchroniser images (si applicable)
    └─→ Logger résultat
    ↓
PostgreSQL (Destination)
```

### Workflow N8N détaillé

**Étape 1 : Déclencheur**
- Webhook (si disponible) OU Schedule (polling toutes les 5 min)

**Étape 2 : Récupération données**
- Requête AS400 : `SELECT * FROM PRODUITS WHERE updated_at > :last_sync`
- OU réception webhook avec données produit

**Étape 3 : Validation**
- Vérifier que les données sont complètes
- Valider format (prix, stock, etc.)

**Étape 4 : Mapping**
- Convertir structure AS400 → structure PostgreSQL
- Appliquer règles de mapping (catégories, marques)

**Étape 5 : Vérification existence**
- Requête PostgreSQL : `SELECT * FROM products WHERE reference = :ref`
- Si existe → UPDATE, sinon → CREATE

**Étape 6 : Mise à jour PostgreSQL**
- Appel API backend : `POST /products/sync` ou `PATCH /products/:id`
- OU accès direct PostgreSQL (si N8N a accès)

**Étape 7 : Gestion variants**
- Parser variants depuis AS400
- Créer/mettre à jour variants dans PostgreSQL

**Étape 8 : Images (si applicable)**
- Télécharger images depuis AS400
- Upload vers Cloudinary
- Mettre à jour `Product.images`

**Étape 9 : Logging**
- Logger succès/échec
- Notifier admin en cas d'erreur

---

## ⚠️ Défis et solutions

### Défi 1 : Accès AS400

**Problème** : Comment accéder à AS400 depuis N8N ?

**Solutions possibles** :
- ✅ **ODBC/JDBC** : N8N peut se connecter via ODBC (nécessite driver)
- ✅ **API REST** : Si AS400 expose une API (idéal)
- ✅ **Fichiers** : Export CSV/XML depuis AS400, N8N lit le fichier
- ✅ **SSH Tunnel** : Si AS400 est sur réseau privé

### Défi 2 : Performance

**Problème** : Synchronisation de milliers de produits peut être lent.

**Solutions** :
- ✅ **Synchronisation incrémentale** : Seulement les produits modifiés
- ✅ **Batch processing** : Traiter par lots (100 produits à la fois)
- ✅ **Parallélisation** : Plusieurs workflows en parallèle
- ✅ **Cache** : Mettre en cache les mappings (catégories, marques)

### Défi 3 : Conflits de données

**Problème** : Que faire si produit modifié dans AS400 ET dans notre site ?

**Solutions** :
- ✅ **AS400 = Source de vérité** : Toujours écraser avec données AS400
- ✅ **Champ "last_modified_by"** : Identifier qui a modifié en dernier
- ✅ **Règles de priorité** : AS400 > Admin > Client

### Défi 4 : Gestion des erreurs

**Problème** : Que faire si synchronisation échoue ?

**Solutions** :
- ✅ **Retry automatique** : N8N peut retry en cas d'échec
- ✅ **Queue d'erreurs** : Stocker les échecs pour traitement manuel
- ✅ **Alertes** : Notifier admin en cas d'erreur répétée
- ✅ **Logs détaillés** : Logger toutes les tentatives

---

## 📊 Métriques et monitoring

### À suivre

- [ ] **Temps de synchronisation** : Combien de temps pour sync un produit ?
- [ ] **Taux de succès** : % de synchronisations réussies
- [ ] **Délai réel** : Temps entre modification AS400 et mise à jour PostgreSQL
- [ ] **Erreurs** : Nombre et types d'erreurs
- [ ] **Volume** : Nombre de produits synchronisés par jour

### Dashboard N8N

- Historique des exécutions
- Statistiques de succès/échec
- Temps d'exécution moyen
- Alertes en cas de problème

---

## 🎯 Plan d'action proposé

### Phase 1 : Exploration (À faire maintenant)

1. **Comprendre AS400** :
   - [ ] Récupérer documentation AS400
   - [ ] Identifier tables produits
   - [ ] Tester connexion (ODBC, API, etc.)
   - [ ] Examiner structure données

2. **Prototype simple** :
   - [ ] Créer workflow N8N basique
   - [ ] Tester récupération 1 produit depuis AS400
   - [ ] Tester création dans PostgreSQL
   - [ ] Valider mapping des champs

### Phase 2 : Synchronisation basique

1. **Polling simple** :
   - [ ] Workflow N8N avec trigger Schedule (toutes les 15 min)
   - [ ] Récupérer produits modifiés depuis AS400
   - [ ] Synchroniser vers PostgreSQL
   - [ ] Logger résultats

2. **Tests** :
   - [ ] Tester avec quelques produits
   - [ ] Vérifier que données sont correctes
   - [ ] Mesurer performance

### Phase 3 : Optimisation temps réel

1. **Webhooks (si possible)** :
   - [ ] Configurer webhooks AS400
   - [ ] Workflow N8N avec trigger Webhook
   - [ ] Synchronisation immédiate

2. **Hybrid** :
   - [ ] Combiner webhooks + polling
   - [ ] Système de déduplication
   - [ ] Monitoring et alertes

### Phase 4 : Production

1. **Mise en production** :
   - [ ] Déployer N8N sur serveur
   - [ ] Configurer accès AS400
   - [ ] Activer synchronisation
   - [ ] Monitoring continu

2. **Documentation** :
   - [ ] Documenter workflow N8N
   - [ ] Documenter mapping AS400 → PostgreSQL
   - [ ] Guide de troubleshooting

---

## ❓ Questions à résoudre

### Questions techniques

1. **Accès AS400** :
   - Comment accéder à AS400 ? (ODBC, API, fichiers)
   - Quels sont les credentials ?
   - Y a-t-il des restrictions réseau ?

2. **Structure données** :
   - Quelles tables contiennent les produits ?
   - Comment sont stockés les variants (tailles/couleurs) ?
   - Y a-t-il un champ "date de modification" ?

3. **Fréquence** :
   - Combien de modifications par jour ?
   - Y a-t-il des pics d'activité ?

4. **Webhooks** :
   - AS400 peut-il envoyer des webhooks ?
   - Faut-il configurer quelque chose dans AS400 ?

### Questions métier

1. **Source de vérité** :
   - AS400 est-il toujours la source de vérité ?
   - Que faire si produit modifié dans les deux systèmes ?

2. **Mapping** :
   - Comment mapper catégories AS400 → nos catégories ?
   - Comment mapper marques AS400 → nos marques ?
   - Création automatique si catégorie/marque inconnue ?

3. **Images** :
   - Où sont stockées les images dans AS400 ?
   - Comment les synchroniser vers Cloudinary ?

---

## 📝 Notes

- **Objectif** : Synchronisation temps réel AS400 → PostgreSQL
- **Priorité** : Très haute (si réalisable, ce serait un énorme gain)
- **Complexité** : Moyenne à élevée (dépend de l'accès AS400)
- **Temps estimé** : 2-4 semaines (exploration + développement + tests)

---

## 🔄 Historique des modifications

- **2026-01-05** : Création du document - Réflexion initiale sur synchronisation temps réel

