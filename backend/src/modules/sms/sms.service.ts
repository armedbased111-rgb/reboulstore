import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import twilio from 'twilio';

/**
 * Service pour l'envoi de SMS via Twilio
 * 
 * Configuration requise dans .env :
 * - TWILIO_ACCOUNT_SID : Account SID Twilio
 * - TWILIO_AUTH_TOKEN : Auth Token Twilio
 * - TWILIO_PHONE_NUMBER : Numéro de téléphone Twilio (format: +33612345678)
 */
@Injectable()
export class SmsService {
  private twilioClient: twilio.Twilio | null = null;
  private twilioPhoneNumber: string | null = null;
  private readonly logger = new Logger(SmsService.name);
  private isEnabled: boolean = false;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    const phoneNumber = this.configService.get<string>('TWILIO_PHONE_NUMBER');
    this.twilioPhoneNumber = phoneNumber || null;

    if (accountSid && authToken && phoneNumber) {
      try {
        this.twilioClient = twilio(accountSid, authToken);
        this.isEnabled = true;
        this.logger.log('Twilio SMS service initialized');
      } catch (error) {
        this.logger.error('Failed to initialize Twilio client:', error);
        this.isEnabled = false;
      }
    } else {
      this.logger.warn(
        'Twilio credentials not configured. SMS service disabled. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER in .env',
      );
      this.isEnabled = false;
    }
  }

  /**
   * Envoie un SMS
   * @param to - Numéro de téléphone du destinataire (format: +33612345678)
   * @param message - Message à envoyer
   * @returns Promise avec le SID du message envoyé
   */
  async sendSMS(to: string, message: string): Promise<string | null> {
    if (!this.isEnabled || !this.twilioClient || !this.twilioPhoneNumber) {
      this.logger.warn('SMS service is disabled. Message not sent:', message);
      return null;
    }

    // Valider le format du numéro (doit commencer par +)
    if (!to.startsWith('+')) {
      this.logger.error(`Invalid phone number format: ${to}. Must start with +`);
      return null;
    }

    try {
      const result = await this.twilioClient.messages.create({
        body: message,
        from: this.twilioPhoneNumber,
        to: to,
      });

      this.logger.log(`SMS sent successfully to ${to}. SID: ${result.sid}`);
      return result.sid;
    } catch (error: any) {
      this.logger.error(`Failed to send SMS to ${to}:`, error.message);
      throw error;
    }
  }

  /**
   * Envoie un SMS de notification d'expédition de commande
   * @param phoneNumber - Numéro de téléphone du client
   * @param orderNumber - Numéro de commande
   * @param trackingNumber - Numéro de suivi (optionnel)
   * @param carrier - Transporteur (optionnel)
   */
  async sendOrderShippedSMS(
    phoneNumber: string,
    orderNumber: string,
    trackingNumber?: string,
    carrier?: string,
  ): Promise<string | null> {
    let message = `Votre commande ${orderNumber} a été expédiée.`;

    if (trackingNumber) {
      message += ` Numéro de suivi: ${trackingNumber}`;
    }

    if (carrier) {
      message += ` Transporteur: ${carrier}`;
    }

    message += ` Suivez votre colis sur reboulstore.com`;

    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Envoie un SMS de réinitialisation de mot de passe
   * @param phoneNumber - Numéro de téléphone de l'utilisateur
   * @param resetToken - Token de réinitialisation
   */
  async sendPasswordResetSMS(
    phoneNumber: string,
    resetToken: string,
  ): Promise<string | null> {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const message = `Réinitialisation de mot de passe Reboul Store. Cliquez sur: ${resetUrl} (valable 1h)`;

    return this.sendSMS(phoneNumber, message);
  }

  /**
   * Vérifie si le service SMS est activé
   */
  isServiceEnabled(): boolean {
    return this.isEnabled;
  }
}

