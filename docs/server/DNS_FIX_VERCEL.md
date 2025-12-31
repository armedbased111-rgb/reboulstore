# Guide : Corriger les DNS dans Vercel

## 🎯 Situation

Les DNS sont gérés par **Vercel** (pas OVH directement).

**Problème** : `reboulstore.com` (root domain) pointe vers les anciennes IPs Vercel au lieu de notre serveur.

---

## ✅ Solution : Modifier dans Vercel Dashboard

### Étape 1 : Accéder à Vercel Dashboard

1. Va sur https://vercel.com/dashboard
2. Connecte-toi avec ton compte
3. Sélectionne le projet **reboulstore** (ou le projet correspondant)

### Étape 2 : Aller dans les paramètres DNS

1. Dans le projet, va dans **"Settings"** (Paramètres)
2. Clique sur **"Domains"** dans le menu de gauche
3. Ou va directement : https://vercel.com/dashboard → Ton projet → Settings → Domains

### Étape 3 : Configurer les DNS Records

1. Trouve `reboulstore.com` dans la liste des domaines
2. Clique sur le domaine ou sur **"DNS Records"** / **"DNS"**

3. **Modifier le record A pour le root domain** :
   - Cherche le record de type **A** pour `reboulstore.com` ou `@` ou vide
   - **Supprime** ou **modifie** les records qui pointent vers :
     - `216.198.79.1`
     - `64.29.17.1`
   - **Ajoute** ou **modifie** un record :
     - **Type** : `A`
     - **Name** : `@` (ou vide, ou `reboulstore.com`)
     - **Value** : `152.228.218.35`
     - **TTL** : `60` ou `Automatic` (par défaut)

4. **Vérifier les autres records** :
   - `www` → doit pointer vers `152.228.218.35` ✅ (devrait déjà être correct)
   - `admin` → doit pointer vers `152.228.218.35` ✅ (devrait déjà être correct)

5. **Sauvegarder** les modifications

---

## ⏱️ Propagation

La propagation Vercel est généralement rapide : **1-5 minutes**.

---

## ✅ Vérification

Après modification, vérifie :

```bash
dig +short reboulstore.com
```

**Résultat attendu** : `152.228.218.35`

---

## 📸 Aide visuelle Vercel

Dans Vercel, la section DNS ressemble à ça :

```
DNS Records
┌──────────┬──────┬────────────────────┬──────┐
│ Name     │ Type │ Value              │ TTL  │
├──────────┼──────┼────────────────────┼──────┤
│ @        │ A    │ 152.228.218.35     │ 60   │ ← À modifier/ajouter
│ www      │ A    │ 152.228.218.35     │ 60   │ ← Déjà correct
│ admin    │ A    │ 152.228.218.35     │ 60   │ ← Déjà correct
└──────────┴──────┴────────────────────┴──────┘
```

---

## 🚀 Après correction

Une fois les DNS corrigés et propagés, lance HTTPS :

```bash
ssh deploy@152.228.218.35
cd /opt/reboulstore
./scripts/wait-dns-and-https.sh
```

Ou manuellement :

```bash
./scripts/setup-https.sh
```
