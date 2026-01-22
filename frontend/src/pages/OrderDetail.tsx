import { useParams } from 'react-router-dom';
import { useOrder } from '../hooks/useOrders';
import { OrderDetailHeader } from '../components/orders/OrderDetailHeader';
import { OrderShippingAddress } from '../components/orders/OrderShippingAddress';
import { OrderSummary } from '../components/orders/OrderSummary';
import { OrderItemsList } from '../components/orders/OrderItemsList';
import { OrderTimelineVertical } from '../components/orders/OrderTimelineVertical';
import { downloadInvoice } from '../services/orders';

/**
 * Page Détail Commande - Layout exact Figma avec code propre
 * 
 * Desktop Grid Layout (exact Figma):
 * - Ligne 1: Articles (540px) | gap 11px | Adresse (462px) | gap 0px | Timeline (363px)
 * - Ligne 2: Récapitulatif (1014px)
 */
export const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { order, loading, error } = useOrder(id);

  if (loading) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <p className="text-gray-600">Chargement...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <h1 className="font-[Geist] font-medium text-[30px] leading-[36px] tracking-[-0.75px] uppercase text-black mb-8">
          COMMANDE
        </h1>
        <p className="text-red-600">
          {error ? `Erreur : ${error.message}` : 'Commande introuvable'}
        </p>
      </div>
    );
  }

  const orderItems = order.cart?.items || [];
  
  const shippingAddress = order.shippingAddress || (order.customerInfo ? {
    firstName: order.customerInfo.name.split(' ')[0] || '',
    lastName: order.customerInfo.name.split(' ').slice(1).join(' ') || '',
    street: order.customerInfo.address.street,
    city: order.customerInfo.address.city,
    postalCode: order.customerInfo.address.postalCode,
    country: order.customerInfo.address.country,
    phone: order.customerInfo.phone,
  } : null);

  const handleDownloadInvoice = async () => {
    try {
      await downloadInvoice(order.id);
    } catch (error) {
      console.error('Erreur lors du téléchargement de la facture:', error);
      alert('Erreur lors du téléchargement de la facture');
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Container principal */}
      <div className="flex flex-col gap-6 lg:gap-0">
        {/* Header - Largeur 540px sur desktop comme Figma */}
        <div className="lg:w-[540px] mb-6 lg:mb-0">
          <OrderDetailHeader 
            orderId={order.id} 
            createdAt={order.createdAt} 
          />
        </div>

        {/* Layout Desktop : Grille moderne et responsive */}
        {/* Grid: Articles + Adresse + Timeline verticale */}
        {/* Mobile/Tablette : Colonnes empilées */}
        <div className="flex flex-col gap-6">
          {/* Ligne 1 : Cartes principales + Timeline */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Colonne gauche : Articles et Adresse */}
            <div className="flex flex-col gap-6 lg:flex-1">
              {/* Articles */}
              <OrderItemsList items={orderItems} />
              
              {/* Adresse de livraison */}
              {shippingAddress && (
                <OrderShippingAddress address={shippingAddress} />
              )}
              
              {/* Récapitulatif */}
              <OrderSummary 
                total={order.total} 
                onDownloadInvoice={handleDownloadInvoice}
              />
            </div>

            {/* Colonne droite : Timeline verticale (fixe sur desktop) */}
            <div className="lg:w-[410px]">
              <OrderTimelineVertical
                status={order.status}
                paidAt={order.paidAt || null}
                shippedAt={order.shippedAt || null}
                deliveredAt={order.deliveredAt || null}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
