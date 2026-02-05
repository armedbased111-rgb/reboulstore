import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

/**
 * Gateway WebSocket pour les notifications en temps réel
 * 
 * Événements émis :
 * - order.created : Nouvelle commande créée (admin)
 * - order.status.changed : Statut de commande changé (user)
 * - product.stock.low : Produit en rupture de stock (admin)
 * 
 * Rooms :
 * - admin : Pour les administrateurs
 * - user:{userId} : Pour un utilisateur spécifique
 */
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/notifications',
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);
  private adminClients = new Set<string>(); // IDs des clients admin connectés
  private userClients = new Map<string, Set<string>>(); // userId -> Set<socketId>

  /**
   * Gestion de la connexion d'un client
   */
  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);

    // Authentification basique via query params ou headers
    const userRole = client.handshake.query.role as string;
    const userId = client.handshake.query.userId as string;

    if (userRole === 'admin' || userRole === 'super_admin') {
      this.adminClients.add(client.id);
      client.join('admin');
      this.logger.log(`Admin client connected: ${client.id}`);
    } else if (userId) {
      const userRoom = `user:${userId}`;
      client.join(userRoom);
      
      if (!this.userClients.has(userId)) {
        this.userClients.set(userId, new Set());
      }
      this.userClients.get(userId)!.add(client.id);
      
      this.logger.log(`User client connected: ${client.id} (userId: ${userId})`);
    }
  }

  /**
   * Gestion de la déconnexion d'un client
   */
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);

    // Retirer de la liste des admins
    if (this.adminClients.has(client.id)) {
      this.adminClients.delete(client.id);
      client.leave('admin');
    }

    // Retirer de la liste des utilisateurs
    for (const [userId, socketIds] of this.userClients.entries()) {
      if (socketIds.has(client.id)) {
        socketIds.delete(client.id);
        if (socketIds.size === 0) {
          this.userClients.delete(userId);
        }
        break;
      }
    }
  }

  /**
   * Émet une notification pour une nouvelle commande créée (admin uniquement)
   */
  notifyOrderCreated(order: {
    id: number;
    orderNumber: string;
    total: number;
    customerInfo: {
      firstName: string;
      lastName: string;
      email: string;
    };
    createdAt: Date;
  }) {
    this.server.to('admin').emit('order.created', {
      type: 'order.created',
      message: `Nouvelle commande #${order.orderNumber} de ${order.customerInfo.firstName} ${order.customerInfo.lastName}`,
      data: order,
      timestamp: new Date(),
    });
    this.logger.log(`Order created notification sent: ${order.orderNumber}`);
  }

  /**
   * Émet une notification pour un changement de statut de commande (user spécifique)
   */
  notifyOrderStatusChanged(order: {
    id: number;
    orderNumber: string;
    status: string;
    userId: number;
  }) {
    const userRoom = `user:${order.userId}`;
    this.server.to(userRoom).emit('order.status.changed', {
      type: 'order.status.changed',
      message: `Votre commande #${order.orderNumber} est maintenant ${this.getStatusLabel(order.status)}`,
      data: order,
      timestamp: new Date(),
    });
    this.logger.log(`Order status changed notification sent: ${order.orderNumber} to user ${order.userId}`);
  }

  /**
   * Émet une notification pour un produit en rupture de stock (admin uniquement)
   */
  notifyProductStockLow(product: {
    id: number;
    name: string;
    variantId?: number;
    variantName?: string;
    stock: number;
  }) {
    this.server.to('admin').emit('product.stock.low', {
      type: 'product.stock.low',
      message: `Stock faible pour ${product.name}${product.variantName ? ` (${product.variantName})` : ''} - ${product.stock} unités restantes`,
      data: product,
      timestamp: new Date(),
    });
    this.logger.log(`Product stock low notification sent: ${product.name}`);
  }

  /**
   * Convertit un statut de commande en label lisible
   */
  private getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'en attente',
      PAID: 'payée',
      PROCESSING: 'en traitement',
      SHIPPED: 'expédiée',
      DELIVERED: 'livrée',
      CANCELLED: 'annulée',
      REFUNDED: 'remboursée',
    };
    return labels[status] || status;
  }

  /**
   * Message de test (pour vérifier la connexion)
   */
  @SubscribeMessage('ping')
  handlePing(client: Socket) {
    return { event: 'pong', data: 'WebSocket connection is working!' };
  }
}

