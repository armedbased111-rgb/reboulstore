import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../../../components/Layout/AdminLayout';
import { reboulUsersService } from '../../../../services/reboul-users.service';
import { User } from '../../../../types/reboul.types';
import { ArrowLeft, RefreshCw, Trash2, MapPin, Package } from 'lucide-react';
import { cn } from '../../../../utils/cn';
import { Link } from 'react-router-dom';

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
 * Badge de rôle avec couleur
 */
function RoleBadge({ role }: { role: string }) {
  const roleStyles: Record<string, string> = {
    CLIENT: 'bg-blue-100 text-blue-800',
    ADMIN: 'bg-purple-100 text-purple-800',
    SUPER_ADMIN: 'bg-red-100 text-red-800',
  };

  const roleLabels: Record<string, string> = {
    CLIENT: 'Client',
    ADMIN: 'Admin',
    SUPER_ADMIN: 'Super Admin',
  };

  const roleKey = role.toUpperCase();

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
        roleStyles[roleKey] || 'bg-gray-100 text-gray-800'
      )}
    >
      {roleLabels[roleKey] || role}
    </span>
  );
}

/**
 * Badge de statut de commande
 */
function OrderStatusBadge({ status }: { status: string }) {
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

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        statusStyles[statusKey] || 'bg-gray-100 text-gray-800'
      )}
    >
      {status}
    </span>
  );
}

/**
 * Page de détails d'un utilisateur Reboul
 * 
 * Route : /admin/reboul/users/:id (protégée)
 */
export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [newRole, setNewRole] = useState<string>('');

  // Charger l'utilisateur
  useEffect(() => {
    const loadUser = async () => {
      if (!id) {
        setError('ID utilisateur manquant');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await reboulUsersService.getUser(id);
        setUser(data);
        setNewRole(data.role);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement de l\'utilisateur');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  // Mettre à jour le rôle
  const handleRoleUpdate = async () => {
    if (!id || !user || newRole === user.role) return;

    setIsUpdating(true);
    try {
      const updatedUser = await reboulUsersService.updateUserRole(id, newRole);
      setUser(updatedUser);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour du rôle');
    } finally {
      setIsUpdating(false);
    }
  };

  // Supprimer l'utilisateur
  const handleDelete = async () => {
    if (!id || !user) return;

    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.email}" ? Cette action est irréversible.`)) {
      return;
    }

    setIsUpdating(true);
    try {
      await reboulUsersService.deleteUser(id);
      navigate('/admin/reboul/users');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression de l\'utilisateur');
      setIsUpdating(false);
    }
  };

  // Rôles disponibles (CLIENT et ADMIN uniquement, pas SUPER_ADMIN depuis l'interface)
  const availableRoles = [
    { value: 'CLIENT', label: 'Client' },
    { value: 'ADMIN', label: 'Admin' },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-sm text-gray-600">Chargement de l'utilisateur...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error && !user) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => navigate('/admin/reboul/users')}
            className="mt-4 px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
          >
            Retour à la liste
          </button>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return null;
  }

  const orders = user.orders || [];
  const addresses = user.addresses || [];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin/reboul/users')}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.email.split('@')[0]}
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Inscrit le {formatDate(user.createdAt)}
              </p>
            </div>
          </div>
          <RoleBadge role={user.role} />
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
            {/* Informations personnelles */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{user.email}</p>
                </div>
                {user.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Téléphone</p>
                    <p className="text-sm font-medium text-gray-900">{user.phone}</p>
                  </div>
                )}
                {user.firstName && (
                  <div>
                    <p className="text-sm text-gray-500">Prénom</p>
                    <p className="text-sm font-medium text-gray-900">{user.firstName}</p>
                  </div>
                )}
                {user.lastName && (
                  <div>
                    <p className="text-sm text-gray-500">Nom</p>
                    <p className="text-sm font-medium text-gray-900">{user.lastName}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">Date d'inscription</p>
                  <p className="text-sm font-medium text-gray-900">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </div>

            {/* Adresses */}
            {addresses.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Adresses</h2>
                  <MapPin className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id || Math.random()} className="border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600 space-y-1">
                        {address.firstName && address.lastName && (
                          <p className="font-medium text-gray-900">
                            {address.firstName} {address.lastName}
                          </p>
                        )}
                        <p>{address.street}</p>
                        <p>
                          {address.postalCode} {address.city}
                        </p>
                        <p>{address.country}</p>
                        {address.phone && <p>{address.phone}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Commandes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Historique des commandes</h2>
                <Package className="w-5 h-5 text-gray-400" />
              </div>
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Link
                      key={order.id}
                      to={`/admin/reboul/orders/${order.id}`}
                      className="block border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Commande #{order.id.substring(0, 8)}
                          </p>
                          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatPrice(order.total)}
                          </p>
                          <OrderStatusBadge status={order.status} />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucune commande</p>
              )}
            </div>
          </div>

          {/* Colonne latérale */}
          <div className="space-y-6">
            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
              
              {/* Changer rôle */}
              {user.role !== 'SUPER_ADMIN' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Changer le rôle
                  </label>
                  <div className="flex space-x-2">
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      {availableRoles.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleRoleUpdate}
                      disabled={isUpdating || newRole === user.role}
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

              {/* Supprimer */}
              <div>
                <button
                  onClick={handleDelete}
                  disabled={isUpdating}
                  className={cn(
                    'w-full px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2',
                    isUpdating && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer le compte</span>
                </button>
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Statistiques</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Nombre de commandes</span>
                  <span className="font-medium text-gray-900">{orders.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Nombre d'adresses</span>
                  <span className="font-medium text-gray-900">{addresses.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Client depuis</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(user.createdAt).split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
