interface TrackingInfoProps {
  trackingNumber?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
}

/**
 * Composant TrackingInfo - Affiche les informations de suivi de colis
 */
export const TrackingInfo = ({
  trackingNumber,
  shippedAt,
  deliveredAt,
}: TrackingInfoProps) => {
  if (!trackingNumber && !shippedAt && !deliveredAt) {
    return null;
  }

  return (
    <div className="border border-gray-200 p-4 bg-gray-50">
      <h3 className="text-sm font-medium uppercase tracking-tight mb-3">
        SUIVI DE COLIS
      </h3>
      
      {trackingNumber && (
        <div className="mb-3">
          <p className="text-xs text-gray-600 mb-1">Numéro de suivi</p>
          <p className="font-mono text-sm font-medium">{trackingNumber}</p>
        </div>
      )}

      {shippedAt && (
        <div className="mb-2">
          <p className="text-xs text-gray-600 mb-1">Expédiée le</p>
          <p className="text-sm">{formatDate(shippedAt)}</p>
        </div>
      )}

      {deliveredAt && (
        <div>
          <p className="text-xs text-gray-600 mb-1">Livrée le</p>
          <p className="text-sm font-medium">{formatDate(deliveredAt)}</p>
        </div>
      )}

      {trackingNumber && (
        <a
          href={`https://www.laposte.fr/outils/suivre-vos-envois?code=${trackingNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-xs text-black underline hover:text-gray-600 transition-colors"
        >
          Suivre sur La Poste →
        </a>
      )}
    </div>
  );
};

/**
 * Fonction pour formater la date
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} à ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

