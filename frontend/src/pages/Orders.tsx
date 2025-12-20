import { useState, useMemo } from 'react';
import { useOrders } from '../hooks/useOrders';
import { OrderCard } from '../components/orders/OrderCard';
import type { OrderStatus } from '../types/index';
import { Link } from 'react-router-dom';

/**
 * Page Mes Commandes - Liste des commandes de l'utilisateur
 */
export const Orders = () => {
  const { orders, loading, error } = useOrders();
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filtrer les commandes par statut
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Tri
    filtered = [...filtered].sort((a, b) => {
      if (sortBy === 'date') {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        // Tri par montant
        return sortOrder === 'asc' ? a.total - b.total : b.total - a.total;
      }
    });

    return filtered;
  }, [orders, statusFilter, sortBy, sortOrder]);

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl">
          <h1 className="text-2xl md:text-3xl font-medium uppercase tracking-tight mb-8">
            MES COMMANDES
          </h1>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-6xl">
          <h1 className="text-2xl md:text-3xl font-medium uppercase tracking-tight mb-8">
            MES COMMANDES
          </h1>
          <p className="text-red-600">Erreur : {error.message}</p>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen p-4 md:p-8">
        <div>
          {/* Header */}
          <h1 className="font-[Geist] font-medium text-[40px] leading-[37px] tracking-[-0.75px] uppercase text-black mb-0">
            MES COMMANDES
          </h1>

          {/* Filtres et tri */}
          {orders.length > 0 && (
            <div className="flex flex-col md:flex-row gap-4 items-start border-b border-gray-200 pb-[25px] pt-0 mt-[28px]">
              {/* Filtre par statut */}
              <div className="flex items-center gap-[8px] h-[30px]">
                <label className="font-[Geist] text-[14px] leading-[20px] text-[#4a5565]">Statut :</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
                  className="border border-[#d1d5dc] rounded-[4px] pl-[17px] pr-[29px] py-[5px] text-[14px] leading-[18px] focus:outline-none focus:border-black"
                >
                  <option value="all">Toutes</option>
                  <option value="pending">En attente</option>
                  <option value="paid">Payées</option>
                  <option value="processing">En traitement</option>
                  <option value="shipped">Expédiées</option>
                  <option value="delivered">Livrées</option>
                  <option value="cancelled">Annulées</option>
                  <option value="refunded">Remboursées</option>
                </select>
              </div>

              {/* Tri */}
              <div className="flex items-center gap-[8px] h-[30px]">
                <label className="font-[Geist] text-[14px] leading-[20px] text-[#4a5565]">Trier par :</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
                  className="border border-[#d1d5dc] rounded-[4px] pl-[17px] pr-[29px] py-[5px] text-[14px] leading-[18px] focus:outline-none focus:border-black"
                >
                  <option value="date">Date</option>
                  <option value="amount">Montant</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="border border-[#d1d5dc] rounded-[4px] px-[13px] py-[5px] text-[14px] leading-[20px] hover:bg-gray-100 transition-colors"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          )}

          {/* Liste des commandes en grille */}
          {filteredOrders.length === 0 ? (
            <div className="text-center md:text-left py-12">
              {orders.length === 0 ? (
                <>
                  <p className="text-gray-600 mb-4">Vous n'avez pas encore de commande.</p>
                  <Link
                    to="/catalog"
                    className="inline-block px-6 py-2 bg-black text-white uppercase text-sm tracking-tight hover:bg-gray-800 transition-colors"
                  >
                    Découvrir nos produits
                  </Link>
                </>
              ) : (
                <p className="text-gray-600">Aucune commande ne correspond à vos filtres.</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[10px] mt-[32px]">
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </div>
      </div>
  );
};

