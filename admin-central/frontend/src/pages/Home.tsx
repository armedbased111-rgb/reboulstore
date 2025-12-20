import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

/**
 * Page de sélection de magasin
 * 
 * Route : `/` (publique, accessible sans login)
 * 
 * Affiche les magasins disponibles :
 * - Reboul (actif) : bouton "Accéder" → redirige vers /admin/reboul/login
 * - CP Company (inactif) : "Disponible prochainement"
 * - Outlet (inactif) : "Disponible prochainement"
 */
export default function ShopSelectorPage() {
  const navigate = useNavigate();

  const shops = [
    {
      id: 'reboul',
      name: 'Reboul',
      status: 'active' as const,
      description: 'Magasin principal',
      route: '/admin/reboul/login',
    },
    {
      id: 'cp-company',
      name: 'CP Company',
      status: 'coming-soon' as const,
      description: 'Disponible prochainement',
    },
    {
      id: 'outlet',
      name: 'Outlet',
      status: 'coming-soon' as const,
      description: 'Disponible prochainement',
    },
  ];

  const handleShopClick = (shop: typeof shops[0]) => {
    if (shop.status === 'active' && shop.route) {
      navigate(shop.route);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Admin Centrale
          </h1>
          <p className="text-sm text-gray-600">
            Sélectionnez le magasin auquel vous souhaitez accéder
          </p>
        </div>

        {/* Liste des magasins */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {shops.map((shop) => {
            const isActive = shop.status === 'active';
            const isComingSoon = shop.status === 'coming-soon';

            return (
              <div
                key={shop.id}
                onClick={() => handleShopClick(shop)}
                className={cn(
                  'bg-white rounded-lg shadow-sm border p-6 transition-all',
                  isActive
                    ? 'border-gray-300 hover:border-black hover:shadow-md cursor-pointer'
                    : 'border-gray-200 opacity-60 cursor-not-allowed'
                )}
              >
                {/* Indicateur de statut */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    {shop.name}
                  </span>
                  <span
                    className={cn(
                      'text-xs font-medium px-2 py-1 rounded',
                      isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-600'
                    )}
                  >
                    {isActive ? '🟢 Actif' : '🔴 À venir'}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-6">{shop.description}</p>

                {/* Bouton d'action */}
                {isActive ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(shop.route!);
                    }}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
                  >
                    Accéder
                  </button>
                ) : (
                  <div className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-400 bg-gray-50 cursor-not-allowed">
                    Indisponible
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          <p>Accès réservé aux administrateurs</p>
        </div>
      </div>
    </div>
  );
}
