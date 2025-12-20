# 📦 Guide d'Export et Réutilisation du Contexte Projet

**Version** : 1.0  
**Date** : 12 décembre 2025

---

## 🎯 Objectif

Ce guide explique comment exporter et réutiliser tout le contexte de travail (architecture, workflows, règles, méthodologie) développé pour Reboul Store, afin de l'appliquer à de nouveaux projets e-commerce.

---

## 📁 Fichiers Créés

### 1. `TEMPLATE_CONTEXTE_PROJET.md` ⭐
**Usage** : Template réutilisable contenant toute la méthodologie, architecture et workflows

**Contenu** :
- Architecture technique standard (Backend NestJS, Frontend React)
- Structure standard des projets
- Modèles de données standard (entités e-commerce)
- Endpoints API standard
- Workflow Design (Figma → Code)
- Workflow Animations GSAP
- Méthodologie de développement (modes pédagogique/normal)
- Organisation par roadmap
- Documentation continue
- Configuration standard
- Conventions de code
- Checklist démarrage nouveau projet

**Quand l'utiliser** :
- Au démarrage d'un nouveau projet e-commerce
- Pour avoir une référence complète de la méthodologie
- Pour partager le contexte avec l'IA ou l'équipe

### 2. `brainstorm_nouveauprojet.md` ⭐
**Usage** : Template de brainstorming pour nouveaux projets

**Contenu** :
- Informations générales (contexte, client, objectifs)
- Vision & objectifs business/techniques
- Informations e-commerce (type boutique, produits, stock)
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

**Quand l'utiliser** :
- **Avant** de démarrer un nouveau projet
- Lors du brainstorming avec un nouveau client
- Pour collecter toutes les informations nécessaires
- Pour planifier le projet

---

## 🚀 Workflow Complet : Nouveau Projet

### Étape 1 : Brainstorming avec le Client

1. **Ouvrir** `brainstorm_nouveauprojet.md`
2. **Remplir** toutes les sections avec le client
3. **Poser les questions** listées dans la section "Questions à Poser"
4. **Valider** le brainstorming avec le client
5. **Sauvegarder** le fichier (renommer si besoin : `brainstorm_[nom_projet].md`)

### Étape 2 : Préparation du Contexte Projet

1. **Copier** `TEMPLATE_CONTEXTE_PROJET.md` dans le nouveau projet
2. **Renommer** en `CONTEXTE_PROJET.md` (ou garder le nom template)
3. **Adapter** les sections selon le brainstorming :
   - Remplacer nom du projet
   - Adapter stack technique si différent
   - Adapter entités selon besoins spécifiques
   - Adapter ports si différents
   - Adapter architecture (multi-sites ou non)

### Étape 3 : Création de la Roadmap

1. **Créer** `ROADMAP_COMPLETE.md` dans le nouveau projet
2. **Utiliser** la structure de roadmap du projet Reboul Store comme référence
3. **Adapter** les phases selon le brainstorming :
   - Phase 1 : Infrastructure & Base
   - Phase 2 : Catalogue Produits
   - Phase 3 : Panier & Checkout
   - Phase 4 : Authentification & Profil
   - Phase 5 : Admin Panel
   - Phase 6 : Optimisations & Finalisation
4. **Détailler** chaque phase avec les tâches spécifiques au projet

### Étape 4 : Création de la Documentation

1. **Créer** `CONTEXT.md` :
   - Copier structure du CONTEXT.md de Reboul Store
   - Adapter avec informations du brainstorming
   - Définir architecture, stack, état actuel

2. **Créer** `ARCHITECTURE_[NOM].md` (si multi-sites) :
   - Copier `ARCHITECTURE_ADMIN_CENTRAL.md` de Reboul Store
   - Adapter selon architecture du nouveau projet

3. **Créer** `API_CONFIG.md` :
   - Copier structure de `API_CONFIG.md` de Reboul Store
   - Adapter ports et endpoints selon projet

4. **Créer** `frontend/FRONTEND.md` :
   - Copier structure de `frontend/FRONTEND.md` de Reboul Store
   - Adapter pages, composants selon besoins

5. **Créer** `backend/BACKEND.md` :
   - Copier structure de `backend/BACKEND.md` de Reboul Store
   - Adapter modules, entités selon besoins

6. **Copier** les workflows :
   - `FIGMA_WORKFLOW.md` : Workflow Figma → Code (identique)
   - `ANIMATIONS_GUIDE.md` : Guide animations GSAP (identique)

### Étape 5 : Configuration Cursor / IA

1. **Créer** `.cursor/rules/project-rules.mdc` :
   - Copier les règles du projet Reboul Store
   - Adapter selon besoins spécifiques du nouveau projet
   - Garder la structure générale (modes pédagogique/normal, workflows, etc.)

2. **Créer** `.cursor/commands/` (si utilisé) :
   - Copier les commandes du projet Reboul Store
   - Adapter selon besoins

### Étape 6 : Partage avec l'IA

**Lors du premier message avec l'IA sur le nouveau projet** :

1. **Partager** le `brainstorm_nouveauprojet.md` complété
2. **Partager** le `CONTEXTE_PROJET.md` (ou `TEMPLATE_CONTEXTE_PROJET.md`)
3. **Partager** le `ROADMAP_COMPLETE.md`
4. **Dire à l'IA** : 
   ```
   Bonjour ! Je démarre un nouveau projet e-commerce. 
   Voici le brainstorming complété : [lien brainstorm_nouveauprojet.md]
   Voici le contexte projet : [lien CONTEXTE_PROJET.md]
   Voici la roadmap : [lien ROADMAP_COMPLETE.md]
   
   J'aimerais que tu utilises la même méthodologie que pour Reboul Store :
   - Mode pédagogique par défaut
   - Workflow Figma → Code
   - Animations GSAP
   - Documentation continue
   - Roadmap comme source de vérité
   
   On commence par la Phase 1 : Infrastructure & Base
   ```

