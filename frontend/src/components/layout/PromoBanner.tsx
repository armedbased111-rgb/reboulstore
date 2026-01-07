import { useState, useEffect } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { getActiveCoupons, type Coupon } from '../../services/coupons.service';

/**
 * Composant PromoBanner - Bannière promotionnelle en haut de page
 * Affiche les codes promo actifs depuis l'API avec rotation automatique
 * Style inspiré A-COLD-WALL* : Bannière noire avec texte blanc, bouton Close
 * La fermeture est mémorisée dans localStorage
 * 
 * Rotation : Si plusieurs coupons actifs, affiche un coupon à la fois et change toutes les 7 secondes
 */
export const PromoBanner = () => {
  // Mémoriser la fermeture dans localStorage
  const [isClosed, setIsClosed] = useLocalStorage<boolean>('promoBannerClosed', false);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Récupérer les coupons actifs au chargement et à chaque actualisation
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const activeCoupons = await getActiveCoupons();
        setCoupons(activeCoupons);
        // Réinitialiser l'index si on a de nouveaux coupons
        if (activeCoupons.length > 0) {
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des coupons:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();

    // Rafraîchir les coupons toutes les 30 secondes pour avoir les derniers coupons actifs
    const refreshInterval = setInterval(fetchCoupons, 30000);

    return () => clearInterval(refreshInterval);
  }, []);

  // Rotation automatique des coupons toutes les 7 secondes
  useEffect(() => {
    if (coupons.length <= 1) return; // Pas besoin de rotation si 0 ou 1 coupon

    const rotationInterval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % coupons.length);
    }, 7000); // 7 secondes

    return () => clearInterval(rotationInterval);
  }, [coupons.length]);

  // Si la bannière est fermée, ne rien afficher
  if (isClosed) return null;

  // Si pas de coupons actifs, ne rien afficher
  if (!loading && coupons.length === 0) return null;

  // Formater le texte du coupon
  const formatCouponText = (coupon: Coupon): string => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.code} - ${coupon.discountValue}% OFF`;
    } else {
      return `${coupon.code} - ${coupon.discountValue}€ OFF`;
    }
  };

  // Afficher le coupon actuel (rotation si plusieurs coupons)
  const currentCoupon = coupons[currentIndex];
  const displayText = currentCoupon ? formatCouponText(currentCoupon) : '';

  return (
    <div className="bg-[#1D1D1D] text-white py-2 px-4 flex items-center justify-between">
      {/* Texte promotionnel */}
      <div className="flex-1 text-left">
        {loading ? (
          <span className="uppercase text-sm font-medium tracking-wide">
            Chargement...
          </span>
        ) : (
          <span 
            className="uppercase text-sm font-medium tracking-wide transition-opacity duration-500"
            key={currentCoupon?.id} // Force le re-render pour l'animation
          >
            {displayText}
          </span>
        )}
      </div>

      {/* Bouton Close */}
      <button
        onClick={() => setIsClosed(true)}
        className="ml-4 text-white hover:opacity-70 transition-opacity uppercase text-sm font-medium tracking-wide"
        aria-label="Fermer la bannière"
      >
        CLOSE
      </button>
    </div>
  );
};
