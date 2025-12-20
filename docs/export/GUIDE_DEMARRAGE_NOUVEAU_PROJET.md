# 🚀 Guide de Démarrage Nouveau Projet E-commerce

**Version** : 1.0  
**Date** : 12 décembre 2025  
**Usage** : Guide complet pour démarrer un nouveau projet avec l'IA

---

## ⏱️ Timeline : 1 Heure avant le Rendez-vous

### ✅ Checklist Avant le Rendez-vous

- [ ] Avoir `brainstorm_nouveauprojet.md` ouvert et prêt
- [ ] Avoir ce guide (`GUIDE_DEMARRAGE_NOUVEAU_PROJET.md`) ouvert
- [ ] Avoir accès au projet Reboul Store (pour référence)
- [ ] Préparer questions à poser au client

---

## 📋 Phase 1 : Brainstorming avec le Client (30-45 min)

### Étape 1 : Remplir le Brainstorming

1. **Ouvrir** `brainstorm_nouveauprojet.md`
2. **Remplir** toutes les sections avec le client :
   - Informations générales
   - Vision & objectifs
   - Informations e-commerce
   - Design & identité visuelle
   - Paiement & checkout
   - Utilisateurs & authentification
   - Gestion commandes
   - Animations & interactions
   - Stack technique
   - Fonctionnalités spécifiques
   - Sécurité & conformité
   - SEO & marketing
   - Phases de développement
   - Notes & contraintes

3. **Poser les questions** listées dans la section "Questions à Poser"
4. **Valider** que toutes les sections importantes sont remplies

### Étape 2 : Sauvegarder le Brainstorming

1. **Renommer** le fichier : `brainstorm_[nom_projet].md`
2. **Sauvegarder** dans le nouveau projet (ou garder dans Reboul Store pour référence)

---

## 🤖 Phase 2 : Setup Automatique avec l'IA (15-20 min)

### Étape 1 : Créer le Nouveau Projet

1. **Créer** un nouveau dossier pour le projet
2. **Initialiser** Git (optionnel mais recommandé)
3. **Ouvrir** Cursor dans ce nouveau dossier

### Étape 2 : Envoyer le Message à l'IA

**📋 Copier-coller ce message exact dans Cursor Chat** :

```
Bonjour ! Je démarre un nouveau projet e-commerce et j'ai besoin que tu crées toute la structure de base automatiquement.

Voici le brainstorming complété : [COLLER LE CONTENU DE brainstorm_[nom_projet].md ICI]

🎯 TÂCHES À EFFECTUER :

1. **Lire et analyser** le brainstorming complété
2. **Créer tous les fichiers de documentation** nécessaires :
   - ROADMAP_COMPLETE.md (basé sur les phases du brainstorming)
   - CONTEXT.md (contexte projet avec informations du brainstorming)
   - API_CONFIG.md (configuration API standard)
   - frontend/FRONTEND.md (documentation frontend)
   - backend/BACKEND.md (documentation backend)
   - FIGMA_WORKFLOW.md (copier depuis template)
   - ANIMATIONS_GUIDE.md (copier depuis template)
   - ARCHITECTURE_[NOM].md (si multi-sites, sinon adapter)

3. **Créer .cursor/rules/project-rules.mdc** :
   - Copier la structure de .cursor/rules/project-rules.mdc du projet Reboul Store
   - Adapter selon le brainstorming (nom projet, design system, etc.)
   - Garder toute la méthodologie (modes pédagogique/normal, workflows, etc.)

4. **Créer TEMPLATE_CONTEXTE_PROJET.md** :
   - Copier depuis le projet Reboul Store
   - Adapter selon le nouveau projet

5. **Vérifier** que tous les fichiers sont créés et cohérents

📚 RÉFÉRENCES :
- Utiliser TEMPLATE_CONTEXTE_PROJET.md comme base pour la structure
- Utiliser ROADMAP_COMPLETE.md du projet Reboul Store comme référence pour la structure de roadmap
- Utiliser CONTEXT.md du projet Reboul Store comme référence pour la structure de contexte

🎯 MÉTHODOLOGIE À APPLIQUER :
- Mode pédagogique par défaut (tu m'apprends, je code)
- Mode normal si je le demande explicitement
- Workflow Figma → Code (design d'abord, code ensuite)
- Animations GSAP (structure animations/, presets/, components/)
- Documentation continue (mettre à jour ROADMAP_COMPLETE.md après chaque tâche)
- Roadmap comme source de vérité du projet

🚀 COMMENCE PAR :
1. Lire le brainstorming
2. Créer ROADMAP_COMPLETE.md avec les phases adaptées
3. Créer CONTEXT.md avec les informations du brainstorming
4. Créer .cursor/rules/project-rules.mdc
5. Créer les autres fichiers de documentation
6. Me confirmer que tout est créé et prêt

Merci ! 🎉
```

