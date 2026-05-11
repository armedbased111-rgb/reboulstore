---
type: module
nom: auth
statut: complet
---
# Module — Auth

Authentification JWT + OAuth Google / Apple. Gestion utilisateurs et rôles.

Liens : [[Backend/Backend]] · [[Frontend/Frontend]]

## Tables BDD

[[Database/tables/users]] · [[Database/tables/addresses]]

---

## Endpoints

```
POST /auth/register               # créer un compte
POST /auth/login                  # login → JWT
GET  /auth/me                     # utilisateur courant (token requis)
POST /auth/refresh                # rafraîchir le token
POST /auth/forgot-password        # email reset password
POST /auth/reset-password         # réinitialiser le mot de passe
GET  /auth/google                 # OAuth Google
GET  /auth/apple                  # OAuth Apple
```

## Entités

**User** : id, email, passwordHash, firstName, lastName, role, createdAt
**Address** : id, userId, street, city, zipCode, country, isDefault

## Rôles

`CLIENT` · `ADMIN` · `SUPER_ADMIN`

## Règles métier

- JWT access token (15min) + refresh token (7j)
- Reset password via email (SMTP) + token temporaire
- OAuth : création de compte automatique si email inconnu
- SMS Twilio disponible pour reset password alternatif
