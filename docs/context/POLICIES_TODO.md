# 📋 Note de finalisation - Politiques de livraison et retours

**Date** : 9 décembre 2025  
**Statut** : À valider avec la direction  
**Objectif** : Finaliser les politiques de livraison et retours avant le lancement

---

## 🎯 Contexte

Les politiques actuelles sont basées sur les standards du marché français pour les marques de vêtements premium. Elles doivent être validées et ajustées selon la stratégie commerciale de Reboul Store.

---

## 📦 Politique de livraison actuelle (temporaire)

### Paramètres actuels
- **Livraison gratuite** : À partir de 60€
- **Coût standard** : 5.90€
- **Délai** : 2-4 jours ouvrés
- **Zone** : France + Union Européenne

### Texte affiché
> "Standard delivery in France is €5.90 and takes 2-4 business days. Free shipping on orders over €60. International shipping available to the European Union (rates calculated at checkout)."

### ✅ Avantages
- Seuil de 60€ encourage le panier moyen
- Prix compétitif vs marché (standards : 4.90€ - 6.90€)
- Délai rapide = satisfaction client

### ⚠️ Points à valider
1. **Transporteur** : Quel prestataire ? (Colissimo, Chronopost, DPD, etc.)
2. **Coût réel** : Quel est le coût négocié avec le transporteur ?
3. **Seuil gratuit** : 60€ est-il rentable ? (calculer marge moyenne)
4. **Zones internationales** : 
   - UE uniquement ou monde entier ?
   - Suisse/UK (hors UE) ?
   - Droits de douane : qui les paie ?

---

## 🔄 Politique de retour actuelle (temporaire)

### Paramètres actuels
- **Fenêtre** : 30 jours
- **Frais** : À la charge du client
- **Conditions** : État neuf, étiquettes attachées

### Texte affiché
> "Returns are accepted within 30 days of purchase. Items must be in their original condition with all tags attached. Return shipping costs are the responsibility of the customer. Refunds will be processed within 7-10 business days after receipt of the returned item. Final sale items and personalized products are not eligible for return."

### ✅ Avantages
- 30 jours = standard légal français (14 jours minimum)
- Frais payants = limite les retours abusifs
- Conditions claires

### ⚠️ Points à valider
1. **Frais de retour** :
   - Payants (actuel) ou gratuits ?
   - Si payants : quel montant ? (environ 5-10€)
   - Impact sur le taux de retour ?
2. **Délai de remboursement** : 7-10 jours OK ?
3. **Articles exclus** :
   - Soldes (actuellement exclus)
   - Sous-vêtements ? Accessoires ?
   - Produits personnalisés (actuellement exclus)
4. **Échange vs remboursement** :
   - Permettre les échanges directs ?
   - Crédit boutique vs remboursement ?

---

## 🎯 Benchmarks marché (vêtements premium)

| Marque | Livraison gratuite | Coût standard | Délai | Retours |
|--------|-------------------|---------------|-------|---------|
| A-COLD-WALL* | 100€ | 10€ | 3-5 jours | 14 jours gratuits |
| COS | 100€ | 6.95€ | 2-5 jours | 30 jours gratuits |
| Norse Projects | 150€ | 12€ | 3-5 jours | 14 jours payants |
| Carhartt WIP | 80€ | 5€ | 2-4 jours | 30 jours gratuits |
| **Reboul (actuel)** | **60€** | **5.90€** | **2-4 jours** | **30 jours payants** |

### 💡 Recommandations stratégiques

1. **Si positionnement ultra-premium** (>150€/pièce) :
   - Seuil : 100-150€
   - Retours gratuits
   - Emballage premium

2. **Si positionnement accessible-premium** (50-150€/pièce) :
   - Seuil : 60-80€ ✅ (actuel OK)
   - Retours payants ✅ (actuel OK)
   - Service client réactif

3. **Si focus volume** :
   - Seuil bas (40-50€)
   - Retours gratuits
   - Livraison express en option

---

## 📊 Questions business à trancher

### Priorité 1 (bloquant pour le lancement)
- [ ] Quel transporteur ? (impact sur les coûts et délais)
- [ ] Quel coût réel de livraison ? (marge à calculer)
- [ ] Zones de livraison finales ? (France, UE, Monde ?)
- [ ] Frais de retour : gratuits ou payants définitivement ?

### Priorité 2 (à définir rapidement)
- [ ] Suivi des colis : email automatique ? SMS ?
- [ ] Livraison express en option ? (Chronopost J+1)
- [ ] Point relais ou domicile uniquement ?
- [ ] Gestion des retours : via transporteur ou en magasin ?

### Priorité 3 (optimisation future)
- [ ] Programme de fidélité : livraison gratuite permanente ?
- [ ] Emballage : standard ou premium/éco-responsable ?
- [ ] Assurance colis : incluse ou optionnelle ?

---

## 🛠️ Prochaines étapes techniques

Une fois les politiques validées :
1. Mettre à jour le shop via l'API backend
2. Vérifier l'affichage frontend (Product page)
3. Ajouter les politiques dans le Footer (CGV, Mentions légales)
4. Créer une page dédiée `/shipping-returns`
5. Intégrer au tunnel de commande (Checkout)
6. Configurer les emails de confirmation/suivi

---

## 💼 Contacts à prendre

- [ ] Transporteur(s) : devis et conditions
- [ ] Assurance : couverture colis perdus/endommagés
- [ ] Juriste : validation textes légaux (CGV, mentions)
- [ ] Comptable : calcul marges et seuils rentables

---

**Document à compléter et valider ensemble** 📌