### Étape 3 : Attendre la Création Automatique

L'IA va :
1. ✅ Lire et analyser le brainstorming
2. ✅ Créer `ROADMAP_COMPLETE.md` avec phases adaptées
3. ✅ Créer `CONTEXT.md` avec informations du brainstorming
4. ✅ Créer `.cursor/rules/project-rules.mdc` adapté
5. ✅ Créer tous les fichiers de documentation
6. ✅ Vérifier la cohérence

**Temps estimé** : 5-10 minutes

### Étape 4 : Vérifier les Fichiers Créés

**Checklist de vérification** :

- [ ] `ROADMAP_COMPLETE.md` créé avec phases adaptées
- [ ] `CONTEXT.md` créé avec informations du brainstorming
- [ ] `.cursor/rules/project-rules.mdc` créé et adapté
- [ ] `API_CONFIG.md` créé
- [ ] `frontend/FRONTEND.md` créé
- [ ] `backend/BACKEND.md` créé
- [ ] `FIGMA_WORKFLOW.md` copié
- [ ] `ANIMATIONS_GUIDE.md` copié
- [ ] `ARCHITECTURE_[NOM].md` créé (si multi-sites)
- [ ] `TEMPLATE_CONTEXTE_PROJET.md` copié

---

## 🏗️ Phase 3 : Initialisation Technique (Optionnel - Après Rendez-vous)

### Si vous voulez démarrer le code immédiatement

**📋 Message à envoyer à l'IA** :

```
Parfait ! Maintenant je veux initialiser la structure technique du projet.

🎯 TÂCHES :

1. **Créer la structure de dossiers** :
   - backend/
   - frontend/
   - docker-compose.yml (si Docker)

2. **Initialiser Backend NestJS** :
   - Créer backend/ avec structure NestJS standard
   - Configurer TypeORM
   - Créer entités de base (Product, Category, Variant, Image, Cart, Order, User)
   - Configurer CORS
   - Créer .env avec variables d'environnement

3. **Initialiser Frontend React** :
   - Créer frontend/ avec Vite + React + TypeScript
   - Configurer TailwindCSS
   - Installer shadcn/ui
   - Créer structure de base (pages/, components/, services/, hooks/, etc.)
   - Créer .env avec VITE_API_BASE_URL

4. **Créer docker-compose.yml** (si Docker) :
   - PostgreSQL
   - Backend
   - Frontend

5. **Créer fichiers de configuration** :
   - .gitignore
   - README.md
   - package.json (backend et frontend)

🚀 COMMENCE PAR :
1. Créer la structure de dossiers
2. Initialiser backend NestJS
3. Initialiser frontend React
4. Configurer Docker (si nécessaire)
5. Me donner les commandes pour démarrer

Mode pédagogique : guide-moi pour que je code moi-même.
```

---

## 📝 Template de Message Complet (À Copier-Coller)

### Version Complète avec Brainstorming Intégré

