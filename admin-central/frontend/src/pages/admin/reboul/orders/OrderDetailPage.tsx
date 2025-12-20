import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../../components/Layout/AdminLayout';
import { reboulOrdersService } from '../../../../services/reboul-orders.service';
import { Order, Address } from '../../../../types/reboul.types';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { cn } from '../../../../utils/cn';

/**
 * Format du prix en euros
 */
function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

/**
 * Format de la date
 */
function formatDate(dateString: string | undefined): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

/**
 * Format de l'adresse
 */
function formatAddress(address: Address | undefined): string {
  if (!address) return '—';
  const parts = [
    address.street,
    address.postalCode && address.city ? `${address.postalCode} ${address.city}` : address.city,
    address.country,
  ].filter(Boolean);
  return parts.join(', ');
}

/**
 * Badge de statut avec couleur
 */
function StatusBadge({ status }: { status: string }) {
  const statusKey = status.toUpperCase();
  
  const statusStyles: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-purple-100 text-purple-800',
    SHIPPED: 'bg-indigo-100 text-indigo-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
  };

  const statusLabels: Record<string, string> = {
    PENDING: 'En attente',
    PAID: 'Payée',
    PROCESSING: 'En traitement',
    SHIPPED: 'Expédiée',
    DELIVERED: 'Livrée',
    CANCELLED: 'Annulée',
    REFUNDED: 'Remboursée',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
        statusStyles[statusKey] || 'bg-gray-100 text-gray-800'
      )}
    >
      {statusLabels[statusKey] || status}
    </span>
  );
}

/**
 * Page de détails d'une commande Reboul
 * 
 * Route : /admin/reboul/orders/:id (protégée)
 */
