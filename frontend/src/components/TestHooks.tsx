import { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useProduct } from '../hooks/useProduct';
import { useCategories } from '../hooks/useCategories';
import { useCartContext } from '../contexts/CartContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { ProductQuery } from '../types/index';

/**
 * Composant de test pour tous les hooks personnalisés
 */
export const TestHooks = () => {
  // IDs réels pour les tests (à adapter selon votre base de données)
  const realProductId = '4fe992c5-8df9-4c4a-b699-550cc2a1987e';
  const realVariantId = 'b8c000ad-327a-43bf-8a56-5601d9e1826c';

  // États pour contrôler les tests
  const [testProductId, setTestProductId] = useState<string>('');
  const [testQuery, setTestQuery] = useState<ProductQuery>({ page: 1, limit: 10 });

  // Utiliser tous les hooks
  const products = useProducts(testQuery);
  const product = useProduct(testProductId || undefined);
  const categories = useCategories();
  const cart = useCartContext();
  const [localStorageValue, setLocalStorageValue] = useLocalStorage<string>('test_storage', 'Valeur initiale');

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Tests des Custom Hooks</h1>

      {/* Section useProducts */}
      <section className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">🛍️ Hook useProducts</h2>
        
        <div className="mb-4 space-y-2">
          <div>
            <label className="block text-sm font-medium mb-1">Page:</label>
            <input
              type="number"
              value={testQuery.page || 1}
              onChange={(e) => setTestQuery({ ...testQuery, page: parseInt(e.target.value) || 1 })}
              className="border rounded px-2 py-1 w-20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Limit:</label>
            <input
              type="number"
              value={testQuery.limit || 10}
              onChange={(e) => setTestQuery({ ...testQuery, limit: parseInt(e.target.value) || 10 })}
              className="border rounded px-2 py-1 w-20"
            />
          </div>
          <button
            onClick={() => products.refetch()}
            disabled={products.loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            🔄 Recharger
          </button>
        </div>

        {products.loading && (
          <div className="p-4 bg-blue-100 rounded mb-2">
            <p>⏳ Chargement des produits...</p>
          </div>
        )}
        {products.error && (
          <div className="p-4 bg-red-100 border border-red-400 rounded mb-2">
            <p className="text-red-700 font-semibold">❌ Erreur:</p>
            <p className="text-red-600">{products.error}</p>
          </div>
        )}
        {!products.loading && !products.error && (
          <div className="p-4 bg-green-50 rounded">
            <p className="font-semibold mb-2">✅ {products.products.length} produits chargés</p>
            <p className="text-sm text-gray-600">
              Page {products.page} sur {products.totalPages} | Total: {products.total} produits
            </p>
            {products.products.length > 0 && (
              <ul className="mt-2 text-sm">
                {products.products.slice(0, 3).map((p) => (
                  <li key={p.id}>• {p.name} - {p.price}€</li>
                ))}
                {products.products.length > 3 && <li>...</li>}
              </ul>
            )}
          </div>
        )}
      </section>

      {/* Section useProduct */}
      <section className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">📦 Hook useProduct</h2>
        
        <div className="mb-4 space-y-2">
          <div>
            <label className="block text-sm font-medium mb-1">ID du produit:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={testProductId}
                onChange={(e) => setTestProductId(e.target.value)}
                placeholder="Entrez un ID de produit"
                className="border rounded px-2 py-1 flex-1"
              />
              <button
                onClick={() => setTestProductId(realProductId)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                Utiliser ID réel
              </button>
              <button
                onClick={() => setTestProductId('')}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
              >
                Effacer
              </button>
            </div>
          </div>
        </div>

        {!testProductId && (
          <div className="p-4 bg-gray-100 rounded">
            <p className="text-gray-600">Entrez un ID de produit pour tester</p>
          </div>
        )}
        {testProductId && product.loading && (
          <div className="p-4 bg-blue-100 rounded mb-2">
            <p>⏳ Chargement du produit...</p>
          </div>
        )}
        {testProductId && product.error && (
          <div className="p-4 bg-red-100 border border-red-400 rounded mb-2">
            <p className="text-red-700 font-semibold">❌ Erreur:</p>
            <p className="text-red-600">{product.error}</p>
          </div>
        )}
        {testProductId && !product.loading && !product.error && product.product && (
          <div className="p-4 bg-green-50 rounded">
            <p className="font-semibold mb-2">✅ Produit chargé:</p>
            <div className="text-sm space-y-1">
              <p><strong>Nom:</strong> {product.product.name}</p>
              <p><strong>Prix:</strong> {product.product.price}€</p>
              <p><strong>Description:</strong> {product.product.description?.substring(0, 100)}...</p>
            </div>
          </div>
        )}
      </section>

      {/* Section useCategories */}
      <section className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">📁 Hook useCategories</h2>
        
        <button
          onClick={() => categories.refetch()}
          disabled={categories.loading}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          🔄 Recharger
        </button>

        {categories.loading && (
          <div className="p-4 bg-blue-100 rounded mb-2">
            <p>⏳ Chargement des catégories...</p>
          </div>
        )}
        {categories.error && (
          <div className="p-4 bg-red-100 border border-red-400 rounded mb-2">
            <p className="text-red-700 font-semibold">❌ Erreur:</p>
            <p className="text-red-600">{categories.error}</p>
          </div>
        )}
        {!categories.loading && !categories.error && (
          <div className="p-4 bg-green-50 rounded">
            <p className="font-semibold mb-2">✅ {categories.categories.length} catégories chargées</p>
            <ul className="text-sm space-y-1">
              {categories.categories.map((cat) => (
                <li key={cat.id}>• {cat.name} ({cat.slug})</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Section useCart */}
      <section className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">🛒 Hook useCart</h2>
        
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => cart.refetch()}
            disabled={cart.loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            🔄 Recharger panier
          </button>
          <button
            onClick={async () => {
              try {
                await cart.addToCart(realVariantId, 1);
                alert('✅ Article ajouté au panier!');
              } catch (err) {
                alert('❌ Erreur lors de l\'ajout');
              }
            }}
            disabled={cart.loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            ➕ Ajouter au panier (ID réel)
          </button>
          <button
            onClick={async () => {
              try {
                await cart.clearCart();
                alert('✅ Panier vidé!');
              } catch (err) {
                alert('❌ Erreur lors du vidage');
              }
            }}
            disabled={cart.loading}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            🗑️ Vider panier
          </button>
        </div>

        {cart.loading && (
          <div className="p-4 bg-blue-100 rounded mb-2">
            <p>⏳ Chargement du panier...</p>
          </div>
        )}
        {cart.error && (
          <div className="p-4 bg-red-100 border border-red-400 rounded mb-2">
            <p className="text-red-700 font-semibold">❌ Erreur:</p>
            <p className="text-red-600">{cart.error}</p>
          </div>
        )}
        {!cart.loading && !cart.error && cart.cart && (
          <div className="p-4 bg-green-50 rounded">
            <p className="font-semibold mb-2">✅ Panier chargé</p>
            <div className="text-sm space-y-2">
              <p><strong>Total:</strong> {cart.total}€</p>
              <p><strong>Nombre d'articles:</strong> {cart.cart.items.length}</p>
              {cart.cart.items.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {cart.cart.items.map((item) => (
                    <li key={item.id} className="flex justify-between items-center">
                      <span>• {item.variant?.product?.name || 'Produit'} - Qty: {item.quantity}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            try {
                              await cart.updateItem(item.id, item.quantity + 1);
                            } catch (err) {
                              alert('❌ Erreur');
                            }
                          }}
                          className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                        >
                          +1
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await cart.removeItem(item.id);
                            } catch (err) {
                              alert('❌ Erreur');
                            }
                          }}
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                        >
                          🗑️
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {cart.cart.items.length === 0 && (
                <p className="text-gray-600">Panier vide</p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Section useLocalStorage */}
      <section className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">💾 Hook useLocalStorage</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Valeur stockée:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={localStorageValue}
                onChange={(e) => setLocalStorageValue(e.target.value)}
                className="border rounded px-2 py-1 flex-1"
              />
              <button
                onClick={() => setLocalStorageValue('Valeur par défaut')}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Reset
              </button>
            </div>
          </div>
          <div className="p-4 bg-green-50 rounded">
            <p className="font-semibold mb-2">✅ Valeur persistée:</p>
            <p className="text-sm text-gray-700">
              La valeur est sauvegardée dans localStorage avec la clé "test_storage".
              Rechargez la page pour vérifier que la valeur persiste!
            </p>
            <p className="mt-2 font-mono text-sm bg-white p-2 rounded">
              {localStorageValue}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
