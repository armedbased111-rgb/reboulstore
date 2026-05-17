# as400-integration

**Commande** : `/as400-integration`

Guide d'intégration AS400 ↔ Reboul Store via **SFTP bidirectionnel** sur le VPS.

## Statut actuel (mai 2026)

**Intégration AS400 : EN COURS** — décision validée en réunion cyber du **12/05/2026**.

| Phase | Statut | Contenu |
|-------|--------|---------|
| **Phase 1** | ✅ VPS · ⏳ envoi fiche | SFTP : user `sftp-as400`, chroot, `entrant/` + `sortant/` |
| **Phase 2** | ⏸️ Après 1er CSV | `entrant/` — parser stocks → DB |
| **Phase 3** | 🔜 Spec en cours | `sortant/` — export commandes → CSV |

**Source de vérité** : `obsidian-vault/Securite/as400.md`

**Import collections manuel** (CSV Admin) reste en parallèle jusqu'à sync stocks opérationnelle → `/collection-workflow`

---

## Architecture retenue

**SFTP bidirectionnel** — fichiers CSV, batch horaire :

| Flux | Direction | Fréquence | Dossier VPS |
|------|-----------|-----------|-------------|
| Stocks | AS400 → nous | Toutes les heures | `entrant/` |
| Mouvements | Nous → AS400 | Toutes les heures | `sortant/` |

- L'AS400 se connecte à **notre VPS** (`152.228.218.35:22`)
- Toute l'implémentation technique est **de notre côté**
- Format confirmé : **CSV** (structure exacte à valider sur le premier fichier reçu)

---

## Phase 1 — Setup SFTP (à faire maintenant)

1. Créer user `sftp-as400` (SFTP only, pas de shell)
2. Chroot SSH → `/var/sftp/as400/`
3. Créer `entrant/` (AS400 dépose) + `sortant/` (AS400 récupère)
4. Générer identifiants, tester connexion
5. Transmettre host / port / user / mot de passe à l'expert AS400

```bash
# Vérifier infra après setup (exemples)
./rcli server exec "id sftp-as400"
./rcli server exec "ls -la /var/sftp/as400/"
```

Identifiants à transmettre : voir tableau dans `obsidian-vault/Securite/as400.md`

---

## Phase 2 — Entrant `entrant/` (après premier CSV stocks)

**Ne pas coder avant un CSV réel** dans `entrant/`.

- Parser CSV → mise à jour stocks DB
- Cron horaire + archivage + alerte si pas de fichier 2h
- Réconciliation hebdo AS400 ↔ DB

## Phase 3 — Sortant `sortant/` (spec en cours)

- Définir spec CSV dans `obsidian-vault/Securite/as400.md` (section Phase 3)
- Puis module NestJS export commandes payées → `sortant/`
- Cron horaire + anti-doublon

Référence roadmap : `obsidian-vault/Projet/roadmap.md` → section « AS400 — Intégration SFTP »

---

## Exploration AS400 (historique)

L'exploration menu Telnet (IP magasin, structure colonnes) reste documentée dans `docs/AS400_ANALYSIS_GUIDE.md` pour référence — **ce n'est plus l'approche retenue** pour la sync stocks.

---

## Références

- **Vault** : `obsidian-vault/Securite/as400.md` ⭐
- **Roadmap** : `obsidian-vault/Projet/roadmap.md`
- **Sécurité globale** : `obsidian-vault/Securite/etat-actuel.md`
- **Collections manuelles** : `/collection-workflow`
