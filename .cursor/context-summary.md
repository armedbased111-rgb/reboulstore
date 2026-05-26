# Résumé de contexte — Reboul Store

**Généré le** : 26/05/2026 15:58
**Source** : vault Obsidian (`obsidian-vault/`)

## Progression globale

**Tâches** : 51/99 cochées dans `Projet/roadmap.md`

## Sections roadmap

- 🟡 **Images & Collections** — 7/26
  - [ ] **Code article** — autres marques (feuilles stock quand dispo)
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
- 🟡 **Technique & Sécurité** — 43/48
  - [ ] Phase 1 — Transmission fiche expert + mdp
  - [ ] Phase 2 — Import `entrant/` *(après 1er CSV AS400)*
  - [ ] Envoyer [[Securite/as400-fiche-expert]] + mdp SFTP
- 🟡 **Lancement** — 1/8
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

- `Sessions.md`


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
