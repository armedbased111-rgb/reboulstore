/**
 * Envoie un e-mail de test pour chaque template Handlebars vers une adresse donnée.
 * Usage (depuis backend/) : npx ts-node -r tsconfig-paths/register scripts/send-test-email-templates.ts
 */

import 'reflect-metadata';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerService } from '@nestjs-modules/mailer';
import { getEmailConfig } from '../src/config/email.config';
import { getPublicSiteUrl } from '../src/config/public-site-url';
import { getEmailLogoUrl } from '../src/config/email-assets';

const TEST_TO = 'armedbased111@gmail.com';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: path.join(__dirname, '../.env'),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getEmailConfig,
      inject: [ConfigService],
    }),
  ],
})
class MailPreviewModule {}

async function main() {
  process.chdir(path.join(__dirname, '..'));

  const app = await NestFactory.createApplicationContext(MailPreviewModule, {
    logger: ['error', 'warn', 'log'],
  });
  const mailer = app.get(MailerService);

  const config = app.get(ConfigService);
  const frontendUrl = getPublicSiteUrl(config);
  const emailLogoUrl = getEmailLogoUrl(config);
  const year = new Date().getFullYear();
  const base = { frontendUrl, emailLogoUrl, currentYear: year };

  const jobs: Array<{ template: string; subject: string; context: Record<string, unknown> }> = [
    {
      template: 'newsletter-welcome',
      subject: '[TEST Reboul] Newsletter — bienvenue',
      context: {
        ...base,
        email: TEST_TO,
        emailTitle: 'Inscription newsletter · Reboul Store',
        datum: 'COMMS // RBL-NS-WELCOME',
      },
    },
    {
      template: 'newsletter-admin-notify',
      subject: '[TEST Reboul] Newsletter — alerte admin',
      context: {
        ...base,
        email: TEST_TO,
        source: 'script-send-test-email-templates',
        subscribedAt: new Date().toISOString(),
        emailTitle: 'Alerte newsletter · Reboul Store',
        datum: 'INTERNAL // RBL-NS-ADM',
      },
    },
    {
      template: 'registration-confirmation',
      subject: '[TEST Reboul] Inscription compte',
      context: {
        ...base,
        firstName: 'Test',
        email: TEST_TO,
        emailTitle: 'Bienvenue · Reboul Store',
        datum: 'AUTH // RBL-REG-OK',
      },
    },
    {
      template: 'order-received',
      subject: '[TEST Reboul] Commande reçue',
      context: {
        ...base,
        customerName: 'Test Client',
        orderId: '999001',
        orderDate: new Date().toLocaleDateString('fr-FR'),
        total: '129.00',
        orderUrl: `${frontendUrl}/orders/999001`,
        emailTitle: 'Commande reçue · Reboul Store',
        datum: 'ORDER // RBL-OR-RCV',
      },
    },
    {
      template: 'order-confirmation',
      subject: '[TEST Reboul] Confirmation commande',
      context: {
        ...base,
        customerName: 'Test Client',
        orderId: '999002',
        orderDate: new Date().toLocaleDateString('fr-FR'),
        total: '129.00',
        status: 'Payée',
        orderUrl: `${frontendUrl}/orders/999002`,
        emailTitle: 'Confirmation de commande · Reboul Store',
        datum: 'ORDER // RBL-OR-CNF',
      },
    },
    {
      template: 'shipping-notification',
      subject: '[TEST Reboul] Expédition',
      context: {
        ...base,
        customerName: 'Test Client',
        orderId: '999003',
        trackingNumber: 'TESTTRACK123456FR',
        orderUrl: `${frontendUrl}/orders/999003`,
        emailTitle: 'Expédition · Reboul Store',
        datum: 'ORDER // RBL-OR-SHP',
      },
    },
    {
      template: 'order-delivered',
      subject: '[TEST Reboul] Livraison',
      context: {
        ...base,
        customerName: 'Test Client',
        orderId: '999004',
        orderUrl: `${frontendUrl}/orders/999004`,
        emailTitle: 'Livraison · Reboul Store',
        datum: 'ORDER // RBL-OR-DLV',
      },
    },
    {
      template: 'order-cancelled',
      subject: '[TEST Reboul] Commande annulée',
      context: {
        ...base,
        customerName: 'Test Client',
        orderId: '999005',
        cancellationDate: new Date().toLocaleDateString('fr-FR'),
        refundAmount: '129.00',
        emailTitle: 'Commande annulée · Reboul Store',
        datum: 'ORDER // RBL-OR-CXL',
      },
    },
    {
      template: 'stock-available',
      subject: '[TEST Reboul] Produit dispo',
      context: {
        ...base,
        productName: 'Produit test — template e-mail',
        productUrl: `${frontendUrl}/catalog`,
        productImageUrl: null as string | null,
        variant: 'Noir · M',
        emailTitle: 'Stock disponible · Reboul Store',
        datum: 'STOCK // RBL-STK-AVL',
      },
    },
  ];

  for (const job of jobs) {
    await mailer.sendMail({
      to: TEST_TO,
      subject: job.subject,
      template: job.template,
      context: job.context,
    });
    console.log(`Sent: ${job.template}`);
  }

  await app.close();
  console.log(`Done — ${jobs.length} messages → ${TEST_TO}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
