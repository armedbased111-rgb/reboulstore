# Site public — légal, cookies, déploiement

Guide de référence pour les pages légales, le consentement cookies / GA4 et la mise en production du frontend Reboul Store.

## 1. Vue d’ensemble (ce qui est en place)

| Sujet | Détail |
|--------|--------|
| **Pages** | Livraison, CGV (`/cgv`, alias long), politique de confidentialité (`/politique-de-confidentialite`), mentions légales, cookies, échanges & retours, etc. |
| **Footer** | Liens vers ces pages ; SIRET / TVA lus depuis une source unique. |
| **Source unique infos société** | `frontend/src/copy/legalSiteInfo.ts` — à compléter avant une conformité « réelle ». |
| **Cookies** | Page `/cookies` décrivant localStorage, Stripe, GA4 optionnel. |
| **Consentement** | Bandeau bas de page + `Préférences cookies` dans le footer ; GA4 ne se charge **qu’après** acceptation. Stockage : `localStorage` clé `reboul_cookie_consent` (`necessary` \| `analytics`). |
| **SPA + GA4** | Suivi des vues de route si consentement `analytics` + `VITE_GA_MEASUREMENT_ID` défini au build. |

Fichiers utiles côté code :

- `frontend/src/copy/legalSiteInfo.ts` — éditeur, hébergeur, médiateur
- `frontend/src/contexts/CookieConsentContext.tsx` — logique consentement
- `frontend/src/components/consent/CookieConsentBanner.tsx` — UI bandeau
- `frontend/src/components/consent/AnalyticsRouteTracker.tsx` — page views GA4
- `frontend/src/utils/analytics.ts` — injection GA4 (une fois, après consentement)
- `frontend/src/components/layout/Layout.tsx` — footer + padding si bandeau visible

## 2. Variables d’environnement (frontend)

| Variable | Rôle |
|----------|------|
| `VITE_GA_MEASUREMENT_ID` | ID GA4 (`G-…`). **Absent** = pas de script Google ; le bandeau propose seulement « Continuer ». **Présent au build** = choix « Accepter la mesure d’audience » charge GA4 après accord. |

À définir dans `.env` local et dans le fichier d’environnement utilisé pour **le build Docker / prod** (souvent `.env.production` côté pipeline ou serveur — ne pas commiter les secrets).

Référence : `frontend/.env.example`.

## 3. Déploiement en production

**Prérequis** : définir au minimum `DEPLOY_HOST` (ex. `deploy@votre-serveur` ou hostname). Sinon le script s’arrête avec une erreur explicite. Voir les variables en tête de `scripts/deploy-prod.sh`.

### Option A — Script maison (recommandé si déjà utilisé)

Depuis la racine du repo :

```bash
export DEPLOY_HOST="deploy@VOTRE_IP_OU_DOMAINE"
export DEPLOY_SSH_KEY="$HOME/.ssh/id_ed25519"   # adapter

# Rapide (build local frontend + upload + restart) — si le script le supporte
./scripts/deploy-prod.sh --quick

# Complet (build serveur, plus long)
./scripts/deploy-prod.sh --full
```

Options utiles : `--dry-run`, `--skip-backup` (à utiliser avec prudence).  
Variables typiques : `DEPLOY_HOST`, `DEPLOY_PATH`, `DEPLOY_SSH_KEY` (voir en-tête du script).

### Option B — CLI

```bash
./rcli deploy deploy --service reboul
# ou avec pull / rebuild selon la doc CLI
```

**Avant un déploiement** : sauvegarde DB si changements backend/DB (`./rcli db backup --server`).  
**Interdit** : `docker compose down -v` (risque sur les volumes base de données).

Après déploiement : vérifier en navigation privée le **bandeau cookies**, les liens footer, et une page légale.

## 4. Pour l’exploitant — actions légales à mener

Voir aussi le **communiqué** dans les notes de release / chat : checklist courte des champs obligatoires ou à valider avec un conseil.

### 4.1 Fichier unique `legalSiteInfo.ts`

Compléter tous les champs encore entre crochets ou « À compléter » :

- Forme juridique, siège social complet, RCS
- Directeur de publication
- Coordonnées hébergeur (nom légal, adresse, site)
- Médiateur de la consommation (nom, URL, adresse) une fois désigné — obligation selon cas B2C
- Email de contact si différent de `contact@reboulstore.com`

### 4.2 Contenu juridique

- Relire / faire relire **CGV** et **politique de confidentialité** par un professionnel adapté au commerce en ligne.
- **Cookies** : tenir la page `/cookies` à jour si vous ajoutez d’autres traceurs (Meta Pixel, etc.) — le bandeau actuel couvre surtout **GA4** ; d’autres scripts peuvent exiger extension du consentement ou un CMP.

### 4.3 Google Analytics

- Définir `VITE_GA_MEASUREMENT_ID` au **build** prod pour activer l’option « mesure d’audience » dans le bandeau.
- Vérifier paramétrage GA4 (rétention, IP, transferts hors UE si pertinent).

### 4.4 Stripe

- Les cookies/traceurs sur le domaine Stripe restent régis par Stripe ; la politique cookies du site le mentionne déjà — garder le lien vers leur politique à jour si besoin.

---

*Dernière mise à jour : mars 2026 — évolutions légales ou produit : ajuster ce guide et `legalSiteInfo.ts` en conséquence.*
