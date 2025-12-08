# 🐛 Correction Bug : Services retournant `undefined`

## Problème identifié

Tous les services API retournaient `undefined` au lieu des données attendues.

## Cause racine

Dans `api.ts`, les fonctions utilitaires (`api.get()`, `api.post()`, etc.) retournent **déjà** `response.data` :

```typescript
// api.ts (lignes 91-93)
export const api = {
  get: async <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    return response.data as any;  // ✅ Retourne directement les données
  },
  // ...
};
```

Mais dans les services, on essayait d'accéder à `.data` une seconde fois :

```typescript
// categories.ts (AVANT - ❌ INCORRECT)
export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories');
    return response.data;  // ❌ response est déjà les données, pas l'objet AxiosResponse
}
```

Résultat : `response.data` était `undefined` car `response` contenait déjà les données (un array), et les arrays n'ont pas de propriété `.data`.

## Solution appliquée

Retourner directement le résultat de `api.get()` sans accéder à `.data` :

```typescript
// categories.ts (APRÈS - ✅ CORRECT)
export const getCategories = async (): Promise<Category[]> => {
    return await api.get<Category[]>('/categories');  // ✅ Direct
}
```

## Services corrigés

### ✅ categories.ts
- `getCategories()`
- `getCategory(id)`
- `getCategoryBySlug(slug)`

### ✅ products.ts
- `getProducts(query?)`
- `getProduct(id)`
- `getProductsByCategory(categoryId, query?)`

### ✅ cart.ts
- `getCart(sessionId)`
- `addToCart(sessionId, variantId, quantity)`
- `updateCartItem(itemId, quantity, sessionId)`

### ✅ orders.ts
- `createOrder(dto)`
- `getOrder(id)`

## Architecture de l'API Client

```
┌─────────────────────────────────────────────────────────────┐
│                         Service                              │
│  (categories.ts, products.ts, cart.ts, orders.ts)           │
│                                                               │
│  return await api.get<Category[]>('/categories')            │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                      api.get()                               │
│                     (api.ts)                                 │
│                                                               │
│  const response = await apiClient.get(url, config)          │
│  return response.data  ◄── Retourne directement les données │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                   apiClient (Axios)                          │
│                                                               │
│  Intercepteurs request/response                              │
│  Gestion erreurs                                             │
│  Loading manager                                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend NestJS                            │
│                  http://localhost:3001                       │
└─────────────────────────────────────────────────────────────┘
```

## Résultat

Maintenant, les tests affichent les vraies données au lieu de `undefined` :

```
✅ getCategories réussi: [
  {
    "id": "ed4dab6d-92f9-4a35-9dbb-3a7227bb8a1f",
    "name": "Vêtements Adultes",
    "slug": "vetements-adultes",
    ...
  }
]
```

## Leçon apprise

Lorsqu'on utilise des wrappers autour d'Axios, il faut bien comprendre ce que retourne chaque couche :

1. **axios.get()** → Retourne `AxiosResponse` (avec `.data`, `.status`, `.headers`, etc.)
2. **api.get()** (notre wrapper) → Retourne directement les données (`response.data`)
3. **Services** → Utilisent `api.get()` et retournent directement le résultat

## Tests validés ✅

Après correction, tous les tests passent avec succès et affichent les vraies données :

- ✅ getCategories
- ✅ getCategory
- ✅ getCategoryBySlug
- ✅ getProducts
- ✅ getProduct
- ✅ getProductsByCategory
- ✅ getCart
- ✅ addToCart
- ✅ clearCart
- ✅ Flux complet (Panier → Commande)
