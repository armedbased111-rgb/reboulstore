import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

/**
 * Module pour les notifications WebSocket en temps réel
 * 
 * Fournit :
 * - Gateway WebSocket pour les notifications push
 * - Événements : commandes créées, statuts changés, stocks bas
 */
@Module({
  providers: [NotificationsGateway],
  exports: [NotificationsGateway], // Exporter pour utilisation dans d'autres modules
})
export class NotificationsModule {}

