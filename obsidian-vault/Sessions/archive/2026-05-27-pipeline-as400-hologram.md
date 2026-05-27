---
type: session
date: 2026-05-27
statut: termine
---
# Session 2026-05-27 — Pipeline images + AS400 Jacques

Liens : [[Architecture/pipeline-images]] · [[Securite/as400]] · [[Collections/hologram]]

## Pipeline images — correctifs

- **Fond génération** : `#F3F3F3` → `#808080` (gris moyen) dans tous les prompts garment
  - Raison : vêtements blancs sur #F3F3F3 = contraste 5% → génération ratée (invisible)
  - #808080 = équilibre optimal blanc (50% contraste) ET noir (50% contraste)
  - Cas d'échec résiduel accepté : gris moyens proches du fond
- **PIL normalize_bg** : désactivé — les images conservent exactement la sortie modèle
  - Le fond #808080 est géré en post-prod PS (fond + ombre manuels)
- Fichier : `cli/commands/images_core.py`

## Hologram

- Batch lancé via Image UI — problème coloris blancs (AR00683-WHITE, AR00681-WHITE, AR00685-WHITE) observé
- Correctif pipeline appliqué → à relancer sur les refs blanches

## AS400

- Message SFTP envoyé à Jacques avec identifiants complets
- Connexion testée et validée depuis Mac (`entrant/` + `sortant/` visibles)
- En attente retour Jacques : IP fixe, spec `entrant/`, confirmation `sortant/`

## Suite

- [ ] Hologram : relancer batch sur coloris blancs avec nouveau fond #808080
- [ ] Hologram : retouche PS + upload
- [ ] AS400 : attendre retour Jacques → IP fixe (UFW) + Phase 2 entrant/
- [ ] Collections : continuer Stone Island / RRD / Carhartt