export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [trackingNumber, setTrackingNumber] = useState<string>('');
  const [isSavingTracking, setIsSavingTracking] = useState(false);

  // Statuts disponibles selon le statut actuel
  const getAvailableStatuses = (currentStatus: string): Array<{ value: string; label: string }> => {
    const statusMap: Record<string, Array<{ value: string; label: string }>> = {
      pending: [
        { value: 'paid', label: 'Payée' },
        { value: 'cancelled', label: 'Annulée' },
      ],
      paid: [
        { value: 'processing', label: 'En traitement' },
        { value: 'cancelled', label: 'Annulée' },
        { value: 'refunded', label: 'Remboursée' },
      ],
      processing: [
        { value: 'shipped', label: 'Expédiée' },
        { value: 'cancelled', label: 'Annulée' },
      ],
      shipped: [
        { value: 'delivered', label: 'Livrée' },
      ],
    };

    return statusMap[currentStatus.toLowerCase()] || [];
  };

  // Charger la commande
  useEffect(() => {
    const loadOrder = async () => {
      if (!id) {
        setError('ID commande manquant');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await reboulOrdersService.getOrder(id);
        setOrder(data);
        setNewStatus(data.status);
        setTrackingNumber(data.trackingNumber || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement de la commande');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id]);

  // Mettre à jour le statut
  const handleStatusUpdate = async () => {
    if (!id || !order || newStatus === order.status) return;

    setIsUpdating(true);
    try {
      const updatedOrder = await reboulOrdersService.updateOrderStatus(id, newStatus);
      setOrder(updatedOrder);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du statut');
    } finally {
      setIsUpdating(false);
    }
  };

  // Ajouter un numéro de tracking
  const handleTrackingSave = async () => {
    if (!id || !order || !trackingNumber.trim()) return;

    setIsSavingTracking(true);
    try {
      const updatedOrder = await reboulOrdersService.addTracking(id, trackingNumber.trim());
      setOrder(updatedOrder);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout du numéro de suivi');
    } finally {
      setIsSavingTracking(false);
    }
  };

  // Récupérer les items de la commande
  const getOrderItems = (order: Order) => {
    // Si la commande a des items directement (Stripe Checkout)
    if (order.items && order.items.length > 0) {
      return order.items;
    }
    // Sinon, récupérer depuis le cart
    if (order.cart?.items) {
      return order.cart.items;
    }
    return [];
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-sm text-gray-600">Chargement de la commande...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error && !order) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => navigate('/admin/reboul/orders')}
            className="mt-4 px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
          >
            Retour à la liste
          </button>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return null;
  }

  const items = getOrderItems(order);
  const availableStatuses = getAvailableStatuses(order.status);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/reboul/orders')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Commande #{order.id.substring(0, 8)}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Créée le {formatDate(order.createdAt)}
              </p>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations client */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Informations client</h2>
              <div className="space-y-3">
                {order.user ? (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Nom</p>
                      <p className="text-sm font-medium text-gray-900">
                        {order.user.firstName} {order.user.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-sm font-medium text-gray-900">{order.user.email}</p>
                    </div>
                  </>
                ) : order.customerInfo ? (
                  <>
                    {order.customerInfo.name && (
                      <div>
                        <p className="text-sm text-gray-500">Nom</p>
                        <p className="text-sm font-medium text-gray-900">{order.customerInfo.name}</p>
                      </div>
                    )}
                    {order.customerInfo.email && (
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900">{order.customerInfo.email}</p>
                      </div>
                    )}
                    {order.customerInfo.phone && (
                      <div>
                        <p className="text-sm text-gray-500">Téléphone</p>
                        <p className="text-sm font-medium text-gray-900">{order.customerInfo.phone}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Informations client non disponibles</p>
                )}
              </div>
            </div>

            {/* Adresses */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Adresses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Livraison</h3>
                  {order.shippingAddress ? (
                    <div className="text-sm text-gray-600 space-y-1">
                      {order.shippingAddress.firstName && order.shippingAddress.lastName && (
                        <p className="font-medium text-gray-900">
                          {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                        </p>
                      )}
                      <p>{formatAddress(order.shippingAddress)}</p>
                      {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Non renseignée</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Facturation</h3>
                  {order.billingAddress ? (
                    <div className="text-sm text-gray-600 space-y-1">
                      {order.billingAddress.firstName && order.billingAddress.lastName && (
                        <p className="font-medium text-gray-900">
                          {order.billingAddress.firstName} {order.billingAddress.lastName}
                        </p>
                      )}
                      <p>{formatAddress(order.billingAddress)}</p>
                      {order.billingAddress.phone && <p>{order.billingAddress.phone}</p>}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Non renseignée</p>
                  )}
                </div>
              </div>
            </div>

            {/* Articles */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Articles</h2>
              {items.length > 0 ? (
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {item.variant?.product?.name || 'Produit'}
                        </p>
                        {item.variant && (
                          <p className="text-sm text-gray-500">
                            {[item.variant.size, item.variant.color].filter(Boolean).join(' - ')}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">Quantité : {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {item.variant?.price
                            ? formatPrice(item.variant.price * item.quantity)
                            : '—'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucun article</p>
              )}
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
              
              {/* Changer statut */}
              {availableStatuses.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Changer le statut
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value={order.status}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </option>
                      {availableStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleStatusUpdate}
                      disabled={isUpdating || newStatus === order.status}
                      className={cn(
                        'px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed',
                        isUpdating && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      {isUpdating ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        'Appliquer'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Numéro de tracking */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de suivi
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Ex: 1Z999AA10123456784"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                  <button
                    onClick={handleTrackingSave}
                    disabled={isSavingTracking || !trackingNumber.trim() || trackingNumber === order.trackingNumber}
                    className={cn(
                      'px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed',
                      isSavingTracking && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isSavingTracking ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      'Enregistrer'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Récapitulatif */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Récapitulatif</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium text-gray-900">{formatPrice(order.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium text-gray-900">Incluse</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between">
                  <span className="text-base font-medium text-gray-900">Total</span>
                  <span className="text-base font-semibold text-gray-900">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Suivi</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Commande créée</p>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                {order.paidAt && (
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Payée</p>
                      <p className="text-sm text-gray-500">{formatDate(order.paidAt)}</p>
                    </div>
                  </div>
                )}
                {order.shippedAt && (
                  <div className="flex items-start space-x-3">
                    <Truck className="w-5 h-5 text-indigo-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Expédiée</p>
                      <p className="text-sm text-gray-500">{formatDate(order.shippedAt)}</p>
                      {order.trackingNumber && (
                        <p className="text-sm text-gray-600 mt-1">
                          Suivi : {order.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {order.deliveredAt && (
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Livrée</p>
                      <p className="text-sm text-gray-500">{formatDate(order.deliveredAt)}</p>
                    </div>
                  </div>
                )}
                {(order.status === 'cancelled' || order.status === 'refunded') && (
                  <div className="flex items-start space-x-3">
                    <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {order.status === 'cancelled' ? 'Annulée' : 'Remboursée'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
