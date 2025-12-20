"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const pdfkit_1 = __importDefault(require("pdfkit"));
let InvoiceService = class InvoiceService {
    async generateInvoicePDF(order) {
        return new Promise((resolve, reject) => {
            try {
                const doc = new pdfkit_1.default({ margin: 50 });
                const chunks = [];
                doc.on('data', (chunk) => chunks.push(chunk));
                doc.on('end', () => resolve(Buffer.concat(chunks)));
                doc.on('error', reject);
                doc.fontSize(24).font('Helvetica-Bold').text('REBOULSTORE 2.0', 50, 50);
                doc
                    .fontSize(10)
                    .font('Helvetica')
                    .text('Votre boutique de vêtements et accessoires', 50, 80);
                doc.moveTo(50, 100).lineTo(550, 100).stroke();
                doc.fontSize(20).font('Helvetica-Bold').text('FACTURE', 50, 120);
                doc
                    .fontSize(10)
                    .font('Helvetica')
                    .text(`Numéro de commande: ${order.id.slice(0, 8).toUpperCase()}`, 50, 150)
                    .text(`Date: ${new Date(order.createdAt).toLocaleDateString('fr-FR')}`, 50, 165)
                    .text(`Statut: ${this.getStatusLabel(order.status)}`, 50, 180);
                doc.fontSize(12).font('Helvetica-Bold').text('LIVRAISON', 50, 220);
                const customerInfo = order.customerInfo;
                doc
                    .fontSize(10)
                    .font('Helvetica')
                    .text(customerInfo.name, 50, 240)
                    .text(customerInfo.address.street, 50, 255)
                    .text(`${customerInfo.address.postalCode} ${customerInfo.address.city}`, 50, 270)
                    .text(customerInfo.address.country, 50, 285)
                    .text(customerInfo.phone || '', 50, 300);
                let yPosition = 340;
                doc.fontSize(12).font('Helvetica-Bold').text('ARTICLES', 50, yPosition);
                yPosition += 25;
                doc
                    .fontSize(9)
                    .font('Helvetica-Bold')
                    .text('Article', 50, yPosition)
                    .text('Quantité', 350, yPosition)
                    .text('Prix unitaire', 420, yPosition)
                    .text('Total', 500, yPosition);
                yPosition += 20;
                doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
                yPosition += 10;
                if (order.cart?.items) {
                    for (const item of order.cart.items) {
                        const product = item.variant?.product;
                        const variant = item.variant;
                        if (product && variant) {
                            const itemName = `${product.name} - ${variant.color} ${variant.size}`;
                            const quantity = item.quantity;
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
                yPosition += 10;
                doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
                yPosition += 20;
                const subtotal = Number(order.total);
                doc
                    .fontSize(10)
                    .font('Helvetica')
                    .text('Sous-total:', 400, yPosition)
                    .text(`${subtotal.toFixed(2)} €`, 500, yPosition, { align: 'right' });
                yPosition += 20;
                doc
                    .fontSize(10)
                    .font('Helvetica')
                    .text('Livraison:', 400, yPosition)
                    .text('Incluse', 500, yPosition, { align: 'right' });
                yPosition += 25;
                doc.moveTo(400, yPosition).lineTo(550, yPosition).stroke();
                yPosition += 15;
                const totalFinal = Number(order.total);
                doc
                    .fontSize(12)
                    .font('Helvetica-Bold')
                    .text('TOTAL:', 400, yPosition)
                    .text(`${totalFinal.toFixed(2)} €`, 500, yPosition, {
                    align: 'right',
                });
                doc
                    .fontSize(8)
                    .font('Helvetica')
                    .text('Merci pour votre commande !', 50, 750, {
                    align: 'center',
                    width: 500,
                })
                    .text('Pour toute question, contactez-nous à support@reboulstore.com', 50, 765, { align: 'center', width: 500 });
                doc.end();
            }
            catch (error) {
                reject(error);
            }
        });
    }
    getStatusLabel(status) {
        const labels = {
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
};
exports.InvoiceService = InvoiceService;
exports.InvoiceService = InvoiceService = __decorate([
    (0, common_1.Injectable)()
], InvoiceService);
//# sourceMappingURL=invoice.service.js.map