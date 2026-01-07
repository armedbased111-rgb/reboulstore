import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../../../components/Layout/AdminLayout';
import { reboulCouponsService, CreateCouponDto } from '../../../../services/reboul-coupons.service';

/**
 * Page de création d'un coupon Reboul
 * 
 * Route : /admin/reboul/coupons/new (protégée)
 */
export default function CreateCouponPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateCouponDto>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    expiresAt: '',
    maxUses: 0,
    minPurchaseAmount: undefined,
    isActive: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const dataToSend: CreateCouponDto = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        expiresAt: formData.expiresAt || undefined,
        minPurchaseAmount: formData.minPurchaseAmount || undefined,
        maxUses: formData.maxUses || 0,
      };
      
      await reboulCouponsService.createCoupon(dataToSend);
      navigate('/admin/reboul/coupons');
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de la création du coupon');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/reboul/coupons');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Nouveau coupon</h1>
          <p className="mt-1 text-sm text-gray-600">
            Créer un nouveau code promo pour Reboul Store
          </p>
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Code */}
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
              Code promo <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              placeholder="EXEMPLE10"
            />
            <p className="mt-1 text-xs text-gray-500">Le code sera automatiquement converti en majuscules</p>
          </div>

          {/* Type de réduction */}
          <div>
            <label htmlFor="discountType" className="block text-sm font-medium text-gray-700 mb-2">
              Type de réduction <span className="text-red-500">*</span>
            </label>
            <select
              id="discountType"
              value={formData.discountType}
              onChange={(e) => setFormData({ ...formData, discountType: e.target.value as 'percentage' | 'fixed_amount' })}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="percentage">Pourcentage (%)</option>
              <option value="fixed_amount">Montant fixe (€)</option>
            </select>
          </div>

          {/* Valeur de réduction */}
          <div>
            <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700 mb-2">
              Valeur de réduction <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="discountValue"
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
              required
              min="0"
              max={formData.discountType === 'percentage' ? 100 : undefined}
              step={formData.discountType === 'percentage' ? 1 : 0.01}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.discountType === 'percentage' 
                ? 'Entre 0 et 100%' 
                : 'Montant en euros (ex: 10.50)'}
            </p>
          </div>

          {/* Date d'expiration */}
          <div>
            <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700 mb-2">
              Date d'expiration (optionnel)
            </label>
            <input
              type="datetime-local"
              id="expiresAt"
              value={formData.expiresAt}
              onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">Laissez vide pour aucune expiration</p>
          </div>

          {/* Nombre max d'utilisations */}
          <div>
            <label htmlFor="maxUses" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre max d'utilisations
            </label>
            <input
              type="number"
              id="maxUses"
              value={formData.maxUses}
              onChange={(e) => setFormData({ ...formData, maxUses: parseInt(e.target.value) || 0 })}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">0 = illimité</p>
          </div>

          {/* Montant minimum d'achat */}
          <div>
            <label htmlFor="minPurchaseAmount" className="block text-sm font-medium text-gray-700 mb-2">
              Montant minimum d'achat (optionnel)
            </label>
            <input
              type="number"
              id="minPurchaseAmount"
              value={formData.minPurchaseAmount || ''}
              onChange={(e) => setFormData({ ...formData, minPurchaseAmount: e.target.value ? parseFloat(e.target.value) : undefined })}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <p className="mt-1 text-xs text-gray-500">Montant minimum en euros pour utiliser ce coupon</p>
          </div>

          {/* Statut actif */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
              Coupon actif
            </label>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Création...' : 'Créer le coupon'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