---

## 📋 Checklist Démarrage Nouveau Projet

### Avant de Commencer
- [ ] Brainstorming complété avec client (`brainstorm_nouveauprojet.md`)
- [ ] Brainstorming validé avec client
- [ ] `TEMPLATE_CONTEXTE_PROJET.md` copié et adapté
- [ ] `ROADMAP_COMPLETE.md` créé et détaillé
- [ ] `CONTEXT.md` créé
- [ ] `ARCHITECTURE_[NOM].md` créé (si multi-sites)
- [ ] `API_CONFIG.md` créé
- [ ] `frontend/FRONTEND.md` créé
- [ ] `backend/BACKEND.md` créé
- [ ] `FIGMA_WORKFLOW.md` copié
- [ ] `ANIMATIONS_GUIDE.md` copié
- [ ] `.cursor/rules/project-rules.mdc` créé
- [ ] Contexte partagé avec l'IA

### Première Session avec l'IA
- [ ] Présenter le projet et le brainstorming
- [ ] Partager les fichiers de contexte
- [ ] Confirmer la méthodologie à utiliser
- [ ] Démarrer Phase 1 : Infrastructure & Base

---

## 🔄 Réutilisation Continue

### Pour Chaque Nouveau Projet

1. **Toujours commencer** par le brainstorming (`brainstorm_nouveauprojet.md`)
2. **Toujours copier** le template de contexte (`TEMPLATE_CONTEXTE_PROJET.md`)
3. **Toujours créer** la roadmap détaillée
4. **Toujours partager** le contexte avec l'IA dès le début

### Mise à Jour des Templates

**Quand mettre à jour** :
- Si nouvelle méthodologie validée sur un projet
- Si nouveau workflow découvert
- Si nouvelle architecture testée
- Si amélioration de la documentation

**Comment mettre à jour** :
1. Tester sur un projet réel
2. Valider que ça fonctionne bien
3. Mettre à jour `TEMPLATE_CONTEXTE_PROJET.md`
4. Mettre à jour `brainstorm_nouveauprojet.md` si besoin
5. Documenter les changements

---

## 💡 Conseils & Bonnes Pratiques

### Brainstorming
- ✅ **Être exhaustif** : Mieux vaut trop d'infos que pas assez
- ✅ **Poser des questions** : Ne pas hésiter à clarifier
- ✅ **Valider avec client** : S'assurer qu'on est aligné
- ✅ **Documenter tout** : Même les détails qui semblent évidents

### Contexte Projet
- ✅ **Adapter intelligemment** : Ne pas copier bêtement, adapter selon besoins
- ✅ **Garder la structure** : La structure générale fonctionne, garder-la
- ✅ **Documenter les changements** : Si on s'écarte du template, documenter pourquoi

### Roadmap
- ✅ **Être réaliste** : Estimer correctement les durées
- ✅ **Détailler les tâches** : Plus c'est détaillé, mieux c'est
- ✅ **Mettre à jour régulièrement** : Cocher les tâches au fur et à mesure

### Partage avec l'IA
- ✅ **Être clair** : Expliquer le contexte et les objectifs
- ✅ **Partager les fichiers** : Donner accès à tous les fichiers de contexte
- ✅ **Confirmer la méthodologie** : S'assurer que l'IA utilise la bonne approche

---

## 📚 Fichiers de Référence

### Dans le Projet Reboul Store
- `ROADMAP_COMPLETE.md` : Exemple de roadmap détaillée
- `CONTEXT.md` : Exemple de contexte projet
- `ARCHITECTURE_ADMIN_CENTRAL.md` : Exemple architecture multi-sites
- `API_CONFIG.md` : Exemple configuration API
- `frontend/FRONTEND.md` : Exemple documentation frontend
- `backend/BACKEND.md` : Exemple documentation backend
- `FIGMA_WORKFLOW.md` : Workflow Figma → Code
- `ANIMATIONS_GUIDE.md` : Guide animations GSAP

### Templates Créés
- `TEMPLATE_CONTEXTE_PROJET.md` : Template contexte réutilisable
- `brainstorm_nouveauprojet.md` : Template brainstorming
- `GUIDE_EXPORT_CONTEXTE.md` : Ce guide

---

## 🎯 Résumé : Workflow Rapide

```
1. Brainstorming avec client
   ↓
2. Remplir brainstorm_nouveauprojet.md
   ↓
3. Copier TEMPLATE_CONTEXTE_PROJET.md → CONTEXTE_PROJET.md
   ↓
4. Adapter CONTEXTE_PROJET.md selon brainstorming
   ↓
5. Créer ROADMAP_COMPLETE.md
   ↓
6. Créer CONTEXT.md, ARCHITECTURE_[NOM].md, API_CONFIG.md, etc.
   ↓
7. Copier workflows (FIGMA_WORKFLOW.md, ANIMATIONS_GUIDE.md)
   ↓
8. Créer .cursor/rules/project-rules.mdc
   ↓
9. Partager tout avec l'IA
   ↓
10. Démarrer Phase 1 : Infrastructure & Base
```

---

**🚀 Avec ce système, vous pouvez démarrer n'importe quel projet e-commerce avec la même méthodologie éprouvée et la même qualité !**


