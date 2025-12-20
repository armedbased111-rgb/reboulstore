import { useState, useEffect } from 'react';
import AdminLayout from '../../../../components/Layout/AdminLayout';
import { reboulSettingsService, ReboulSettings } from '../../../../services/reboul-settings.service';
import { Save, ExternalLink } from 'lucide-react';

/**
 * Page de paramètres Reboul
 * 
 * Route : /admin/reboul/settings (protégée)
 */
export default function SettingsPage() {
  const [settings, setSettings] = useState<ReboulSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Charger les paramètres
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await reboulSettingsService.getSettings();
        setSettings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des paramètres');
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const updated = await reboulSettingsService.updateSettings(settings);
      setSettings(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (path: string[], value: any) => {
    if (!settings) return;
    const newSettings = { ...settings };
    let current: any = newSettings;
    
    for (let i = 0; i < path.length - 1; i++) {
      if (!current[path[i]]) {
        current[path[i]] = {};
      }
      current = current[path[i]];
    }
    
    current[path[path.length - 1]] = value;
    setSettings(newSettings);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
            <p className="mt-4 text-sm text-gray-600">Chargement des paramètres...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!settings) {
    return (
      <AdminLayout>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">Impossible de charger les paramètres</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Paramètres Reboul</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gérer les paramètres généraux du site Reboul
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 text-sm">Paramètres sauvegardés avec succès</p>
          </div>
        )}

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 space-y-6">
          {/* Informations shop */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Informations Shop</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du shop
                </label>
                <input
                  type="text"
                  value={settings.name || ''}
                  onChange={(e) => updateField(['name'], e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email de contact
                </label>
                <input
                  type="email"
                  value={settings.contactInfo?.email || ''}
                  onChange={(e) => updateField(['contactInfo', 'email'], e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={settings.contactInfo?.phone || ''}
                  onChange={(e) => updateField(['contactInfo', 'phone'], e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                />
              </div>
            </div>
            <div className="mt-4 space-y-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                type="text"
                placeholder="Rue"
                value={settings.contactInfo?.address?.street || ''}
                onChange={(e) => updateField(['contactInfo', 'address', 'street'], e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black mb-2"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Code postal"
                  value={settings.contactInfo?.address?.postalCode || ''}
                  onChange={(e) => updateField(['contactInfo', 'address', 'postalCode'], e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                />
                <input
                  type="text"
                  placeholder="Ville"
                  value={settings.contactInfo?.address?.city || ''}
                  onChange={(e) => updateField(['contactInfo', 'address', 'city'], e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                />
              </div>
              <input
                type="text"
                placeholder="Pays"
                value={settings.contactInfo?.address?.country || ''}
                onChange={(e) => updateField(['contactInfo', 'address', 'country'], e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
              />
            </div>
          </div>

          {/* Politiques livraison */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Politiques de Livraison</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seuil livraison gratuite (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.shippingPolicy?.freeShippingThreshold || ''}
                  onChange={(e) => updateField(['shippingPolicy', 'freeShippingThreshold'], parseFloat(e.target.value) || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                  placeholder="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Délai de livraison
                </label>
                <input
                  type="text"
                  value={settings.shippingPolicy?.deliveryTime || ''}
                  onChange={(e) => updateField(['shippingPolicy', 'deliveryTime'], e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                  placeholder="Ex: 3-5 jours ouvrés"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-md">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Livraison Standard</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Nom</label>
                      <input
                        type="text"
                        value={settings.shippingPolicy?.standardShipping?.name || ''}
                        onChange={(e) => updateField(['shippingPolicy', 'standardShipping', 'name'], e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                        placeholder="Livraison standard"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Coût (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={settings.shippingPolicy?.standardShipping?.cost || ''}
                        onChange={(e) => updateField(['shippingPolicy', 'standardShipping', 'cost'], parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                        placeholder="5.99"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Description</label>
                      <textarea
                        value={settings.shippingPolicy?.standardShipping?.description || ''}
                        onChange={(e) => updateField(['shippingPolicy', 'standardShipping', 'description'], e.target.value)}
                        rows={2}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                        placeholder="Description de la livraison standard"
                      />
                    </div>
                  </div>
                </div>
                <div className="p-4 border border-gray-200 rounded-md">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Livraison Express</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Nom</label>
                      <input
                        type="text"
                        value={settings.shippingPolicy?.expressShipping?.name || ''}
                        onChange={(e) => updateField(['shippingPolicy', 'expressShipping', 'name'], e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                        placeholder="Livraison express"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Coût (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={settings.shippingPolicy?.expressShipping?.cost || ''}
                        onChange={(e) => updateField(['shippingPolicy', 'expressShipping', 'cost'], parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                        placeholder="9.99"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Description</label>
                      <textarea
                        value={settings.shippingPolicy?.expressShipping?.description || ''}
                        onChange={(e) => updateField(['shippingPolicy', 'expressShipping', 'description'], e.target.value)}
                        rows={2}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
                        placeholder="Description de la livraison express"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description complète
                </label>
                <textarea
                  rows={4}
                  value={settings.shippingPolicy?.description || ''}
                  onChange={(e) => updateField(['shippingPolicy', 'description'], e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                  placeholder="Description détaillée de la politique de livraison..."
                />
              </div>
            </div>
          </div>

          {/* Politiques retour */}
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Politiques de Retour</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Délai de retour (jours)
                </label>
                <input
                  type="number"
                  value={settings.returnPolicy?.returnWindow || ''}
                  onChange={(e) => updateField(['returnPolicy', 'returnWindow'], parseInt(e.target.value) || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                  placeholder="30"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="returnShippingFree"
                  checked={settings.returnPolicy?.returnShippingFree || false}
                  onChange={(e) => updateField(['returnPolicy', 'returnShippingFree'], e.target.checked)}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="returnShippingFree" className="ml-2 text-sm text-gray-700">
                  Retour gratuit
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conditions de retour
                </label>
                <textarea
                  rows={4}
                  value={settings.returnPolicy?.conditions || ''}
                  onChange={(e) => updateField(['returnPolicy', 'conditions'], e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                  placeholder="Conditions détaillées de retour..."
                />
              </div>
            </div>
          </div>

          {/* Compte Stripe */}
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Compte Stripe</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stripe Account ID
                </label>
                <input
                  type="text"
                  value={settings.stripeConfig?.accountId || ''}
                  onChange={(e) => updateField(['stripeConfig', 'accountId'], e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black font-mono text-sm"
                  placeholder="acct_..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Dashboard Stripe
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={settings.stripeConfig?.dashboardUrl || ''}
                    onChange={(e) => updateField(['stripeConfig', 'dashboardUrl'], e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black"
                    placeholder="https://dashboard.stripe.com/..."
                  />
                  {settings.stripeConfig?.dashboardUrl && (
                    <a
                      href={settings.stripeConfig.dashboardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ouvrir
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Sauvegarde...' : 'Enregistrer les paramètres'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
