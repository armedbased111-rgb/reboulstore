# vault-page-review

**Commande** : `/vault-page-review [PageName]`

Workflow standard pour auditer et finaliser une page frontend avec sync vault.

## Exemple

`/vault-page-review Home`

## Workflow

1. Lire `obsidian-vault/REBOUL.md`.
2. Ouvrir la note de page cible dans `obsidian-vault/Frontend/`.
3. Lancer la revue en 4 blocs :
   - UI visuelle (desktop/mobile)
   - UX (lisibilite, hierarchy, CTA, erreurs)
   - technique (coherence composants, dette rapide)
   - SEO de base (title/meta si applicable)
4. Appliquer les corrections dans le code.
5. Mettre a jour la note de page (statut, changements, reste a faire).
6. Mettre a jour `obsidian-vault/Projet/phase-25.md`.
7. Mettre a jour `obsidian-vault/TODO.md`.
8. Si la page est fermee: cocher done dans la phase.

## Definition of done (page)

- [ ] Revue desktop + mobile
- [ ] Corrections UI/UX appliquees
- [ ] Verification fonctionnelle faite
- [ ] Note vault de la page a jour
- [ ] `phase-25.md` + `TODO.md` alignes

## Regles

- Toujours commencer par la note Obsidian de la page.
- Ne pas separer code et contexte: mise a jour vault dans la meme boucle.

