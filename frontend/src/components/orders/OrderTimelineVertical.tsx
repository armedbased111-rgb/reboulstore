import { OrderStatus } from '../../types/index';
import { Timeline,
  TimelineItem, TimelineTitle,
  TimelineDescription,
  TimelineDate, } from '../ui/timeline';

// Chemins vers les SVG dans le dossier public
const REFRESH_DOUBLE_ICON = '/webdesign/icon/http_/localhost_3000/orders/refresh-double.svg';
const BOX_ICON = '/webdesign/icon/http_/localhost_3000/orders/3d-select-face.svg';
const TRUCK_ICON = '/webdesign/icon/http_/localhost_3000/orders/delivery-truck.svg';
const CHECK_ICON = '/webdesign/icon/http_/localhost_3000/orders/check.svg';

interface OrderTimelineVerticalProps {
  status: OrderStatus;
  paidAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
}

interface Step {
  id: number;
  label: string;
  description: string;
  icon: string;
  status: OrderStatus[];
  date?: string | null;
}

/**
 * Composant Timeline Verticale - Style shadcn/Radix
 * 
 * Utilise les primitives Timeline avec animations Framer Motion
 * Design minimaliste et moderne
 */
export const OrderTimelineVertical = ({
  status,
  paidAt,
  shippedAt,
  deliveredAt,
}: OrderTimelineVerticalProps) => {
  // Déterminer quelle étape est active
  const getActiveStepIndex = (): number => {
    if (status === OrderStatus.DELIVERED) return 3;
    if (status === OrderStatus.SHIPPED) return 2;
    if (status === OrderStatus.PROCESSING) return 1;
    if (status === OrderStatus.PAID) return 0;
    return 0; // pending = première étape aussi (en attente de paiement)
  };

  const activeIndex = getActiveStepIndex();

  // Définir les étapes avec leurs données
  const steps: Step[] = [
    {
      id: 0,
      label: status === OrderStatus.PENDING ? 'EN ATTENTE DE PAIEMENT' : 'COMMANDE PAYÉE',
      description: status === OrderStatus.PENDING 
        ? 'Votre commande est en attente de confirmation de paiement.'
        : 'Votre paiement a été confirmé avec succès.',
      icon: REFRESH_DOUBLE_ICON,
      status: [OrderStatus.PAID, OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
      date: paidAt,
    },
    {
      id: 1,
      label: 'EN PRÉPARATION',
      description: 'Votre commande est en cours de préparation dans nos entrepôts.',
      icon: BOX_ICON,
      status: [OrderStatus.PROCESSING, OrderStatus.SHIPPED, OrderStatus.DELIVERED],
      date: null,
    },
    {
      id: 2,
      label: 'EXPÉDIÉE',
      description: 'Votre commande a été expédiée et est en cours de livraison.',
      icon: TRUCK_ICON,
      status: [OrderStatus.SHIPPED, OrderStatus.DELIVERED],
      date: shippedAt,
    },
    {
      id: 3,
      label: 'LIVRÉE',
      description: 'Votre commande a été livrée. Merci pour votre achat !',
      icon: CHECK_ICON,
      status: [OrderStatus.DELIVERED],
      date: deliveredAt,
    },
  ];

  // Vérifier si une étape est complétée
  const isStepCompleted = (step: Step): boolean => {
    // Pour pending, aucune étape n'est complétée
    if (status === OrderStatus.PENDING) return false;
    return step.status.includes(status);
  };

  // Formater la date
  const formatDate = (dateString: string | null | undefined): string | null => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 w-full lg:w-[410px] h-auto">
      {/* En-tête */}
      <div className="mb-4">
        <h2 className="font-[Geist] font-medium text-base uppercase tracking-tight text-black">
          SUIVI DE COMMANDE
        </h2>
        <p className="font-[Geist] font-light text-xs text-gray-500 mt-1">
          {status === OrderStatus.PENDING
            ? 'En attente de confirmation'
            : `Statut : ${steps[activeIndex]?.label || 'En cours'}`}
        </p>
      </div>

      {/* Timeline */}
      <Timeline activeIndex={activeIndex}>
        {steps.map((step, index) => {
          const isCompleted = isStepCompleted(step);
          const isActive = index === activeIndex;
          const isLast = index === steps.length - 1;

          // Icône à afficher dans le cercle (si complété OU actif)
          const icon = (isCompleted || isActive) ? (
            <img
              src={step.icon}
              alt={step.label}
              className={`${
                isActive ? 'w-5 h-5' : 'w-3 h-3'
              } filter invert brightness-0 contrast-100`}
            />
          ) : null;

          return (
            <TimelineItem key={step.id} index={index} isLast={isLast} icon={icon}>
              {/* Afficher le texte SEULEMENT pour l'étape active */}
              {isActive && (
                <>
                  <TimelineTitle>{step.label}</TimelineTitle>
                  <TimelineDescription>{step.description}</TimelineDescription>
                  {step.date && (
                    <TimelineDate>{formatDate(step.date)}</TimelineDate>
                  )}
                </>
              )}
            </TimelineItem>
          );
        })}
      </Timeline>
    </div>
  );
};
