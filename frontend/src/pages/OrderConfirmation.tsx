import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useCartContext } from '../contexts/CartContext';

/**
 * Page de confirmation de commande après paiement Stripe
 * 
 * Cette page est une version basique qui sera améliorée dans la Phase 12.4
 * avec un design Figma complet.
 */
export const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCartContext();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Vider le panier après paiement réussi
    if (sessionId) {
      clearCart().catch(console.error);
    }
  }, [sessionId, clearCart]);

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <div className="text-center space-y-6">
        <h1 className="font-[Geist] text-3xl font-medium text-black uppercase">
          Commande confirmée
        </h1>
        
        <div className="space-y-4">
          <p className="font-[Geist] text-base text-black/70">
            Merci pour votre commande !
          </p>
          
          {sessionId && (
            <p className="font-[Geist] text-sm text-black/50">
              Numéro de session : {sessionId}
            </p>
          )}
          
          <p className="font-[Geist] text-sm text-black/60">
            Vous recevrez un email de confirmation sous peu.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
          <Link
            to="/"
            className="bg-black text-white px-6 py-3 font-[Geist] text-sm font-medium uppercase hover:bg-black/90 transition-colors"
          >
            Continuer les achats
          </Link>
          
          {/* TODO Phase 14 : Lien vers /orders quand la page sera créée */}
          {/* <Link
            to="/orders"
            className="border border-black text-black px-6 py-3 font-[Geist] text-sm font-medium uppercase hover:bg-black hover:text-white transition-colors"
          >
            Voir mes commandes
          </Link> */}
        </div>
      </div>
    </div>
  );
};
