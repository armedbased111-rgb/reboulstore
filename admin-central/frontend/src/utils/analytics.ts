/**
 * Google Analytics 4 (GA4) Utility pour Admin Central
 * Configuration et tracking des événements admin
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
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
  window.gtag = function gtag(...args: any[]) {
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
  eventParams?: Record<string, any>
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
 * Événements prédéfinis pour l'admin
 */
export const analyticsEvents = {
  // Authentification
  adminLogin: () => {
    trackEvent('admin_login');
  },

  adminLogout: () => {
    trackEvent('admin_logout');
  },

  // Produits
  productCreate: (productId: string, productName: string) => {
    trackEvent('admin_product_create', {
      product_id: productId,
      product_name: productName,
    });
  },

  productUpdate: (productId: string, productName: string) => {
    trackEvent('admin_product_update', {
      product_id: productId,
      product_name: productName,
    });
  },

  productDelete: (productId: string) => {
    trackEvent('admin_product_delete', {
      product_id: productId,
    });
  },

  // Commandes
  orderProcess: (orderId: string, status: string) => {
    trackEvent('admin_order_process', {
      order_id: orderId,
      status: status,
    });
  },

  orderView: (orderId: string) => {
    trackEvent('admin_order_view', {
      order_id: orderId,
    });
  },

  // Images
  imageUpload: (count: number) => {
    trackEvent('admin_image_upload', {
      image_count: count,
    });
  },

  // Catégories
  categoryCreate: (categoryId: string, categoryName: string) => {
    trackEvent('admin_category_create', {
      category_id: categoryId,
      category_name: categoryName,
    });
  },

  categoryUpdate: (categoryId: string, categoryName: string) => {
    trackEvent('admin_category_update', {
      category_id: categoryId,
      category_name: categoryName,
    });
  },
};
