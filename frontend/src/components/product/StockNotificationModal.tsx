import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { Product } from '../../types';
import { stockNotificationsService } from '../../services/stock-notifications.service';
import { useToast } from '../../contexts/ToastContext';

interface StockNotificationModalProps {
  product: Product;
  variantId?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

/**
 * Composant StockNotificationModal - Modal pour s'inscrire aux notifications de rupture de stock
 * 
 * Permet à l'utilisateur de s'inscrire pour être notifié quand le produit sera de nouveau disponible
 * Stockage en localStorage pour MVP (backend à venir)
 */
export const StockNotificationModal = ({
  product,
  variantId,
  isOpen,
  onClose,
  onSubscribe,
}: StockNotificationModalProps) => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAlreadySubscribed, setIsAlreadySubscribed] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const { showToast } = useToast();

  // Réinitialiser l'état quand le modal se ferme
  useEffect(() => {
    if (!isOpen) {
      setEmail('');
      setPhone('');
      setIsAlreadySubscribed(false);
      setIsChecking(false);
    }
  }, [isOpen]);

  const checkSubscription = async () => {
    if (!email.trim()) {
      setIsAlreadySubscribed(false);
      return;
    }

    setIsChecking(true);
    try {
      const result = await stockNotificationsService.checkSubscription(
        product.id,
        email.trim(),
        variantId,
      );
      setIsAlreadySubscribed(result.isSubscribed);
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      setIsAlreadySubscribed(false);
    } finally {
      setIsChecking(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return;
    }

    // Vérifier si déjà inscrit
    if (isAlreadySubscribed) {
      showToast({ message: 'Vous êtes déjà inscrit aux notifications pour ce produit' });
      onClose();
      return;
    }

    setIsSubmitting(true);
    
    try {
      await stockNotificationsService.subscribe(product.id, {
        email: email.trim(),
        phone: phone.trim() || undefined,
        variantId: variantId || undefined,
      });

      showToast({ message: 'Vous serez notifié quand ce produit sera de nouveau disponible' });
      onSubscribe();
      setEmail('');
      setPhone('');
      setIsAlreadySubscribed(false);
      onClose();
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      const errorMessage = error.response?.data?.message || 'Une erreur est survenue lors de l\'inscription';
      showToast({ message: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-[10px] p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-[Geist] font-medium text-[18px] leading-[24px] tracking-[-0.35px] uppercase text-black">
            Soyez notifié
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <p className="font-[Geist] text-[14px] leading-[20px] tracking-[-0.35px] text-gray-600 mb-6">
          Soyez notifié par email quand <strong>{product.name}</strong> sera de nouveau disponible.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block font-[Geist] text-[12px] leading-[16px] tracking-[-0.35px] uppercase text-black mb-2"
            >
              Email *
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                // Reset l'état d'inscription seulement si on change l'email
                if (isAlreadySubscribed) {
                  setIsAlreadySubscribed(false);
                }
              }}
              onBlur={checkSubscription}
              required
              disabled={isChecking}
              autoFocus
              className="w-full px-4 py-2 border border-black rounded-md font-[Geist] text-[14px] leading-[20px] tracking-[-0.35px] focus:outline-none focus:ring-2 focus:ring-black disabled:opacity-50"
              placeholder="votre@email.com"
            />
            {isChecking && (
              <p className="text-xs text-gray-500 mt-1">Vérification...</p>
            )}
            {isAlreadySubscribed && !isChecking && (
              <p className="text-xs text-green-600 mt-1">✓ Vous êtes déjà inscrit aux notifications</p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block font-[Geist] text-[12px] leading-[16px] tracking-[-0.35px] uppercase text-black mb-2"
            >
              Téléphone (optionnel)
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 border border-black rounded-md font-[Geist] text-[14px] leading-[20px] tracking-[-0.35px] focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="06 12 34 56 78"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 px-6 border border-black rounded-md font-[Geist] text-[14px] leading-[20px] tracking-[-0.35px] uppercase text-black hover:bg-gray-100 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!email.trim() || isSubmitting}
              className="flex-1 py-2.5 px-6 rounded-md font-[Geist] text-[14px] leading-[20px] tracking-[-0.35px] uppercase text-white bg-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
            >
              {isSubmitting ? 'Inscription...' : "M'alerter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

