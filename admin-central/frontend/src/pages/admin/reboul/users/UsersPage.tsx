import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../../../components/Layout/AdminLayout';
import { useReboulUsers } from '../../../../hooks/useReboulUsers';
import { Search, Eye, User as UserIcon } from 'lucide-react';
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
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        roleStyles[roleKey] || 'bg-gray-100 text-gray-800'
      )}
    >
      {roleLabels[roleKey] || role}
    </span>
  );
}

/**
 * Page de gestion des utilisateurs Reboul
 * 
 * Route : /admin/reboul/users (protégée)
 * 
 * Affiche :
 * - Liste des utilisateurs avec pagination
 * - Recherche par nom/email
 * - Filtres par rôle
 * - Badges de rôle colorés
 */
export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');

  const { users, pagination, loading, error, updateParams, changePage } = useReboulUsers({
    page: 1,
    limit: 20,
    role: roleFilter || undefined,
    search: search || undefined,
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    updateParams({ search: value || undefined });
  };

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value);
    updateParams({ role: value || undefined });
  };

  // Rôles disponibles
  const userRoles = [
    { value: '', label: 'Tous les rôles' },
    { value: 'CLIENT', label: 'Client' },
    { value: 'ADMIN', label: 'Admin' },
    { value: 'SUPER_ADMIN', label: 'Super Admin' },
  ];

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">
            Erreur lors du chargement des utilisateurs : {error.message}
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Utilisateurs Reboul</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gérer les utilisateurs du site Reboul
          </p>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Recherche */}
            <div className="sm:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou email..."
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtre rôle */}
            <div>
              <select
                value={roleFilter}
                onChange={(e) => handleRoleFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              >
                {userRoles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tableau utilisateurs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-sm text-gray-600">Chargement des utilisateurs...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">Aucun utilisateur trouvé</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Commandes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Inscription
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName && user.lastName
                                  ? `${user.firstName} ${user.lastName}`
                                  : user.email.split('@')[0]}
                              </div>
                              {user.phone && (
                                <div className="text-sm text-gray-500">{user.phone}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <RoleBadge role={user.role} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.ordersCount !== undefined
                            ? user.ordersCount
                            : user.orders
                            ? user.orders.length
                            : 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/admin/reboul/users/${user.id}`}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Voir
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => changePage(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className={cn(
                        'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                        pagination.page === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      Précédent
                    </button>
                    <button
                      onClick={() => changePage(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className={cn(
                        'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md',
                        pagination.page === pagination.totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      Suivant
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Affichage de <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> à{' '}
                        <span className="font-medium">
                          {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span>{' '}
                        sur <span className="font-medium">{pagination.total}</span> résultats
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                          onClick={() => changePage(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className={cn(
                            'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium',
                            pagination.page === 1
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-500 hover:bg-gray-50'
                          )}
                        >
                          Précédent
                        </button>
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                          .filter((page) => {
                            return (
                              page === 1 ||
                              page === pagination.totalPages ||
                              (page >= pagination.page - 1 && page <= pagination.page + 1)
                            );
                          })
                          .map((page, index, array) => {
                            const prevPage = array[index - 1];
                            const showEllipsis = prevPage && page - prevPage > 1;
                            return (
                              <div key={page} className="flex">
                                {showEllipsis && (
                                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                    ...
                                  </span>
                                )}
                                <button
                                  onClick={() => changePage(page)}
                                  className={cn(
                                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                                    page === pagination.page
                                      ? 'z-10 bg-black border-black text-white'
                                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                  )}
                                >
                                  {page}
                                </button>
                              </div>
                            );
                          })}
                        <button
                          onClick={() => changePage(pagination.page + 1)}
                          disabled={pagination.page === pagination.totalPages}
                          className={cn(
                            'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium',
                            pagination.page === pagination.totalPages
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-500 hover:bg-gray-50'
                          )}
                        >
                          Suivant
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
