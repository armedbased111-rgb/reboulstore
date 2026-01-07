import { io, Socket } from 'socket.io-client';
import type { Notification } from '../types/notifications';

/**
 * Service pour gérer la connexion WebSocket et les notifications
 */
class WebSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Set<(notification: Notification) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000; // 3 secondes

  /**
   * Se connecte au serveur WebSocket
   * @param userId - ID de l'utilisateur (optionnel, pour les notifications utilisateur)
   * @param role - Rôle de l'utilisateur ('admin', 'super_admin', ou undefined pour user)
   */
  connect(userId?: string, role?: string) {
    if (this.socket?.connected) {
      console.log('WebSocket already connected');
      return;
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL || 
                   import.meta.env.VITE_API_URL ||
                   (typeof window !== 'undefined' ? '/api' : 'http://localhost:3001');

    const wsUrl = apiUrl.replace(/\/api$/, ''); // Retirer /api si présent

    this.socket = io(`${wsUrl}/notifications`, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: this.reconnectDelay,
      reconnectionAttempts: this.maxReconnectAttempts,
      query: {
        userId: userId || '',
        role: role || '',
      },
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    // Écouter tous les types de notifications
    this.socket.on('order.created', (notification: Notification) => {
      this.handleNotification('order.created', notification);
    });

    this.socket.on('order.status.changed', (notification: Notification) => {
      this.handleNotification('order.status.changed', notification);
    });

    this.socket.on('product.stock.low', (notification: Notification) => {
      this.handleNotification('product.stock.low', notification);
    });

    // Test de connexion
    this.socket.on('pong', (data) => {
      console.log('WebSocket ping/pong:', data);
    });
  }

  /**
   * Déconnecte du serveur WebSocket
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
    }
  }

  /**
   * Ajoute un listener pour un type de notification
   */
  on(type: string, callback: (notification: Notification) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    // Retourner une fonction pour supprimer le listener
    return () => {
      this.off(type, callback);
    };
  }

  /**
   * Supprime un listener pour un type de notification
   */
  off(type: string, callback: (notification: Notification) => void) {
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.listeners.delete(type);
      }
    }
  }

  /**
   * Gère une notification reçue
   */
  private handleNotification(type: string, notification: Notification) {
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      callbacks.forEach((callback) => {
        try {
          callback(notification);
        } catch (error) {
          console.error(`Error in notification callback for ${type}:`, error);
        }
      });
    }

    // Également notifier les listeners génériques ('*')
    const allCallbacks = this.listeners.get('*');
    if (allCallbacks) {
      allCallbacks.forEach((callback) => {
        try {
          callback(notification);
        } catch (error) {
          console.error('Error in generic notification callback:', error);
        }
      });
    }
  }

  /**
   * Teste la connexion WebSocket
   */
  ping() {
    if (this.socket?.connected) {
      this.socket.emit('ping');
    }
  }

  /**
   * Vérifie si la connexion est active
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Export d'une instance singleton
export const websocketService = new WebSocketService();

