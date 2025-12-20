import { api } from './api';

/**
 * Service pour la gestion du checkout Stripe
 */

// Interface pour créer une session de checkout (utilisée en interne)
// interface CreateCheckoutSessionRequest {
//   items: Array<{
//     variantId: string;
//     quantity: number;
//   }>;
// }

interface CreateCheckoutSessionResponse {
  url: string; // URL de redirection vers Stripe Checkout
}

/**
 * Créer une session Stripe Checkout
 * @param items - Liste des items du panier (variantId, quantity)
 * @returns URL de redirection vers Stripe Checkout
 */
export const createCheckoutSession = async (
  items: Array<{ variantId: string; quantity: number }>
): Promise<string> => {
  const response = await api.post<CreateCheckoutSessionResponse>(
    '/checkout/create-session',
    { items }
  );
  
  return response.url;
};
