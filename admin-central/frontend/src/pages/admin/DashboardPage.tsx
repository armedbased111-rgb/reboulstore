import AdminLayout from '../../components/Layout/AdminLayout';
import { useReboulStats } from '../../hooks/useReboulStats';
import { useRecentOrders } from '../../hooks/useRecentOrders';
import StatsCard from '../../components/Dashboard/StatsCard';
import RecentOrdersTable from '../../components/Dashboard/RecentOrdersTable';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';

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
 * Page Dashboard Reboul
 * 
 * Route : /admin/reboul/dashboard (protégée)
 * 
 * Affiche :
 * - Statistiques générales (CA, commandes, produits, clients)
 * - Liste dernières commandes
 */
export default function DashboardPage() {
  const {
    productsStats,
    ordersStats,
    usersStats,
    loading,
    error,
  } = useReboulStats();
  const { orders: recentOrders, loading: ordersLoading } = useRecentOrders(5);

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">
            Erreur lors du chargement des statistiques : {error.message}
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
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Dashboard Reboul
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Vue d'ensemble de l'activité du site Reboul
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CA Total */}
          <StatsCard
            title="CA Total"
            value={
              loading || !ordersStats
                ? '...'
                : formatPrice(ordersStats.totalRevenue || 0)
            }
            description="Revenus totaux"
            icon={<TrendingUp className="w-8 h-8" />}
          />

          {/* Commandes */}
          <StatsCard
            title="Commandes"
            value={loading || !ordersStats ? '...' : ordersStats.total}
            description="Total des commandes"
            icon={<ShoppingCart className="w-8 h-8" />}
          />

          {/* Produits */}
          <StatsCard
            title="Produits"
            value={loading || !productsStats ? '...' : productsStats.total}
            description={
              productsStats
                ? `${productsStats.withStock} en stock, ${productsStats.outOfStock} rupture`
                : undefined
            }
            icon={<Package className="w-8 h-8" />}
          />

          {/* Clients */}
          <StatsCard
            title="Clients"
            value={loading || !usersStats ? '...' : usersStats.total}
            description={
              usersStats
                ? `${usersStats.withOrders} avec commandes`
                : undefined
            }
            icon={<Users className="w-8 h-8" />}
          />
        </div>

        {/* Tableau dernières commandes */}
        <RecentOrdersTable orders={recentOrders} loading={ordersLoading} />
      </div>
    </AdminLayout>
  );
}
