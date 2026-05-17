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
| `entrant/` | Vous **déposez** les fichiers **stocks** (CSV) | On lit et met à jour le site |
| `sortant/` | Vous **récupérez** les fichiers **mouvements** (ventes web) | On génère et dépose (après mise en service) |

## Rappel accord (réunion 12/05/2026)

- Fichiers **CSV**, échange visé **toutes les heures**
- Format détaillé des stocks : **à définir avec vous** (premier fichier ou spec AS400)
- Format des mouvements que nous enverrons : **résumé ci-dessous** — merci de valider ou corriger

## Aperçu — fichier mouvements (Reboul → `sortant/`)

*(Détail : [[Securite/as400#Spec mouvements envoyés — Phase 3 (sortant/) — en cours]])*

- Nom proposé : `mouvements_YYYYMMDD_HH.csv`
- Encodage UTF-8, séparateur `;`, 1 ligne = 1 article commandé
- Commandes **payées** sur reboulstore.com
- Colonnes principales : n° commande, date, statut, SKU, référence produit, quantité, prix

**Merci de nous indiquer** après lecture :

1. IP fixe de vos connexions SFTP (option firewall)
2. Nommage et structure de **vos** fichiers stocks dans `entrant/`
3. Colonnes **obligatoires** ou **interdites** pour nos mouvements
4. Contact technique AS400

## Test de connexion

```bash
sftp -P 22 sftp-as400@152.228.218.35
cd entrant
# put un petit fichier test.csv
```

---

*Document d’envoi · Hub projet : [[Securite/as400]]*
