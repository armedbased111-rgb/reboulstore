# Résumé de contexte — Reboul Store

**Généré le** : 17/05/2026 14:40
**Source** : vault Obsidian (`obsidian-vault/`)

## Progression globale

**Tâches** : 17/79 cochées dans `Projet/roadmap.md`

## Sections roadmap

- 🟡 **Images & Collections** — 0/19
  - [ ] **Hologram** — importer le CSV via Admin Centrale (8 refs)
  - [ ] **Hologram** — lancer pipeline flat lay
  - [ ] **Birkenstock** — lancer `generate-batch --product-type shoe` (34 refs)
- 🟡 **Frontend & UX** — 0/12
  - [ ] [[Frontend/Home]] + popup newsletter — revue desktop + mobile
  - [ ] [[Frontend/Catalog]] — revue desktop + mobile
  - [ ] [[Frontend/Product]] — revue desktop + mobile
- 🟡 **SEO & Métadonnées** — 0/5
  - [ ] `react-helmet-async` sur toutes les pages principales
  - [ ] Titles + meta descriptions propres (FR) par page
  - [ ] Open Graph minimal (title, description, image) — s'appuie sur [[Backend/og]]
- 🟡 **Technique & Sécurité** — 17/35
  - [ ] `requestId` par requête (middleware — suivi corrélation logs)
  - [ ] Vérifier en prod après deploy : `./rcli server logs backend --errors` + `logs/er…
  - [ ] `logrotate` pour `/var/log/reboulstore-backup.log` (éviter fichier qui grossit s…
- 🟡 **Lancement** — 0/8
  - [ ] Basculer clés Stripe test → live — ⏳ en attente Julie
  - [ ] Valider webhooks Stripe en prod — ⏳ en attente Julie
  - [ ] Test flux paiement complet mode live (PaymentIntent → success → commande créée) …

## État projet (extrait REBOUL.md)

# REBOUL STORE — Intelligence centrale

Point d'entrée du vault. Lire ce fichier en premier.

---

## Le projet

**Reboul Store** — E-commerce multi-sites (Reboul, CP Company, Outlet).
Boutique physique à Marseille / Cassis / Sanary. Site web en finalisation avant lancement.

Stack : React (Vite) + NestJS + PostgreSQL (VPS) + Cloudinary + Stripe.
Design : mobile-first, inspiré A-COLD-WALL* — minimaliste, premium streetwear.
Admin Centrale mutualisée pour tous les sites.

---

## État actuel

| Bloc | Statut |
|------|--------|
| Backend NestJS | Stable et complet — 18 modules |
| Admin Central...

### Dernières sessions

- `2026-05-17-logs-winston.md`
- `2026-05-17-as400-cursor-sync.md`
- `2026-05-12-backup-verification.md`


## Fichiers de référence

| Besoin | Fichier |
|--------|---------|
| État global | `obsidian-vault/REBOUL.md` |
| Roadmap | `obsidian-vault/Projet/roadmap.md` |
| Tâches | `obsidian-vault/TODO.md` |
| Backend | `backend/BACKEND.md` |
| Frontend | `frontend/FRONTEND.md` |

## Commandes utiles

```bash
./rcli roadmap update --task "libellé partiel de la tâche"
./rcli context sync          # maj dates + BACKEND/FRONTEND
./rcli context generate      # ce fichier
./rcli docs sync             # alias sync technique
```

> Anciens fichiers obsolètes : `docs/context/ROADMAP_COMPLETE.md`, `CONTEXT.md`
