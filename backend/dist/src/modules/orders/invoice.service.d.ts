import { Order } from '../../entities/order.entity';
export declare class InvoiceService {
    generateInvoicePDF(order: Order): Promise<Buffer>;
    private getStatusLabel;
}
