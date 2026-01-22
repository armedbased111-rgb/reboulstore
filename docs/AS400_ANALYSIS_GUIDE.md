# 🔍 Guide d'Analyse AS400 - Notes en Magasin

**Date** : 13/01/2026  
**Lieu** : Magasin Reboul  
**Objectif** : Documenter la structure complète de l'AS400 pour l'intégration

---

## 📋 Checklist d'Analyse

### 1. Accès & Connexion AS400

- [x] **Système accessible depuis l'extérieur ?** (VPN, accès distant)
  - **Réponse** : Oui, via ordinateurs du magasin (chaque shop a un ordinateur connecté à l'AS400)
  - **IP** : 192.168.110.200
  - **PORT** : 23
  - **Comment se connecter** : Ordinateur du magasin connecté à l'AS400

- [ ] **Personne responsable / Contact technique**
  - **Nom** : ??_________________________________
  - **Contact** : ________??_________________________

- [x] **Méthode d'extraction des données**
  - [x] Export CSV (comment ?) : ❌ Pas d'export CSV direct visible dans l'interface. Menu "Transfert" contient seulement "Envoi d'un fichier au système hôte" / "Réception" (transfert fichiers, pas export données)
  - [ ] Connexion directe (ODBC/JDBC) : ⚠️ À vérifier avec responsable technique (port 23 = Telnet, pas DB. Port ODBC/JDBC généralement 8470/8471)
  - [ ] Export SQL/Dump : ⚠️ À vérifier avec responsable technique
  - [ ] API (si disponible) : ⚠️ À vérifier avec responsable technique
  - **Méthode recommandée** : ⚠️ **À DÉTERMINER** - Nécessite intervention responsable technique
  - **Questions à poser au responsable** :
    - Comment exporter les données produits/stocks en CSV/Excel ?
    - Y a-t-il un export disponible depuis l'interface AS400 ?
    - Connexion ODBC/JDBC possible ? Quel port ? (port 23 = Telnet uniquement)
    - Y a-t-il un accès direct à la base de données pour extraction ?

---

### 2. Structure Tables - Liste Complète

**Noter toutes les tables disponibles dans l'AS400 :**

| Nom Table | Description | Utilisée pour ? |
|-----------|-------------|-----------------|
| | | |
| | | |
| | | |
| | | |

---

### 3. Table PRODUITS (ou équivalent)

**Nom exact de la table** : À identifier (accessible via menu "Recherche article" - Option 22)

**Menu d'accès** : Menu principal → Option 22 "Recherche article"

**Champs disponibles (colonnes visibles dans la liste)** :

| Nom Champ | Type Données | Description | Exemple Valeur | Mapping vers notre DB |
|-----------|--------------|-------------|----------------|----------------------|
| Code | Numérique | Identifiant unique produit | 110900076, 110900078 | id ou sku ? |
| Marque | Texte | Nom de la marque | "CHAU chau nike" | brand.name |
| Référence | Texte | Nom produit + taille | "JORDAN/DARKMOC 41", "JORDAN/DARKMOC 42" | name + variant size |
| DPT | Numérique | Département | "1" | category.department ? |
| Act | Caractère | (À comprendre) | (vide ou caractère) | ? |
| Genr | Caractère | (À comprendre) | (vide) | ? |
| HRE, HCP, HCS, SAN, BIR | Caractères | (À comprendre - colonnes vides) | (vides) | ? |

**Notes** :
- F1 = Affiche articles épuisés
- F4 = Ne fait rien
- F3 = Fin (retour menu précédent)
- Navigation : Défil Haut/Bas pour scroller

**Questions importantes** :
- [x] Comment identifier un produit unique ? (SKU, code produit, ID ?)
  - **Réponse** : Champ "Code" semble être l'identifiant unique (ex: 110900076, 110900078)

- [x] Comment sont stockés les noms/descriptions ?
  - **Réponse** : Champ "Référence" contient nom produit + taille (ex: "JORDAN/DARKMOC 41", "JORDAN/DUTCH 42")
  - **Note** : La référence semble inclure la taille directement dans le nom (ex: "... 41", "... 42")

- [ ] Y a-t-il un champ pour les prix ?
  - **Réponse** : ❌ Pas visible dans la liste. Impossible d'accéder aux détails complets d'un article depuis l'interface

- [ ] Y a-t-il des champs qu'on n'utilisera pas ?
  - **Liste** : HRE, HCP, HCS, SAN, BIR, Act, Genr (colonnes vides ou avec caractères - utilité inconnue)
  - **À comprendre** : DPT (département = "1"), Type/Activité/Genre (filtres de recherche)

**Informations supplémentaires observées (en-tête de l'écran)** :
- **Type** : 1 article resell
- **Activité** : 109 CHAUSSURES RESELL
- **Genre** : CHR chaussures resell
- **Marque** : * (toutes)
- **Taille** : FRA * (tailles françaises)

**Raccourcis clavier testés** :
- F1 = Affiche articles épuisés
- F2 = "Dispo F2->Stks" (stocks ? - non testé)
- F3 = Fin (retour menu précédent)
- F4 = Liste (ne fait rien)
- "A" pour affichage = Ne fonctionne pas

---

### 4. Table STOCKS / VARIANTS

**Nom exact de la table** : _________________________________

**Structure** :
- [ ] Les variants (taille/couleur) sont dans la même table que les produits ?
- [ ] Les variants sont dans une table séparée ?
- [ ] Comment sont liés produits et variants ? (clé étrangère ?)

**Champs disponibles** :

| Nom Champ | Type Données | Description | Exemple Valeur | Mapping vers notre DB |
|-----------|--------------|-------------|----------------|----------------------|
| | | | | |

**Questions importantes** :
- [ ] Comment identifier un variant unique ? (SKU unique par variant ?)
  - **Réponse** : _________________________________

- [ ] Comment sont stockées les tailles ? (table séparée, champ texte, codes ?)
  - **Réponse** : _________________________________

- [ ] Comment sont stockées les couleurs ? (table séparée, champ texte, codes ?)
  - **Réponse** : _________________________________

- [ ] Comment sont stockés les stocks ? (quantité par variant ?)
  - **Réponse** : _________________________________

---

### 5. Table MARQUES (ou équivalent)

**Nom exact de la table** : _________________________________

**Champs disponibles** :

| Nom Champ | Type Données | Description | Exemple Valeur | Mapping vers notre DB |
|-----------|--------------|-------------|----------------|----------------------|
| | | | | |

**Questions** :
- [ ] Comment sont liées les marques aux produits ? (clé étrangère dans table produits ?)
  - **Réponse** : _________________________________

- [ ] Y a-t-il toutes les marques dans cette table ?
  - **Réponse** : _________________________________

---

### 6. Table CATEGORIES (ou équivalent)

**Nom exact de la table** : _________________________________

**Champs disponibles** :

| Nom Champ | Type Données | Description | Exemple Valeur | Mapping vers notre DB |
|-----------|--------------|-------------|----------------|----------------------|
| | | | | |

**Questions** :
- [ ] Comment sont liées les catégories aux produits ? (clé étrangère dans table produits ?)
  - **Réponse** : _________________________________

- [ ] Y a-t-il une hiérarchie de catégories ? (parent/enfant ?)
  - **Réponse** : _________________________________

---

### 7. Relations entre Tables

**Dessiner/schématiser les relations** :

```
Table PRODUITS
  └── Relation vers MARQUES : _______________ (champ : _______________)
  └── Relation vers CATEGORIES : _______________ (champ : _______________)
  └── Relation vers VARIANTS/STOCKS : _______________ (champ : _______________)
```

---

### 8. Export CSV - Test

**Si export CSV disponible, tester un export** :

- [ ] Nombre de lignes exportées : _______________
- [ ] Format CSV : (séparateur, encodage, etc.) : _______________
- [ ] Exemple de ligne exportée : _______________

**Fichier exporté** : (nom, taille, date) : _______________

---

### 9. Données Manquantes / À Compléter

**Champs dans notre DB qui ne sont PAS dans l'AS400** :

- [ ] Descriptions détaillées : Oui / Non
- [ ] Matériaux : Oui / Non
- [ ] Instructions d'entretien : Oui / Non
- [ ] Pays de fabrication : Oui / Non
- [ ] Autres : _________________________________

**Comment les compléter** : _________________________________

---

### 10. Cas Spéciaux / Points d'Attention

**Variants complexes** :
- [ ] Comment gérer les produits avec plusieurs couleurs ? : _______________
- [ ] Comment gérer les produits avec plusieurs types de tailles ? : _______________
- [ ] Y a-t-il des marques qui taillent différemment ? : _______________

**Stocks** :
- [ ] Fréquence de mise à jour des stocks : _______________
- [ ] Comment identifier une rupture de stock ? (stock = 0 ?) : _______________
- [ ] Y a-t-il des stocks négatifs possibles ? : _______________

**Produits** :
- [ ] Y a-t-il des produits à exclure de l'import ? (anciens, soldes, etc.) : _______________
- [ ] Comment identifier une collection ? (champ saison, collection, etc. ?) : _______________

---

### 11. Exemples de Données

**Copier quelques exemples de données réelles** (masquer données sensibles si nécessaire) :

**Exemple PRODUIT** :
```
Champ1 : Valeur1
Champ2 : Valeur2
...
```

**Exemple VARIANT/STOCK** :
```
Champ1 : Valeur1
Champ2 : Valeur2
...
```

---

### 12. Capture d'Écran / Documentation Visuelle

**Prendre des captures d'écran si possible** :
- [ ] Structure des tables
- [ ] Exemples de données
- [ ] Interface d'export CSV
- [ ] Autres écrans utiles

**Emplacement des captures** : _________________________________

---

### 13. Notes Additionnelles

**Résumé de l'exploration** :

- ✅ **Interface AS400 explorée** : Menu principal → Option 22 "Recherche article"
- ✅ **Structure colonnes produits identifiée** : Code, Marque, Référence, DPT, Act, Genr, HRE, HCP, HCS, SAN, BIR
- ✅ **IP/Port notés** : 192.168.110.200:23 (Telnet)
- ❌ **Export CSV direct** : Non disponible dans l'interface visible
- ❌ **Détails complets article** : Non accessibles directement (tentatives échouées)
- ⚠️ **Nécessite intervention responsable** : Pour export/connexion base de données

**Limites de l'exploration** :
- Interface AS400 limitée pour exploration manuelle
- Pas d'accès direct aux détails complets des articles
- Pas d'export CSV visible dans l'interface
- Nécessite méthode d'extraction (CSV export, ODBC/JDBC, ou autre)

**Prochaines étapes** :
1. Contacter responsable technique pour méthode d'extraction
2. Explorer connexion ODBC/JDBC (si possible)
3. Demander export CSV/Excel des données
4. Compléter documentation une fois méthode d'extraction déterminée

---

## ✅ Checklist Finale

Avant de quitter le magasin, vérifier que tu as :

- [ ] Liste complète des tables
- [ ] Structure détaillée table PRODUITS
- [ ] Structure détaillée table STOCKS/VARIANTS
- [ ] Structure détaillée table MARQUES
- [ ] Structure détaillée table CATEGORIES
- [ ] Relations entre tables documentées
- [ ] Méthode d'extraction testée (si possible)
- [ ] Exemples de données réelles
- [ ] Cas spéciaux identifiés
- [ ] Questions restantes notées

---

**Après l'analyse** : On créera `docs/AS400_INTEGRATION.md` avec toutes ces informations structurées.
