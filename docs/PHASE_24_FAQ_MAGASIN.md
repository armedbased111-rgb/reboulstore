# 📋 Phase 24 - FAQ & Questions à Poser en Magasin

**Date de création** : 2025-01-XX  
**Objectif** : Lister toutes les questions à poser en magasin pour préparer l'intégration de la collection réelle

---

## 🎯 Comment utiliser ce fichier

1. **Avant d'aller en magasin** : Lire toutes les questions
2. **En magasin** : Poser les questions et noter les réponses directement dans ce fichier
3. **Après** : Revenir vers moi avec les réponses pour qu'on puisse implémenter

---

## 📦 Section 1 : AS400 - Structure & Accès

### Questions Générales AS400

- [ ] **Q1.1** : Est-ce que le système AS400 est accessible depuis l'extérieur du magasin ? (VPN, accès distant)
  - **Réponse** : À POSER EN MAGASIN (journée prévue pour tout faire ensemble)
  - **Notes** : Structure AS400 inconnue, journée prévue en magasin pour analyser tout ensemble

- [ ] **Q1.2** : Qui a accès à l'AS400 ? (personne responsable, contact technique)
  - **Réponse** : À POSER EN MAGASIN
  - **Notes** : À identifier lors de la journée en magasin

- [x] **Q1.3** : Comment extraire les données de l'AS400 ? (export CSV, connexion directe, dump SQL, API)
  - **Réponse** : CSV disponible, à décider ensemble ce qui est le plus adapté et simple
  - **Notes** : Export CSV possible, mais on doit évaluer les autres options (connexion directe, API) pour choisir la meilleure méthode

- [x] **Q1.4** : Quelle est la fréquence de mise à jour des stocks dans l'AS400 ? (temps réel, quotidien, manuel)
  - **Réponse** : Réassorts quotidiens (pas sûr à 100%, à confirmer en magasin)
  - **Notes** : Probablement quotidien, mais à vérifier en magasin pour confirmation

### Structure Données AS400

- [ ] **Q1.5** : Quelles tables contiennent les informations produits ? (nom des tables, schéma)
  - **Réponse** : À POSER EN MAGASIN (journée prévue)
  - **Notes** : Structure complète à analyser lors de la journée en magasin

- [ ] **Q1.6** : Quels champs sont disponibles pour chaque produit ? (nom, description, prix, SKU, marque, catégorie, etc.)
  - **Réponse** : À POSER EN MAGASIN (journée prévue)
  - **Notes** : Liste complète des champs à documenter lors de la journée en magasin

- [ ] **Q1.7** : Comment sont gérés les stocks par variant (taille, couleur) dans l'AS400 ?
  - **Réponse** : À POSER EN MAGASIN (journée prévue)
  - **Notes** : Structure variants/stocks à analyser en détail

- [ ] **Q1.8** : Y a-t-il un champ SKU unique par variant dans l'AS400 ?
  - **Réponse** : À POSER EN MAGASIN (journée prévue)
  - **Notes** : Identifier le système de SKU pour le mapping

- [ ] **Q1.9** : Comment sont organisées les marques dans l'AS400 ? (table séparée, champ dans produits)
  - **Réponse** : À POSER EN MAGASIN (journée prévue)
  - **Notes** : Structure marques à documenter

- [ ] **Q1.10** : Comment sont organisées les catégories dans l'AS400 ? (table séparée, champ dans produits)
  - **Réponse** : À POSER EN MAGASIN (journée prévue)
  - **Notes** : Structure catégories à documenter

