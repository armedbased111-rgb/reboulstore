---
type: module
nom: sms
statut: complet
---
# Module — SMS (Twilio)

Service utilitaire d'envoi de SMS. Pas de controller propre — utilisé en interne par d'autres modules.

Liens : [[Backend/Backend]]

---

## Fonctionnement

- Wrapper autour de Twilio SDK
- S'active uniquement si `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` sont définis dans `.env`
- Si non configuré → `isEnabled: false`, les appels sont silencieusement ignorés

## Variables d'environnement

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxx
TWILIO_PHONE_NUMBER=+33612345678
```

## Utilisé par

- `auth` module → SMS reset mot de passe
- `orders` module → notification expédition (optionnel)

## Notes

Pas d'endpoint public. Service injecté dans les modules qui en ont besoin via NestJS DI.
