import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';

/**
 * Module pour l'envoi de SMS via Twilio
 */
@Module({
  providers: [SmsService],
  exports: [SmsService], // Exporter pour utilisation dans d'autres modules
})
export class SmsModule {}

