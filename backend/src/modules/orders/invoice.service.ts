import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Order } from '../../entities/order.entity';

@Injectable()
export class InvoiceService {
  /**
   * Génère une facture PDF pour une commande
   */
  async generateInvoicePDF(order: Order): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const chunks: Buffer[] = [];

        // Collecter les chunks du PDF
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        // Header - Logo et titre
        doc.fontSize(24).font('Helvetica-Bold').text('REBOULSTORE 2.0', 50, 50);

        doc
          .fontSize(10)
          .font('Helvetica')
          .text('Votre boutique de vêtements et accessoires', 50, 80);

        // Ligne de séparation
        doc.moveTo(50, 100).lineTo(550, 100).stroke();

        // Informations facture
        doc.fontSize(20).font('Helvetica-Bold').text('FACTURE', 50, 120);

        doc
          .fontSize(10)
          .font('Helvetica')
          .text(
            `Numéro de commande: ${order.id.slice(0, 8).toUpperCase()}`,
            50,
            150,
          )
          .text(
            `Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}`,
            50,
            165,
          )
          .text(`Statut: ${this.getStatusLabel(order.status)}`, 50, 180);

        // Adresse de livraison
        doc.fontSize(12).font('Helvetica-Bold').text('LIVRAISON', 50, 220);

        const customerInfo = order.customerInfo;
        doc
          .fontSize(10)
          .font('Helvetica')
          .text(customerInfo.name, 50, 240)
          .text(customerInfo.address.street, 50, 255)
          .text(
            `${customerInfo.address.postalCode} ${customerInfo.address.city}`,
            50,
            270,
          )
          .text(customerInfo.address.country, 50, 285)
          .text(customerInfo.phone || '', 50, 300);

        // Articles
        let yPosition = 340;
        doc.fontSize(12).font('Helvetica-Bold').text('ARTICLES', 50, yPosition);

        yPosition += 25;

        // En-tête du tableau
        doc
          .fontSize(9)
          .font('Helvetica-Bold')
          .text('Article', 50, yPosition)
          .text('Quantité', 350, yPosition)
          .text('Prix unitaire', 420, yPosition)
          .text('Total', 500, yPosition);

        yPosition += 20;

        // Ligne de séparation
        doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();

        yPosition += 10;

        // Liste des articles
        if (order.cart?.items) {
          for (const item of order.cart.items) {
            const product = item.variant?.product;
            const variant = item.variant;

            if (product && variant) {
              const itemName = `${product.name} - ${variant.color} ${variant.size}`;
              const quantity = item.quantity;
              // Prix unitaire (product.price est typé comme un nombre)
              const unitPrice = Number(product.price);
              const total = quantity * unitPrice;

              doc
                .fontSize(9)
                .font('Helvetica')
                .text(itemName, 50, yPosition, { width: 280 })
                .text(quantity.toString(), 350, yPosition)
                .text(`${unitPrice.toFixed(2)} €`, 420, yPosition)
                .text(`${total.toFixed(2)} €`, 500, yPosition);

              yPosition += 25;
            }
          }
        }

        // Ligne de séparation avant le total
        yPosition += 10;
        doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();

        yPosition += 20;

        // Sous-total
        const subtotal = Number(order.total);
        doc
          .fontSize(10)
          .font('Helvetica')
          .text('Sous-total:', 400, yPosition)
          .text(`${subtotal.toFixed(2)} €`, 500, yPosition, { align: 'right' });

        yPosition += 20;

        // Livraison
        doc
          .fontSize(10)
          .font('Helvetica')
          .text('Livraison:', 400, yPosition)
          .text('Incluse', 500, yPosition, { align: 'right' });

        yPosition += 25;

        // Ligne de séparation avant total final
        doc.moveTo(400, yPosition).lineTo(550, yPosition).stroke();

        yPosition += 15;

        // Total
        const totalFinal = Number(order.total);
        doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .text('TOTAL:', 400, yPosition)
          .text(`${totalFinal.toFixed(2)} €`, 500, yPosition, {
            align: 'right',
          });

        // Footer
        doc
          .fontSize(8)
          .font('Helvetica')
          .text('Merci pour votre commande !', 50, 750, {
            align: 'center',
            width: 500,
          })
          .text(
            'Pour toute question, contactez-nous à support@reboulstore.com',
            50,
            765,
            { align: 'center', width: 500 },
          );

        // Finaliser le PDF
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Obtenir le label lisible du statut
   */
  private getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'En attente',
      paid: 'Payée',
      processing: 'En préparation',
      confirmed: 'Confirmée',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
      refunded: 'Remboursée',
    };
    return labels[status] || status;
  }
}
