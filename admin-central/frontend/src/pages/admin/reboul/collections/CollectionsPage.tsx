import { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/Layout/AdminLayout';
import { reboulCollectionsService, Collection } from '../../../../services/reboul-collections.service';
import { Plus, CheckCircle2, XCircle, Package, Trash2 } from 'lucide-react';
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
 * Page de gestion des collections Reboul
 * 
 * Route : /admin/reboul/collections (protégée)
 * 
 * Affiche :
 * - Liste des collections avec statut actif/inactif
 * - Activer/archiver collections
 * - Nombre de produits par collection
 * - CRUD complet
 */
export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadCollections = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await reboulCollectionsService.getCollections();
      setCollections(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erreur lors du chargement'));
      console.error('Erreur lors du chargement des collections:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCollections();
  }, []);

  const handleActivate = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir activer cette collection ? L\'ancienne collection active sera automatiquement désactivée.')) {
      return;
    }

    setActionLoading(id);
    try {
      await reboulCollectionsService.activateCollection(id);
      await loadCollections();
    } catch (err) {
      console.error('Erreur lors de l\'activation:', err);
      alert('Erreur lors de l\'activation de la collection');
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchive = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir archiver cette collection ?')) {
      return;
    }

    setActionLoading(id);
    try {
      await reboulCollectionsService.archiveCollection(id);
      await loadCollections();
    } catch (err: any) {
      console.error('Erreur lors de l\'archivage:', err);
      const message = err?.response?.data?.message || 'Erreur lors de l\'archivage de la collection';
      alert(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer la collection "${name}" ? Cette action est irréversible.`)) {
      return;
    }

    setActionLoading(id);
    try {
      await reboulCollectionsService.deleteCollection(id);
      await loadCollections();
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err);
      const message = err?.response?.data?.message || 'Erreur lors de la suppression de la collection';
      alert(message);
    } finally {
      setActionLoading(null);
    }
  };

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">
            Erreur lors du chargement des collections : {error.message}
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
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Collections</h1>
            <p className="mt-1 text-sm text-gray-600">
              Gérer les collections (activer/archiver pour rotation saisonnière)
            </p>
          </div>
          <button
            onClick={() => {
              const name = prompt('Nom de la collection (ex: SS2025, AW2025) :');
              if (!name) return;
              const displayName = prompt('Nom d\'affichage (ex: Printemps-Été 2025) :') || name;
              const description = prompt('Description (optionnel) :') || undefined;
              
              reboulCollectionsService.createCollection({
                name,
                displayName,
                description,
                isActive: false,
              }).then(() => {
                loadCollections();
              }).catch((err) => {
                console.error('Erreur lors de la création:', err);
                alert('Erreur lors de la création de la collection');
              });
            }}
            className={cn(
              'inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors w-full sm:w-auto'
            )}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle collection
          </button>
        </div>

        {/* Liste collections */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
              <p className="mt-4 text-sm text-gray-600">Chargement des collections...</p>
            </div>
          ) : collections.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500">Aucune collection trouvée</p>
            </div>
          ) : (
            <>
              {/* Desktop/Tablette : Tableau */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Collection
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Produits
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                        Description
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
                    {collections.map((collection) => (
                      <tr key={collection.id} className={cn(
                        "hover:bg-gray-50",
                        collection.isActive && "bg-green-50"
                      )}>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {collection.displayName || collection.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {collection.name}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          {collection.isActive ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <XCircle className="w-3 h-3 mr-1" />
                              Archivée
                            </span>
                          )}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Package className="w-4 h-4 mr-1" />
                            {collection.productsCount || collection.products?.length || 0}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                          {collection.description || '—'}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-500 hidden lg:table-cell">
                          {collection.createdAt ? formatDate(collection.createdAt) : '—'}
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {!collection.isActive && (
                              <button
                                onClick={() => handleActivate(collection.id)}
                                disabled={actionLoading === collection.id}
                                className={cn(
                                  "p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded transition-colors",
                                  actionLoading === collection.id && "opacity-50 cursor-not-allowed"
                                )}
                                title="Activer"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                            )}
                            {collection.isActive && (
                              <button
                                onClick={() => handleArchive(collection.id)}
                                disabled={actionLoading === collection.id}
                                className={cn(
                                  "p-2 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded transition-colors",
                                  actionLoading === collection.id && "opacity-50 cursor-not-allowed"
                                )}
                                title="Archiver"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                              title="Supprimer"
                              onClick={() => handleDelete(collection.id, collection.displayName || collection.name)}
                              disabled={actionLoading === collection.id}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile : Cards */}
              <div className="md:hidden divide-y divide-gray-200">
                {collections.map((collection) => (
                  <div key={collection.id} className={cn(
                    "p-4 space-y-3",
                    collection.isActive && "bg-green-50"
                  )}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900">
                          {collection.displayName || collection.name}
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">{collection.name}</p>
                        {collection.isActive ? (
                          <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            <XCircle className="w-3 h-3 mr-1" />
                            Archivée
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4 flex-shrink-0">
                        {!collection.isActive && (
                          <button
                            onClick={() => handleActivate(collection.id)}
                            disabled={actionLoading === collection.id}
                            className={cn(
                              "p-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded",
                              actionLoading === collection.id && "opacity-50 cursor-not-allowed"
                            )}
                            title="Activer"
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </button>
                        )}
                        {collection.isActive && (
                          <button
                            onClick={() => handleArchive(collection.id)}
                            disabled={actionLoading === collection.id}
                            className={cn(
                              "p-2 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded",
                              actionLoading === collection.id && "opacity-50 cursor-not-allowed"
                            )}
                            title="Archiver"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                          title="Supprimer"
                          onClick={() => handleDelete(collection.id, collection.displayName || collection.name)}
                          disabled={actionLoading === collection.id}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-gray-500">Produits</span>
                        <p className="font-medium text-gray-900 flex items-center">
                          <Package className="w-4 h-4 mr-1" />
                          {collection.productsCount || collection.products?.length || 0}
                        </p>
                      </div>
                      {collection.createdAt && (
                        <div>
                          <span className="text-gray-500">Créée le</span>
                          <p className="font-medium text-gray-900">{formatDate(collection.createdAt)}</p>
                        </div>
                      )}
                    </div>
                    {collection.description && (
                      <div className="text-sm text-gray-500">
                        {collection.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

