---
type: page
fichier: src/pages/Search.tsx
route: /search
statut: a-revoir
phase: "25"
---
# Search

Page recherche + composant QuickSearch accessible depuis le header.

Liens : [[Frontend/Frontend]]

---

## Ce qui est en place

- QuickSearch — recherche rapide dans le header (popover)
- SearchCombobox — combobox avec suggestions en temps réel
- Page /search — résultats complets
- Filtrage par nom, marque, catégorie

## Points à revoir
- [ ] Revue desktop + mobile
- [ ] QuickSearch : UX ouverture/fermeture, raccourci clavier (⌘K ?)
- [ ] Temps de réponse : debounce sur la saisie
- [ ] Résultats vides : état d'erreur informatif
- [ ] Suggestions : pertinence (correspondance partielle, fuzzy ?)
- [ ] Navigation clavier dans les résultats (accessibilité)

## Notes
