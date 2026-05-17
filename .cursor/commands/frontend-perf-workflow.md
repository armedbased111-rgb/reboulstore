# frontend-perf-workflow

**Commande** : `/frontend-perf-workflow`

Checklist et workflow pour **améliorer la performance frontend** (temps de chargement, rendu, UX fluide) en respectant ton design A‑COLD‑WALL*.

---

## 1. Où regarder en premier

1. **Pages les plus importantes** :
   - `frontend/src/pages/Home.tsx`
   - `frontend/src/pages/Catalog.tsx`
   - `frontend/src/pages/Product.tsx`
   - `frontend/src/pages/Checkout.tsx`

2. **Composants lourds** :
   - Grilles de produits (`ProductGrid`, `ProductCard`, etc.)
   - Carrousels / Swiper (`ProductGallery`)
   - Sections avec beaucoup d’images / vidéos (Hero, brands, etc.)

3. **Services API** :
   - `frontend/src/services/products.ts`
   - `frontend/src/services/categories.ts`
   - `frontend/src/services/checkout.ts`

---

## 2. Checklist performance (simple)

### A. Chargement initial

- [ ] Page Home : pas d’appels API inutiles au mount.  
- [ ] Page Catalog : pagination ou “lazy loading”, pas 1000 produits d’un coup.  
- [ ] Fonts : fichiers Geist bien chargés (pas 3 double imports).  
- [ ] CSS : Tailwind bien tree‑shaké (Vite s’en charge si config OK).

### B. Images & médias

- [ ] Utiliser des résolutions adaptées (pas d’images 4000px pour des vignettes).  
- [ ] Prévoir plus tard : migration vers Cloudinary (voir roadmap + `obsidian-vault/REBOUL.md`).  
- [ ] Éviter les vidéos auto‑play lourdes sur mobile (ou prévoir fallback).

### C. Composants React

- [ ] Éviter les re‑rendus inutiles (props stables, `React.memo` si besoin).  
- [ ] Sortir la logique lourde dans des hooks (`useXXX`) plutôt que dans le JSX.  
- [ ] Pas de `console.log` spammé dans les renders.

### D. Animations

- [ ] Utiliser GSAP de manière ciblée (voir `/animation-workflow`).  
- [ ] Respecter `prefers-reduced-motion`.  
- [ ] Pas d’animations sur tout le layout au scroll qui bloquent le rendu.

---

## 3. Workflow d’optimisation concrète

1. **Identifier la page** : quelle page est lente / saccade ?  
2. **Mesurer grossièrement** :
   - Ouvrir DevTools → onglet **Performance** / **Network**.
   - Regarder :
     - Nombre de requêtes
     - Poids total chargé
     - Temps du premier rendu.
3. **Lister les suspects** :
   - Composant avec beaucoup de listes ?  
   - Beaucoup d’images ?  
   - Appel API en boucle ?
4. **Brainstorm rapide** :
   - Tu peux utiliser `/brainstorm-topic perf [page]` pour co‑réfléchir sur les options.
5. **Implémenter les améliorations** en suivant :
   - `/frontend-workflow` (pour la structure, composants, services).
   - `/animation-workflow` (si lié aux animations).

---

## 🔗 Commandes associées

- `/getcontext frontend` : Doc frontend + routes + services.  
- `/frontend-workflow` : Workflow général frontend.  
- `/animation-workflow` : Si les perfs sont liées aux animations GSAP.  
- `/brainstorm-topic perf [page]` : Pour un brainstorm guidé sur la performance d’une page précise.


