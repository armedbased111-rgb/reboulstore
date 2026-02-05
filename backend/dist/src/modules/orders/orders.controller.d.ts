import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { EmailService } from './email.service';
import { InvoiceService } from './invoice.service';
import type { Response } from 'express';
export declare class OrdersController {
    private readonly ordersService;
    private readonly emailService;
    private readonly invoiceService;
    constructor(ordersService: OrdersService, emailService: EmailService, invoiceService: InvoiceService);
    create(createOrderDto: CreateOrderDto): Promise<import("./dto/order-response.dto").OrderResponseDto>;
    applyCoupon(applyCouponDto: ApplyCouponDto): Promise<{
        code: string;
        discountAmount: number;
        totalBeforeDiscount: number;
        totalAfterDiscount: number;
    }>;
    findMyOrders(req: any): Promise<import("./dto/order-response.dto").OrderResponseDto[]>;
    findAll(): Promise<import("./dto/order-response.dto").OrderResponseDto[]>;
    findOne(id: number, req: any): Promise<import("./dto/order-response.dto").OrderResponseDto>;
    testEmail(body: {
        type: string;
        email: string;
        firstName?: string;
    }): Promise<{
        message: string;
        error?: undefined;
        stack?: undefined;
    } | {
        error: string;
        message?: undefined;
        stack?: undefined;
    } | {
        error: any;
        stack: any;
        message?: undefined;
    }>;
    cancel(id: number, req: any): Promise<import("./dto/order-response.dto").OrderResponseDto>;
    updateStatus(id: number, updateStatusDto: UpdateOrderStatusDto): Promise<import("./dto/order-response.dto").OrderResponseDto>;
    downloadInvoice(id: number, req: any, res: Response): Promise<void>;
    capturePayment(id: number): Promise<import("./dto/order-response.dto").OrderResponseDto>;
}
