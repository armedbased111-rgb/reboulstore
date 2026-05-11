# vault-session

**Commande** : `/vault-session`

Ouvrir/mettre a jour une session de travail dans le vault avec une trace propre.

## Objectif

Tracer chaque session pour reprendre vite sans perte de contexte.

## Workflow

1. Lire `obsidian-vault/REBOUL.md`.
2. Creer une note session dans `obsidian-vault/Sessions/` :
   - format conseille: `YYYY-MM-DD-sujet.md`
3. Utiliser le template `obsidian-vault/_templates/session.md` si possible.
4. Documenter :
   - contexte d'entree
   - actions faites
   - blocages
   - decisions
   - next steps
5. Ajouter les liens vers les notes impactees (`[[Frontend/Home]]`, `[[Projet/phase-25]]`, etc.).
6. Mettre a jour `obsidian-vault/REBOUL.md` section "Derniere session" avec le lien.

## Format minimum

- Date / sujet
- Ce qui a ete fait
- Ce qui reste
- Prochaine action concrete

## Regles

- Une session = un fichier.
- Pas de prose longue inutile.
- Priorite au concret et au suivable.

