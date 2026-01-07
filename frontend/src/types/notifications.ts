/**
 * Types pour les notifications WebSocket
 */
export interface Notification {
  type: 'order.created' | 'order.status.changed' | 'product.stock.low';
  message: string;
  data: any;
  timestamp: Date | string; // Peut être Date ou string (JSON)
}

