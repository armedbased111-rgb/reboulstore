---
type: securite
audience: expert-as400
maj: 2026-05-17
statut: a-transmettre
---
# Fiche expert — Accès SFTP Reboul Store

> **Uniquement pour l’expert AS400** — à envoyer quand Reboul décide (avec mot de passe **à part**).  
> **Plan et spec CSV détaillée** : [[Securite/as400]] — pas dans ce fichier.

**Contact Reboul** : *(nom, email, téléphone)*

---

## Connexion SFTP

| Paramètre | Valeur |
|-----------|--------|
| Protocole | **SFTP** (pas FTP) |
| Hôte | `152.228.218.35` |
| Port | `22` |
| Utilisateur | `sftp-as400` |
| Mot de passe | *(communiqué séparément)* |

## Dossiers

| Dossier | Vous | Nous |
|---------|------|------|
| `entrant/` | Vous déposez un **CSV extrait produits / stocks** (table AS400) | On met à jour catalogue et stocks du site |
| `sortant/` | Vous récupérez notre **CSV extrait produits** (miroir) | On génère après accord sur les colonnes |

## Rappel accord (réunion 12/05/2026)

- Fichiers **CSV**, échange visé **toutes les heures**
- **Entrant** : structure de **votre** export produits — à nous transmettre (fichier exemple ou spec)
- **Sortant** : nous enverrons le **même type d’extrait** depuis notre base — merci de valider (voir ci-dessous)

## Aperçu — fichier Reboul → `sortant/` (en discussion)

- Visé : **extrait produits** (réf, stock, champs catalogue…), **pas** commandes web
- **Accord Reboul** : fichier `sortant/` = **lignes modifiées** depuis le dernier export (pas catalogue entier chaque heure) — à valider côté AS400
- Détail : [[Securite/as400]]

**Merci de nous indiquer** après lecture :

1. IP fixe de vos connexions SFTP (option firewall)
2. Nommage et structure de **vos** fichiers stocks dans `entrant/`
3. Le flux `sortant/` doit-il être un **miroir produits** ou autre chose (ex. ventes) ?
4. Contact technique AS400

## Test de connexion

```bash
sftp -P 22 sftp-as400@152.228.218.35
cd entrant
# put un petit fichier test.csv
```

---

*Document d’envoi · Hub projet : [[Securite/as400]]*
