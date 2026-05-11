# vault-sync

**Commande** : `/vault-sync`

Synchronisation rapide du vault Obsidian apres une tache ou une modification importante.

## Objectif

Maintenir `obsidian-vault/` comme source de verite unique du projet.

## Workflow

1. Lire `obsidian-vault/REBOUL.md` (point d'entree).
2. Identifier les notes impactees via les liens `[[...]]` :
   - phase (`Projet/phase-25`, `Projet/phase-26`, etc.)
   - page frontend (`Frontend/...`)
   - module backend (`Backend/...`)
   - collection (`Collections/...`)
3. Mettre a jour les statuts dans les fichiers concernes :
   - progression
   - decisions prises
   - prochains steps
4. Mettre a jour `obsidian-vault/TODO.md` (taches cochees / nouvelles taches).
5. Si changement significatif global, mettre a jour `obsidian-vault/REBOUL.md`.

## Checklist rapide

- [ ] Fichier(s) de phase mis a jour
- [ ] Fichier(s) metier (Frontend/Backend/Collections) mis a jour
- [ ] `TODO.md` aligne
- [ ] `REBOUL.md` aligne si necessaire

## Regles

- Ne pas recreer de documentation parallele dans `docs/`.
- Le vault est la reference prioritaire.
- Garder les mises a jour courtes, factuelles, actionnables.

