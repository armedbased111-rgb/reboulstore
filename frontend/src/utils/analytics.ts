/**
 * Google Analytics 4 (GA4) Utility
 * Configuration et tracking des événements
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Initialise Google Analytics 4
 * Doit être appelé une fois au démarrage de l'application
 */
export const initAnalytics = (): void => {
  const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

  // Ne rien faire si pas de Measurement ID configuré
  if (!GA_MEASUREMENT_ID) {
    if (import.meta.env.DEV) {
      console.log('[Analytics] GA4 non configuré (VITE_GA_MEASUREMENT_ID manquant)');
    }
    return;
  }

  // Charger le script Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  // Initialiser dataLayer et gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args: unknown[]) {
    window.dataLayer.push(args);
  };

  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });
};

/**
 * Track un événement personnalisé
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
): void => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams);
  }
};

/**
 * Track un changement de page (pour SPA)
 */
export const trackPageView = (path: string): void => {
  if (typeof window.gtag === 'function') {
    const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (GA_MEASUREMENT_ID) {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: path,
      });
    }
  }
};

/**
 * Événements prédéfinis pour le e-commerce
 */
export const analyticsEvents = {
  // Produits
  viewProduct: (productId: string, productName: string, price: number) => {
    trackEvent('view_item', {
      currency: 'EUR',
      value: price,
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: price,
        },
      ],
    });
  },

  // Panier
  addToCart: (productId: string, productName: string, price: number, quantity: number = 1) => {
    trackEvent('add_to_cart', {
      currency: 'EUR',
      value: price * quantity,
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: price,
          quantity: quantity,
        },
      ],
    });
  },

  removeFromCart: (productId: string, productName: string, price: number) => {
    trackEvent('remove_from_cart', {
      currency: 'EUR',
      value: price,
      items: [
        {
          item_id: productId,
          item_name: productName,
          price: price,
        },
      ],
    });
  },

  // Checkout
  beginCheckout: (value: number, items: Array<{ id: string; name: string; price: number; quantity: number }>) => {
    trackEvent('begin_checkout', {
      currency: 'EUR',
      value: value,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  },

  // Commande
  purchase: (transactionId: string, value: number, items: Array<{ id: string; name: string; price: number; quantity: number }>) => {
    trackEvent('purchase', {
      transaction_id: transactionId,
      currency: 'EUR',
      value: value,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  },

  // Recherche
  search: (searchTerm: string) => {
    trackEvent('search', {
      search_term: searchTerm,
    });
  },

  // Navigation
  categoryView: (categoryName: string) => {
    trackEvent('view_item_list', {
      item_list_name: categoryName,
    });
  },
};
