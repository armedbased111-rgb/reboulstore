# 🔑 Guide : Ajouter les Clés Stripe et Cloudinary

## 📋 Prérequis

Tu as besoin de :
1. **Clés Stripe** (depuis https://dashboard.stripe.com/apikeys)
   - `STRIPE_SECRET_KEY` (commence par `sk_live_...`)
   - `STRIPE_WEBHOOK_SECRET` (depuis Webhooks, commence par `whsec_...`)

2. **Clés Cloudinary** (depuis https://cloudinary.com/console)
   - `CLOUDINARY_CLOUD_NAME` (nom du cloud)
   - `CLOUDINARY_API_KEY` (clé API)
   - `CLOUDINARY_API_SECRET` (secret API)

---

## 🛠️ Méthode 1 : Édition via SSH (Recommandée)

### Se connecter au serveur

```bash
ssh deploy@152.228.218.35
```

### Éditer le fichier Reboul Store

```bash
cd /opt/reboulstore
nano .env.production
```

Trouver et remplacer :
```env
STRIPE_SECRET_KEY=sk_live_...          # Remplacer par ta vraie clé
STRIPE_WEBHOOK_SECRET=whsec_...        # Remplacer par ton vrai secret
CLOUDINARY_CLOUD_NAME=ton-cloud-name   # Remplacer par ton cloud name
CLOUDINARY_API_KEY=ton-api-key         # Remplacer par ta clé API
CLOUDINARY_API_SECRET=ton-api-secret   # Remplacer par ton secret API
```

Sauvegarder : `Ctrl+X`, puis `Y`, puis `Enter`

### Éditer le fichier Admin Central

```bash
cd /opt/reboulstore/admin-central
nano .env.production
```

Trouver et remplacer (mêmes valeurs Cloudinary que Reboul) :
```env
CLOUDINARY_CLOUD_NAME=ton-cloud-name   # Remplacer par ton cloud name
CLOUDINARY_API_KEY=ton-api-key         # Remplacer par ta clé API
CLOUDINARY_API_SECRET=ton-api-secret   # Remplacer par ton secret API
```

**Note** : Admin Central n'a pas besoin de clés Stripe (seul Reboul Store les utilise).

Sauvegarder : `Ctrl+X`, puis `Y`, puis `Enter`

---

## 🔧 Méthode 2 : Utiliser sed (si tu as les valeurs)

Si tu préfères utiliser des commandes (remplacer les valeurs ci-dessous) :

```bash
ssh deploy@152.228.218.35

# Reboul Store
cd /opt/reboulstore
sed -i 's|STRIPE_SECRET_KEY=.*|STRIPE_SECRET_KEY=sk_live_TON_VRAIE_CLE|' .env.production
sed -i 's|STRIPE_WEBHOOK_SECRET=.*|STRIPE_WEBHOOK_SECRET=whsec_TON_VRAIE_SECRET|' .env.production
sed -i 's|CLOUDINARY_CLOUD_NAME=.*|CLOUDINARY_CLOUD_NAME=ton-cloud-name|' .env.production
sed -i 's|CLOUDINARY_API_KEY=.*|CLOUDINARY_API_KEY=ton-api-key|' .env.production
sed -i 's|CLOUDINARY_API_SECRET=.*|CLOUDINARY_API_SECRET=ton-api-secret|' .env.production

# Admin Central
cd /opt/reboulstore/admin-central
sed -i 's|CLOUDINARY_CLOUD_NAME=.*|CLOUDINARY_CLOUD_NAME=ton-cloud-name|' .env.production
sed -i 's|CLOUDINARY_API_KEY=.*|CLOUDINARY_API_KEY=ton-api-key|' .env.production
sed -i 's|CLOUDINARY_API_SECRET=.*|CLOUDINARY_API_SECRET=ton-api-secret|' .env.production
```

---

## ✅ Vérification

Après avoir ajouté les clés, vérifier :

```bash
ssh deploy@152.228.218.35

# Reboul Store
cd /opt/reboulstore
grep -E '^(STRIPE_|CLOUDINARY_)' .env.production

# Admin Central
cd /opt/reboulstore/admin-central
grep -E '^(STRIPE_|CLOUDINARY_)' .env.production
```

Toutes les valeurs doivent être différentes des placeholders (`YOUR_STRIPE_SECRET_KEY_HERE`, `ton-cloud-name`, etc.).

---

## 🔐 Sécurité

⚠️ **Important** :
- Ne jamais commiter ces clés dans Git
- Ne jamais les partager publiquement
- Utiliser uniquement les clés de **production** (pas les clés de test)
- Pour Stripe : Utiliser `sk_live_...` (pas `sk_test_...`)
- Pour Stripe Webhook : Utiliser le secret de production (pas test)

---

## 📝 Prochaine étape

Une fois les clés ajoutées :
- ✅ Phase 17.11.5.5 complétée
- ✅ Prêt pour **Phase 23 : Déploiement Effectif**