- [ ] **Q1.11** : Y a-t-il des champs spécifiques qu'on utilise en magasin mais qui ne sont pas dans l'AS400 ? (matériaux, instructions d'entretien, pays de fabrication, etc.)
  - **Réponse** : À POSER EN MAGASIN (journée prévue)
  - **Notes** : Identifier les champs manquants à compléter manuellement

---

## 🏷️ Section 2 : Marques & Logos

- [x] **Q2.1** : Combien de marques différentes avons-nous dans la collection enfants ?
  - **Réponse** : Au moins 36 marques (enfants + adultes compris)
  - **Notes** : Collection complète (pas seulement enfants)

- [x] **Q2.2** : Où sont stockés les logos des marques actuellement ? (fichiers locaux, dossier partagé, site web)
  - **Réponse** : Ancien git de reboul (à récupérer) OU via l'AS400
  - **Notes** : Deux sources possibles : ancien git reboul (priorité) ou AS400 en backup

- [ ] **Q2.3** : Quels formats sont disponibles pour les logos ? (PNG, JPG, SVG, AI)
  - **Réponse** : _________________________
  - **Notes** : _________________________

- [x] **Q2.4** : Y a-t-il des logos manquants qu'il faudra créer/récupérer ?
  - **Réponse** : Récupération manuelle depuis ancien git de reboul
  - **Notes** : Dossier à récupérer manuellement depuis l'ancien git

- [x] **Q2.5** : Les logos sont-ils déjà optimisés (taille, format) ou faut-il les retravailler ?
  - **Réponse** : Probablement oui (à vérifier lors de la récupération)
  - **Notes** : Format probablement OK, mais à vérifier lors de la récupération du dossier

---

## 📸 Section 3 : Images Produits

### Processus Actuel

- [x] **Q3.1** : Comment fais-tu actuellement les images produits ? (shooting, retouche, nommage)
  - **Réponse** : Shooting à Aubagne au stock, récupération matériel chez le patron, setup complet ensemble de A à Z, retouche Photoshop, nommage oui
  - **Notes** : Processus complet à faire ensemble : récupération matériel → setup → shooting → retouche Photoshop → nommage

- [x] **Q3.2** : Où sont stockées les images produits actuellement ? (dossier local, cloud, serveur)
  - **Réponse** : Cloudinary
  - **Notes** : Images produits stockées directement dans Cloudinary (déjà configuré dans l'admin)

- [x] **Q3.3** : Quelle est la convention de nommage actuelle des fichiers images ? (ex: `PRODUCT-SKU-COLOR-01.jpg`)
  - **Réponse** : À définir ensemble
  - **Notes** : Convention de nommage à établir ensemble pour faciliter l'association automatique images → produits

- [x] **Q3.4** : Combien d'images par produit en moyenne ? (minimum, maximum)
  - **Réponse** : Entre 3 et 5 images par produit (à confirmer)
  - **Notes** : Estimation entre 3 et 5, à valider lors du setup shooting

- [ ] **Q3.5** : Quels formats d'images utilises-tu ? (JPG, PNG, RAW)
  - **Réponse** : _________________________
  - **Notes** : _________________________

- [ ] **Q3.6** : Quelle résolution/taille d'images utilises-tu actuellement ?
  - **Réponse** : _________________________
  - **Notes** : _________________________

### Standards Qualité

- [ ] **Q3.7** : Y a-t-il des standards qualité spécifiques à respecter ? (fond blanc, angles de vue, éclairage)
  - **Réponse** : _________________________
  - **Notes** : _________________________

- [ ] **Q3.8** : Faut-il un watermark ou signature sur les images ?
  - **Réponse** : _________________________
  - **Notes** : _________________________

### Organisation & Workflow

- [ ] **Q3.9** : Comment organises-tu les images par produit ? (dossiers, préfixes, numérotation)
  - **Réponse** : _________________________
  - **Notes** : _________________________

- [ ] **Q3.10** : Combien de temps prend la création d'images pour un produit complet ? (shooting + retouche)
  - **Réponse** : _________________________
  - **Notes** : _________________________

- [ ] **Q3.11** : Y a-t-il des points d'amélioration/automatisation dans le processus actuel ?
  - **Réponse** : _________________________
  - **Notes** : _________________________

---

## 📊 Section 4 : Stocks & Variants

- [x] **Q4.1** : Comment sont gérés les stocks actuellement ? (manuel, automatique depuis AS400)
  - **Réponse** : Réassorts manuels tous les matins ou tous les soirs (remise en stock)
  - **Notes** : Stocks mis à jour manuellement dans l'AS400 lors des réassorts quotidiens

- [x] **Q4.2** : Quelle est la fréquence de mise à jour des stocks ? (temps réel, quotidien, hebdomadaire)
  - **Réponse** : Quotidien (réassorts manuels tous les matins ou tous les soirs)
  - **Notes** : Mise à jour quotidienne lors des réassorts manuels

- [x] **Q4.3** : Y a-t-il des produits avec des variants complexes ? (plusieurs tailles, plusieurs couleurs, combinaisons)
  - **Réponse** : Oui, large gamme de produits. Chaussures avec modèles de couleurs complexes. Plusieurs types de tailles (pantalon italien, etc.). Plusieurs marques qui taillent différemment.
  - **Notes** : ⚠️ IMPORTANT - Variants complexes : couleurs multiples, systèmes de tailles différents selon marques/catégories. Les guides de tailles sont déjà gérés par les policies de catégories (Q6.5).

- [ ] **Q4.4** : Comment gère-t-on les produits qui n'ont qu'une seule taille/couleur ? (variant unique ou pas de variant)
  - **Réponse** : _________________________
  - **Notes** : _________________________

- [ ] **Q4.5** : Y a-t-il des cas spéciaux de gestion de stock ? (précommandes, réservations, stock négatif)
  - **Réponse** : _________________________
  - **Notes** : _________________________

- [x] **Q4.6** : À partir de quel seuil considère-t-on qu'un produit est en rupture de stock ? (0, 1, 5 unités)
  - **Réponse** : Utiliser seulement le stock du site, marquer rupture quand stock = 0. Alerte réassort pour stocks entre 0 et 5 unités.
  - **Notes** : Approche simplifiée : pas de vérification multi-magasins. Rupture = stock = 0. Système d'alerte réassort pour stocks 0-5 unités (Q7.3).

---

## 🚚 Section 5 : Politiques Livraison & Retour

### Livraison

- [ ] **Q5.1** : Quels sont les frais de livraison standard ? (montant fixe, pourcentage, gratuit)
  - **Réponse** : À définir totalement avec l'équipe Reboul
  - **Notes** : Toutes les politiques livraison/retour à valider avec l'équipe en magasin

- [ ] **Q5.2** : Y a-t-il une livraison express ? Si oui, quels sont les frais ?
  - **Réponse** : À définir totalement avec l'équipe Reboul
  - **Notes** : À valider avec l'équipe

- [ ] **Q5.3** : À partir de quel montant la livraison est-elle gratuite ? (seuil)
  - **Réponse** : À définir totalement avec l'équipe Reboul
  - **Notes** : À valider avec l'équipe

- [ ] **Q5.4** : Quels sont les délais de livraison standard ? (jours ouvrés)
  - **Réponse** : À définir totalement avec l'équipe Reboul
  - **Notes** : À valider avec l'équipe

- [ ] **Q5.5** : Quels sont les délais de livraison express ? (jours ouvrés)
  - **Réponse** : À définir totalement avec l'équipe Reboul
  - **Notes** : À valider avec l'équipe

- [ ] **Q5.6** : Y a-t-il des zones de livraison spécifiques ? (France métropolitaine, DOM-TOM, international)
  - **Réponse** : À définir totalement avec l'équipe Reboul
  - **Notes** : À valider avec l'équipe

- [ ] **Q5.7** : Y a-t-il des frais de livraison différents selon les zones ?
  - **Réponse** : À définir totalement avec l'équipe Reboul
  - **Notes** : À valider avec l'équipe

### Retour

- [ ] **Q5.8** : Quel est le délai pour retourner un produit ? (jours après réception)
  - **Réponse** : À définir totalement avec l'équipe Reboul
  - **Notes** : À valider avec l'équipe

- [ ] **Q5.9** : Y a-t-il des frais de retour ? (gratuit, frais fixes, frais selon montant)
  - **Réponse** : À définir totalement avec l'équipe Reboul
  - **Notes** : À valider avec l'équipe

- [ ] **Q5.10** : Quelles sont les conditions de retour ? (produit non porté, étiquettes, emballage d'origine)
  - **Réponse** : À définir totalement avec l'équipe Reboul
  - **Notes** : À valider avec l'équipe

- [ ] **Q5.11** : Y a-t-il des produits non retournables ? (sous-vêtements, produits personnalisés, etc.)
  - **Réponse** : À définir totalement avec l'équipe Reboul
  - **Notes** : À valider avec l'équipe

---

## 📦 Section 6 : Collection Enfants - Données Réelles

- [ ] **Q6.1** : Combien de produits environ dans la collection enfants actuelle ?
  - **Réponse** : À vérifier en magasin
  - **Notes** : Nombre de produits à compter/identifier lors de la journée en magasin

- [x] **Q6.2** : Tous les produits sont-ils déjà dans l'AS400 ou y en a-t-il qui ne sont pas encore référencés ?
  - **Réponse** : Possible qu'il y en ait qui ne soient pas encore référencés, il faudra s'adapter. Tout au long de la saison, ils ajoutent de nouvelles références un peu toutes les semaines.
  - **Notes** : ⚠️ IMPORTANT - Processus d'ajout continu de nouvelles références chaque semaine. Il faut prévoir un workflow pour intégrer les nouveaux produits au fur et à mesure (pas seulement import initial).

- [x] **Q6.3** : Y a-t-il des produits qu'on ne veut pas mettre en ligne ? (anciens, soldes, etc.)
  - **Réponse** : Pour la première sortie : seulement la nouvelle collection. À chaque nouvelle collection, l'ancienne passe en "archivée" et la nouvelle prend sa place.
  - **Notes** : ⚠️ IMPORTANT - Système de rotation des collections : collection active vs collection archivée. Il faut prévoir un système d'archivage et de gestion des collections (activer/désactiver collection).

- [x] **Q6.4** : Y a-t-il des informations produits manquantes dans l'AS400 qu'il faudra compléter manuellement ? (descriptions, matériaux, etc.)
  - **Réponse** : Oui, c'est possible. AS400 contient probablement : nom, taille, couleur, stock, prix. Autres infos (descriptions, matériaux, instructions d'entretien, etc.) à compléter manuellement.
  - **Notes** : À vérifier lors de la journée en magasin, mais probablement besoin de compléter descriptions, matériaux, instructions d'entretien, pays de fabrication, etc.

- [x] **Q6.5** : Y a-t-il des produits avec des informations spécifiques à ajouter ? (guide des tailles personnalisé, instructions d'entretien, etc.)
  - **Réponse** : Non, pas besoin. Policies de catégories déjà faites, tout est automatique.
  - **Notes** : Les size charts et autres infos sont déjà gérés par les policies de catégories, pas besoin d'infos spécifiques par produit.

---

## 🔄 Section 7 : Automatisation & Processus

- [x] **Q7.1** : Y a-t-il des tâches répétitives qu'on aimerait automatiser ? (mise à jour stocks, upload images, etc.)
  - **Réponse** : Si possible mais chiant à mettre en place. Approche simplifiée : utiliser stock du site, réassort quand stock bas (1-2 unités).
  - **Notes** : Automatisation possible mais complexe. Approche privilégiée : synchronisation quotidienne stocks AS400 → site, alertes réassort à 1-2 unités.

- [x] **Q7.2** : Quelle serait la fréquence idéale de synchronisation des stocks ? (temps réel, toutes les heures, quotidien)
  - **Réponse** : Synchronisation quotidienne (après réassorts manuels matin/soir) + alertes réassort pour stocks 0-5 unités
  - **Notes** : Sync quotidienne après réassorts manuels. Système d'alerte pour réassort préventif (seuil 0-5 unités).

- [x] **Q7.3** : Y a-t-il des alertes/notifications qu'on aimerait recevoir ? (rupture de stock, nouvelle commande, etc.)
  - **Réponse** : Oui, alerte/notification pour stocks à mettre à jour (seuil : 0 à 5 unités)
  - **Notes** : Système d'alerte pour produits avec stock entre 0 et 5 unités (besoin de réassort). Notification dans l'admin.

---

## 📝 Section 8 : Questions Techniques Spécifiques

- [ ] **Q8.1** : Y a-t-il des contraintes techniques spécifiques à respecter ? (format données, encodage, caractères spéciaux)
  - **Réponse** : _________________________
  - **Notes** : _________________________

- [ ] **Q8.2** : Y a-t-il des champs dans l'AS400 qu'on n'utilisera pas dans le site ? (à ignorer lors de l'import)
  - **Réponse** : _________________________
  - **Notes** : _________________________

- [ ] **Q8.3** : Y a-t-il des valeurs par défaut à définir si certaines données manquent dans l'AS400 ?
  - **Réponse** : _________________________
  - **Notes** : _________________________

---

## ✅ Section 9 : Validation & Tests

- [ ] **Q9.1** : Qui validera les données importées ? (toi, équipe, direction)
  - **Réponse** : _________________________
  - **Notes** : _________________________

- [ ] **Q9.2** : Y a-t-il un processus de validation spécifique à suivre ?
  - **Réponse** : _________________________
  - **Notes** : _________________________

- [ ] **Q9.3** : Combien de temps prévois-tu pour valider l'intégration complète ?
  - **Réponse** : _________________________
  - **Notes** : _________________________

---

## 📅 Section 10 : Planning & Priorités

- [x] **Q10.1** : Quelle est la date cible pour avoir la collection complète en ligne ?
  - **Réponse** : Sortie officielle février 2025
  - **Notes** : Date cible : février 2025. Phase 24 doit être complétée avant cette date.

- [x] **Q10.2** : Y a-t-il des produits prioritaires à intégrer en premier ? (nouveautés, best-sellers)
  - **Réponse** : Ordre de priorité : 1) Collection sneakers → 2) Collection reboul adulte → 3) Collection reboul enfant
  - **Notes** : Priorisation claire : sneakers en premier, puis reboul adulte, puis reboul enfant.

- [x] **Q10.3** : Combien de temps peux-tu consacrer par semaine à cette phase ? (heures)
  - **Réponse** : Le temps qu'il faudra
  - **Notes** : Disponibilité totale pour cette phase, pas de contrainte de temps.

---

## 📌 Notes Générales

**Espace libre pour notes additionnelles** :

- _________________________
- _________________________
- _________________________
- _________________________

---

**Date de dernière mise à jour** : _________________________  
**Personne ayant répondu** : _________________________