```
Bonjour ! Je démarre un nouveau projet e-commerce et j'ai besoin que tu crées toute la structure de base automatiquement.

📋 BRAINSTORMING COMPLÉTÉ :

[COLLER ICI LE CONTENU COMPLET DE brainstorm_[nom_projet].md]

🎯 TÂCHES À EFFECTUER :

1. **Lire et analyser** le brainstorming complété
2. **Créer tous les fichiers de documentation** nécessaires :
   - ROADMAP_COMPLETE.md (basé sur les phases du brainstorming)
   - CONTEXT.md (contexte projet avec informations du brainstorming)
   - API_CONFIG.md (configuration API standard)
   - frontend/FRONTEND.md (documentation frontend)
   - backend/BACKEND.md (documentation backend)
   - FIGMA_WORKFLOW.md (copier depuis template)
   - ANIMATIONS_GUIDE.md (copier depuis template)
   - ARCHITECTURE_[NOM].md (si multi-sites, sinon adapter)

3. **Créer .cursor/rules/project-rules.mdc** :
   - Copier la structure de .cursor/rules/project-rules.mdc du projet Reboul Store
   - Adapter selon le brainstorming (nom projet, design system, etc.)
   - Garder toute la méthodologie (modes pédagogique/normal, workflows, etc.)

4. **Créer TEMPLATE_CONTEXTE_PROJET.md** :
   - Copier depuis le projet Reboul Store
   - Adapter selon le nouveau projet

5. **Vérifier** que tous les fichiers sont créés et cohérents

📚 RÉFÉRENCES :
- Utiliser TEMPLATE_CONTEXTE_PROJET.md comme base pour la structure
- Utiliser ROADMAP_COMPLETE.md du projet Reboul Store comme référence pour la structure de roadmap
- Utiliser CONTEXT.md du projet Reboul Store comme référence pour la structure de contexte

🎯 MÉTHODOLOGIE À APPLIQUER :
- Mode pédagogique par défaut (tu m'apprends, je code)
- Mode normal si je le demande explicitement
- Workflow Figma → Code (design d'abord, code ensuite)
- Animations GSAP (structure animations/, presets/, components/)
- Documentation continue (mettre à jour ROADMAP_COMPLETE.md après chaque tâche)
- Roadmap comme source de vérité du projet

🚀 COMMENCE PAR :
1. Lire le brainstorming
2. Créer ROADMAP_COMPLETE.md avec les phases adaptées
3. Créer CONTEXT.md avec les informations du brainstorming
4. Créer .cursor/rules/project-rules.mdc
5. Créer les autres fichiers de documentation
6. Me confirmer que tout est créé et prêt

Merci ! 🎉
```

---

## ✅ Checklist Finale

### Après le Rendez-vous

- [ ] Brainstorming complété et sauvegardé
- [ ] Nouveau projet créé (dossier)
- [ ] Message envoyé à l'IA
- [ ] Fichiers de documentation créés par l'IA
- [ ] `.cursor/rules/project-rules.mdc` créé
- [ ] Vérification que tout est cohérent
- [ ] Prêt à démarrer Phase 1 : Infrastructure & Base

### Fichiers à Vérifier

**Documentation** :
- [ ] `ROADMAP_COMPLETE.md` ✅
- [ ] `CONTEXT.md` ✅
- [ ] `API_CONFIG.md` ✅
- [ ] `frontend/FRONTEND.md` ✅
- [ ] `backend/BACKEND.md` ✅
- [ ] `FIGMA_WORKFLOW.md` ✅
- [ ] `ANIMATIONS_GUIDE.md` ✅
- [ ] `ARCHITECTURE_[NOM].md` ✅ (si multi-sites)
- [ ] `TEMPLATE_CONTEXTE_PROJET.md` ✅

**Configuration** :
- [ ] `.cursor/rules/project-rules.mdc` ✅
- [ ] `brainstorm_[nom_projet].md` ✅

---

## 🎯 Prochaines Étapes

Une fois tous les fichiers créés :

1. **Lire** `ROADMAP_COMPLETE.md` pour voir les phases
2. **Commencer** Phase 1 : Infrastructure & Base
3. **Suivre** la roadmap étape par étape
4. **Mettre à jour** `ROADMAP_COMPLETE.md` après chaque tâche

---

## 💡 Conseils

### Pendant le Brainstorming
- ✅ **Être exhaustif** : Mieux vaut trop d'infos que pas assez
- ✅ **Poser des questions** : Ne pas hésiter à clarifier
- ✅ **Documenter tout** : Même les détails qui semblent évidents

### Avec l'IA
- ✅ **Être clair** : Expliquer ce qu'on veut
- ✅ **Vérifier** : Toujours vérifier les fichiers créés
- ✅ **Adapter** : Si quelque chose ne correspond pas, demander à l'IA d'adapter

### Après le Setup
- ✅ **Commencer petit** : Phase 1 d'abord, puis on avance
- ✅ **Suivre la roadmap** : C'est la source de vérité
- ✅ **Documenter** : Mettre à jour après chaque tâche

---

**🚀 Avec ce guide, vous êtes prêt à démarrer n'importe quel projet e-commerce en 1 heure !**

