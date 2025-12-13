import { useState } from 'react';
import { X } from 'lucide-react';
import type { Product } from '../../types';

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

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Stocker en localStorage pour MVP
      const notifications = JSON.parse(localStorage.getItem('stockNotifications') || '[]');
      const notification = {
        productId: product.id,
        variantId: variantId || null,
        email: email.trim(),
        phone: phone.trim() || null,
        createdAt: new Date().toISOString(),
      };
      
      // Vérifier si déjà inscrit
      const alreadySubscribed = notifications.some(
        (n: any) => n.productId === product.id && n.email === email.trim()
      );

      if (!alreadySubscribed) {
        notifications.push(notification);
        localStorage.setItem('stockNotifications', JSON.stringify(notifications));
      }

      onSubscribe();
      setEmail('');
      setPhone('');
      onClose();
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
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
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-black rounded-md font-[Geist] text-[14px] leading-[20px] tracking-[-0.35px] focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="votre@email.com"
            />
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

