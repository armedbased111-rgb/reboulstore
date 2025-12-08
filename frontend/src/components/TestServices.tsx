import { useState } from 'react';
import { getCategories, getCategory, getCategoryBySlug } from '../services/categories';
import { getProducts, getProduct, getProductsByCategory } from '../services/products';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../services/cart';
import { createOrder, getOrder } from '../services/orders';
import type { Category, Product, Cart, Order } from '../types/index';

/**
 * Composant de test pour tous les services API métier
 */
export const TestServices = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any>(null);

  // Générer un sessionId pour les tests du panier
  const sessionId = 'test-session-' + Date.now();
  
  // IDs réels créés dans le backend
  const realCategoryId = 'ed4dab6d-92f9-4a35-9dbb-3a7227bb8a1f';
  const realProductId = '4fe992c5-8df9-4c4a-b699-550cc2a1987e';
  const realVariantId = 'b8c000ad-327a-43bf-8a56-5601d9e1826c';

  const handleTest = async (testName: string, testFn: () => Promise<any>) => {
    setLoading(true);
    setError(null);
    setResults(null);
    try {
      const result = await testFn();
      setResults({ testName, result });
      console.log(`✅ ${testName} réussi:`, result);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Erreur inconnue';
      setError(errorMessage);
      console.error(`❌ ${testName} échoué:`, err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Tests des Services API</h1>

      {/* Section Categories */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">📁 Tests Categories</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleTest('getCategories', getCategories)}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Tester getCategories
          </button>
          <button
            onClick={() => handleTest('getCategory (ID)', () => getCategory(realCategoryId))}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Tester getCategory (ID réel)
          </button>
          <button
            onClick={() => handleTest('getCategoryBySlug', () => getCategoryBySlug('vetements-adultes'))}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Tester getCategoryBySlug (réel)
          </button>
        </div>
      </section>

      {/* Section Products */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">🛍️ Tests Products</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleTest('getProducts', () => getProducts())}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Tester getProducts
          </button>
          <button
            onClick={() => handleTest('getProducts (avec filtres)', () => getProducts({ page: 1, limit: 10 }))}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Tester getProducts (filtres)
          </button>
          <button
            onClick={() => handleTest('getProduct (ID)', () => getProduct(realProductId))}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Tester getProduct (ID réel)
          </button>
          <button
            onClick={() => handleTest('getProductsByCategory', () => getProductsByCategory(realCategoryId))}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Tester getProductsByCategory (réel)
          </button>
        </div>
      </section>

      {/* Section Cart */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">🛒 Tests Cart</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => handleTest('getCart', () => getCart(sessionId))}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            Tester getCart
          </button>
          <button
            onClick={() => handleTest('addToCart', () => addToCart(sessionId, realVariantId, 2))}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            Tester addToCart (réel)
          </button>
          <button
            onClick={() => handleTest('updateCartItem', () => updateCartItem('test-item-id', 3, sessionId))}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            Tester updateCartItem
          </button>
          <button
            onClick={() => handleTest('removeCartItem', () => removeCartItem('test-item-id', sessionId))}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            Tester removeCartItem
          </button>
          <button
            onClick={() => handleTest('clearCart', () => clearCart(sessionId))}
            disabled={loading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            Tester clearCart
          </button>
        </div>
        <p className="text-sm text-gray-600">Session ID: {sessionId}</p>
      </section>

      {/* Section Orders */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">📦 Tests Orders</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={async () => {
              // Flux complet : créer panier → ajouter article → créer commande
              try {
                setLoading(true);
                setError(null);
                
                // 1. Créer/récupérer panier
                const cart = await getCart(sessionId);
                console.log('✅ Panier récupéré:', cart);
                
                // 2. Ajouter un article
                const cartItem = await addToCart(sessionId, realVariantId, 2);
                console.log('✅ Article ajouté:', cartItem);
                
                // 3. Récupérer panier mis à jour
                const updatedCart = await getCart(sessionId);
                console.log('✅ Panier mis à jour:', updatedCart);
                
                // 4. Créer commande
                const order = await createOrder({
                  cartId: updatedCart.id,
                  customerInfo: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    phone: '+33612345678',
                    address: {
                      street: '123 Rue Test',
                      city: 'Marseille',
                      postalCode: '13001',
                      country: 'France',
                    },
                  },
                });
                
                setResults({ testName: 'Flux complet (Panier → Commande)', result: order });
                console.log('✅ Commande créée:', order);
              } catch (err: any) {
                const errorMessage = err.response?.data?.message || err.message || 'Erreur inconnue';
                setError(errorMessage);
                console.error('❌ Flux complet échoué:', err);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            Tester Flux Complet (Panier → Commande)
          </button>
        </div>
      </section>

      {/* Résultats */}
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">📊 Résultats</h2>
        {loading && (
          <div className="p-4 bg-blue-100 rounded">
            <p>⏳ Chargement...</p>
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 rounded">
            <p className="text-red-700 font-semibold">❌ Erreur:</p>
            <p className="text-red-600">{error}</p>
          </div>
        )}
        {results && (
          <div className="p-4 bg-green-100 border border-green-400 rounded">
            <p className="text-green-700 font-semibold">✅ {results.testName} réussi!</p>
            <pre className="mt-2 text-sm overflow-auto bg-white p-2 rounded">
              {JSON.stringify(results.result, null, 2)}
            </pre>
          </div>
        )}
      </section>
    </div>
  );
};
