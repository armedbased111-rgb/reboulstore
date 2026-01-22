# as400-integration

**Commande** : `/as400-integration`

Guide d'intégration AS400 pour Reboul Store (⚠️ EN SUSPENS).

## ⚠️ Statut Actuel

**AS400 Intégration** : **EN SUSPENS** - Trop de temps nécessaire

**Approche alternative adoptée** : Import manuel via tables/CSV (voir `/collection-workflow`)

## 📋 Exploration Effectuée

**Document d'analyse** : `docs/AS400_ANALYSIS_GUIDE.md`

### Informations Collectées

**Accès & Connexion** :
- IP : 192.168.110.200
- Port : 23 (Telnet)
- Accès : Ordinateurs du magasin connectés à l'AS400
- Menu Transfert : Envoi/réception fichiers (pas d'export CSV direct visible)

**Structure Identifiée** :
- Menu principal → Option 22 "Recherche article"
- Colonnes visibles : Code, Marque, Référence, DPT, Act, Genr, HRE, HCP, HCS, SAN, BIR
- Code : Identifiant unique produit (ex: 110900076)
- Marque : Nom marque (ex: "CHAU chau nike")
- Référence : Nom produit + taille (ex: "JORDAN/DARKMOC 41")
- DPT : Département (ex: "1")

**Limites Identifiées** :
- Pas d'accès direct aux détails complets d'un article
- Pas d'export CSV direct visible dans l'interface
- Nécessite méthode d'extraction (CSV export, ODBC/JDBC, ou autre)

## 🔄 Si Reprise Future

### Questions à Résoudre

1. **Méthode d'extraction** :
   - Comment exporter les données produits/stocks en CSV/Excel ?
   - Connexion ODBC/JDBC possible ? Quel port ? (port 23 = Telnet uniquement)
   - Y a-t-il un accès direct à la base de données pour extraction ?

2. **Structure complète** :
   - Tables disponibles (produits, stocks, marques, catégories)
   - Champs détaillés (prix, descriptions, etc.)
   - Relations entre tables

3. **Mapping AS400 → DB** :
   - Table produits AS400 → entité Product
   - Table stocks AS400 → entité Variant
   - Table marques AS400 → entité Brand
   - Table catégories AS400 → entité Category

### Processus Si Reprise

1. **Analyser structure complète** :
   - Documenter toutes les tables AS400
   - Documenter tous les champs disponibles
   - Identifier relations entre tables

2. **Méthode d'extraction** :
   - Tester export CSV (si disponible)
   - Tester connexion ODBC/JDBC (si possible)
   - Créer script d'extraction

3. **Transformation données** :
   - Créer script transformation AS400 → notre structure
   - Mapping champs AS400 → DB
   - Validation et nettoyage données

4. **Import données** :
   - Script import données transformées
   - Gérer création produits/variants
   - Assigner collection active
   - Gérer association marques/catégories

## 📚 Références

- **Guide d'analyse** : `docs/AS400_ANALYSIS_GUIDE.md`
- **Workflow collection** : `/collection-workflow` (approche actuelle)
- **Phase 24** : `docs/context/ROADMAP_COMPLETE.md` (Section 24.5)

## 💡 Recommandation

Pour l'instant, utiliser l'approche manuelle via tables/CSV (voir `/collection-workflow`). L'intégration AS400 peut être reprise plus tard si nécessaire et si le temps le permet.
