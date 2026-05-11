---
type: module
nom: newsletter
statut: complet
---
# Module — Newsletter

Inscription newsletter avec email de bienvenue et notification admin.

Liens : [[Backend/Backend]] · [[Frontend/Frontend]]

## Tables BDD

[[Database/tables/newsletter_subscriptions]]

---

## Endpoints

```
POST /newsletter/subscribe    # s'inscrire { email, source? }
```

## Entité

**NewsletterSubscription** : id, email, source (ex: "modal-home"), subscribedAt

## Règles métier

- Si email déjà inscrit → retourne `{ ok: true, alreadySubscribed: true }` sans erreur
- `source` : champ optionnel (max 64 chars) pour tracker l'origine (modal, footer, etc.)
- Email de bienvenue → template `newsletter-welcome.hbs`
- Email notif admin → template `newsletter-admin-notify.hbs` (vers SMTP_USER)

## Intégration frontend

- Modale newsletter à l'entrée (composant `NewsletterModal`)
- Service : `frontend/src/services/newsletterService.ts`
- Composant : `frontend/src/components/newsletter/`

## Templates email

| Template | Destinataire |
|----------|-------------|
| `newsletter-welcome.hbs` | L'inscrit |
| `newsletter-admin-notify.hbs` | SMTP_USER (admin) |
