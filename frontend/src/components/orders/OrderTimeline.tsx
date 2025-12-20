import { OrderStatus } from '../../types/index';

interface OrderTimelineProps {
  status: OrderStatus;
  paidAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
}

/**
 * Définition des étapes de la timeline
 */

const timelineSteps: Array<{
  status: OrderStatus;
  label: string;
  icon: string;
}> = [
  { status: OrderStatus.PENDING, label: 'En attente', icon: '⏳' },
  { status: OrderStatus.PAID, label: 'Payée', icon: '💳' },
  { status: OrderStatus.PROCESSING, label: 'En traitement', icon: '📦' },
  { status: OrderStatus.SHIPPED, label: 'Expédiée', icon: '🚚' },
  { status: OrderStatus.DELIVERED, label: 'Livrée', icon: '✅' },
];

/**
 * Fonction pour obtenir l'index de l'étape actuelle
 */
const getCurrentStepIndex = (status: OrderStatus): number => {
  return timelineSteps.findIndex((step) => step.status === status);
};

/**
 * Fonction pour vérifier si une étape est complétée
 */
const isStepCompleted = (stepIndex: number, currentIndex: number): boolean => {
  return stepIndex < currentIndex;
};

/**
 * Fonction pour vérifier si une étape est active
 */
const isStepActive = (stepIndex: number, currentIndex: number): boolean => {
  return stepIndex === currentIndex;
};

/**
 * Composant OrderTimeline - Visualisation des étapes de la commande
 */
export const OrderTimeline = ({
  status,
  paidAt,
  shippedAt,
  deliveredAt,
}: OrderTimelineProps) => {
  const currentStepIndex = getCurrentStepIndex(status);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between relative">
        {/* Ligne de connexion */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
        
        {/* Étapes */}
        {timelineSteps.map((step, index) => {
          const completed = isStepCompleted(index, currentStepIndex);
          const active = isStepActive(index, currentStepIndex);
          
          return (
            <div key={step.status} className="flex flex-col items-center relative z-10 flex-1">
              {/* Icône */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors duration-200 ${
                  completed
                    ? 'bg-black text-white'
                    : active
                    ? 'bg-black text-white ring-2 ring-black ring-offset-2'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {step.icon}
              </div>
              
              {/* Label */}
              <p
                className={`mt-2 text-xs text-center uppercase tracking-tight ${
                  completed || active ? 'text-black font-medium' : 'text-gray-400'
                }`}
              >
                {step.label}
              </p>
              
              {/* Date si disponible */}
              {completed && (
                <p className="mt-1 text-xs text-gray-500">
                  {step.status === 'paid' && paidAt && formatDate(paidAt)}
                  {step.status === 'shipped' && shippedAt && formatDate(shippedAt)}
                  {step.status === 'delivered' && deliveredAt && formatDate(deliveredAt)}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Fonction pour formater la date
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const months = ['jan', 'fév', 'mar', 'avr', 'mai', 'jun', 'jul', 'aoû', 'sep', 'oct', 'nov', 'déc'];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

