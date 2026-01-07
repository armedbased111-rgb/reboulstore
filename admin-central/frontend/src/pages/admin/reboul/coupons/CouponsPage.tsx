import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../../components/Layout/AdminLayout';
import { reboulCouponsService, Coupon } from '../../../../services/reboul-coupons.service';
import { Plus, Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { cn } from '../../../../utils/cn';

/**
 * Format de la date
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Vérifie si un coupon est actif
 */
function isCouponActive(coupon: Coupon): boolean {
  if (!coupon.isActive) return false;
  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) return false;
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) return false;
  return true;
}

/**
 * Format de la réduction
 */
function formatDiscount(coupon: Coupon): string {
  if (coupon.discountType === 'percentage') {
    return `${coupon.discountValue}%`;
  } else {
    return `${coupon.discountValue}€`;
  }
}

/**
 * Page de gestion des coupons Reboul
 * 
 * Route : /admin/reboul/coupons (protégée)
 */
export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadCoupons = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reboulCouponsService.getCoupons();
      setCoupons(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur lors du chargement'));
      console.error('Erreur lors du chargement des coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleDelete = async (id: string, code: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le coupon "${code}" ?`)) {
      return;
    }

    try {
      await reboulCouponsService.deleteCoupon(id);
      loadCoupons();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert('Erreur lors de la suppression du coupon');
    }
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">
            Erreur lors du chargement des coupons : {error.message}
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Codes Promo Reboul</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gérer les codes promo et réductions
            </p>
          </div>
          <Link
            to="/admin/reboul/coupons/new"
            className={cn(
              'inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors w-full sm:w-auto'
            )}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau coupon
          </Link>
        </div>

        {/* Tableau coupons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-sm text-gray-600">Chargement des coupons...</p>
            </div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">Aucun coupon trouvé</p>
            </div>
          ) : (
            <>
              {/* Desktop/Tablette : Tableau */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Réduction
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Utilisations
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Expiration
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Date création
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {coupons.map((coupon) => {
                      const active = isCouponActive(coupon);
                      return (
                        <tr key={coupon.id} className="hover:bg-gray-50">
                          <td className="px-4 lg:px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{coupon.code}</div>
                            {coupon.minPurchaseAmount && (
                              <div className="text-xs text-gray-500">
                                Min: {coupon.minPurchaseAmount}€
                              </div>
                            )}
                          </td>
                          <td className="px-4 lg:px-6 py-4 text-sm text-gray-900 font-medium">
                            {formatDiscount(coupon)}
                          </td>
                          <td className="px-4 lg:px-6 py-4">
                            <div className="flex items-center">
                              {active ? (
                                <>
                                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                                  <span className="text-xs text-green-700">Actif</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 text-red-500 mr-1" />
                                  <span className="text-xs text-red-700">Inactif</span>
                                </>
                              )}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                            {coupon.usedCount} / {coupon.maxUses === 0 ? '∞' : coupon.maxUses}
                          </td>
                          <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                            {coupon.expiresAt ? (
                              <div className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatDate(coupon.expiresAt)}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400">Sans limite</span>
                            )}
                          </td>
                          <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                            {coupon.createdAt ? formatDate(coupon.createdAt) : '—'}
                          </td>
                          <td className="px-4 lg:px-6 py-4 text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Link
                                to={`/admin/reboul/coupons/${coupon.id}/edit`}
                                className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded"
                                title="Modifier"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              <button
                                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                                title="Supprimer"
                                onClick={() => handleDelete(coupon.id, coupon.code)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile : Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {coupons.map((coupon) => {
                  const active = isCouponActive(coupon);
                  return (
                    <div key={coupon.id} className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900">{coupon.code}</h3>
                          <p className="mt-1 text-sm text-gray-600">
                            Réduction: {formatDiscount(coupon)}
                          </p>
                          {coupon.minPurchaseAmount && (
                            <p className="mt-1 text-xs text-gray-500">
                              Minimum: {coupon.minPurchaseAmount}€
                            </p>
                          )}
                        </div>
                        <div className="flex items-center ml-4">
                          {active ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500">Utilisations</span>
                          <p className="font-medium text-gray-900">
                            {coupon.usedCount} / {coupon.maxUses === 0 ? '∞' : coupon.maxUses}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Expiration</span>
                          <p className="font-medium text-gray-900">
                            {coupon.expiresAt ? formatDate(coupon.expiresAt) : 'Sans limite'}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link
                          to={`/admin/reboul/coupons/${coupon.id}/edit`}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Modifier
                        </Link>
                        <button
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100"
                          onClick={() => handleDelete(coupon.id, coupon.code)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

