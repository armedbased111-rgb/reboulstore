# Guide : Corriger les DNS pour reboulstore.com

## 🎯 Objectif

Corriger le record DNS A pour `reboulstore.com` (root domain) pour qu'il pointe vers `152.228.218.35` au lieu des anciennes IPs.

---

## 📋 Situation actuelle

**DNS actuels** :
- ✅ `www.reboulstore.com` → `152.228.218.35` (correct)
- ✅ `admin.reboulstore.com` → `152.228.218.35` (correct)
- ❌ `reboulstore.com` → `216.198.79.1`, `64.29.17.1` (anciennes IPs - à corriger)

---

## 🔧 Instructions par registrar

### OVH (si c'est ton registrar)

1. **Se connecter à l'espace client OVH**
   - Aller sur https://www.ovh.com/manager/web/
   - Se connecter avec tes identifiants

2. **Accéder à la zone DNS**
   - Aller dans **"Domaines"** > **"reboulstore.com"**
   - Cliquer sur **"Zone DNS"** ou **"DNS"**

3. **Modifier le record A pour le root domain**
   - Chercher le record de type **A** pour `reboulstore.com` (ou `@` ou vide)
   - S'il existe plusieurs records A, **supprimer** ceux qui pointent vers :
     - `216.198.79.1`
     - `64.29.17.1`
   - **Modifier** ou **créer** un record A :
     - **Sous-domaine** : `@` ou vide ou `reboulstore.com`
     - **Type** : `A`
     - **Valeur/IP** : `152.228.218.35`
     - **TTL** : `3600` (par défaut)
   - **Sauvegarder** / **Valider**

4. **Vérifier les autres records**
   - Assurer que `www` pointe vers `152.228.218.35` (devrait déjà être correct)
   - Assurer que `admin` pointe vers `152.228.218.35` (devrait déjà être correct)

### Autres registrars (GoDaddy, Namecheap, etc.)

Le principe est le même :

1. Se connecter au panel DNS de ton registrar
2. Trouver la zone DNS pour `reboulstore.com`
3. Modifier le record A du root domain (`@` ou `reboulstore.com`) :
   - Supprimer les anciennes IPs (`216.198.79.1`, `64.29.17.1`)
   - Ajouter/modifier pour pointer vers `152.228.218.35`
4. Sauvegarder

---

## ⏱️ Propagation DNS

Après modification, la propagation DNS peut prendre :
- **Minimum** : 5-10 minutes
- **Maximum** : 24-48 heures (rare)
- **Moyenne** : 15-30 minutes

---

## ✅ Vérification

Pour vérifier que les DNS sont corrigés :

```bash
dig +short reboulstore.com
```

**Résultat attendu** : `152.228.218.35`

Si tu vois encore les anciennes IPs, attendre un peu plus et réessayer.

---

## 🚀 Après correction

Une fois les DNS corrigés et propagés, exécuter :

```bash
ssh deploy@152.228.218.35
cd /opt/reboulstore
./scripts/setup-https.sh
```

Ou utiliser le script automatique qui vérifie et relance HTTPS :

```bash
ssh deploy@152.228.218.35
cd /opt/reboulstore
./scripts/wait-dns-and-https.sh
```

---

## 🔍 Commandes utiles

```bash
# Vérifier les DNS actuels
dig +short reboulstore.com
dig +short www.reboulstore.com
dig +short admin.reboulstore.com

# Vérifier avec plus de détails
dig reboulstore.com +noall +answer

# Vérifier depuis différents serveurs DNS
dig @8.8.8.8 reboulstore.com +short  # Google DNS
dig @1.1.1.1 reboulstore.com +short  # Cloudflare DNS
```
