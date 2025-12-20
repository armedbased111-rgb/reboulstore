"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrdersController = void 0;
const common_1 = require("@nestjs/common");
const orders_service_1 = require("./orders.service");
const create_order_dto_1 = require("./dto/create-order.dto");
const update_order_status_dto_1 = require("./dto/update-order-status.dto");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const email_service_1 = require("./email.service");
const invoice_service_1 = require("./invoice.service");
let OrdersController = class OrdersController {
    ordersService;
    emailService;
    invoiceService;
    constructor(ordersService, emailService, invoiceService) {
        this.ordersService = ordersService;
        this.emailService = emailService;
        this.invoiceService = invoiceService;
    }
    async create(createOrderDto) {
        return this.ordersService.create(createOrderDto);
    }
    async findMyOrders(req) {
        return this.ordersService.findByUser(req.user.id);
    }
    async findAll() {
        return this.ordersService.findAll();
    }
    async findOne(id, req) {
        return this.ordersService.findOne(id, req.user.id);
    }
    async testEmail(body) {
        if (process.env.NODE_ENV === 'production') {
            return { message: 'This endpoint is disabled in production' };
        }
        try {
            switch (body.type) {
                case 'registration':
                    await this.emailService.sendRegistrationConfirmation(body.email, body.firstName || 'Test User');
                    return {
                        message: 'Registration email sent successfully to ' + body.email,
                    };
                default:
                    return { error: 'Invalid email type. Use: registration' };
            }
        }
        catch (error) {
            return { error: error.message, stack: error.stack };
        }
    }
    async cancel(id, req) {
        return this.ordersService.cancel(id, req.user.id);
    }
    async updateStatus(id, updateStatusDto) {
        return this.ordersService.updateStatus(id, updateStatusDto);
    }
    async downloadInvoice(id, req, res) {
        try {
            const order = await this.ordersService.findOneEntity(id, req.user.id);
            const pdfBuffer = await this.invoiceService.generateInvoicePDF(order);
            res.set({
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename=facture-${order.id.slice(0, 8)}.pdf`,
                'Content-Length': pdfBuffer.length,
            });
            res.send(pdfBuffer);
        }
        catch (error) {
            console.error('Erreur génération facture:', error);
            res
                .status(500)
                .json({ message: 'Erreur lors de la génération de la facture' });
        }
    }
    async capturePayment(id) {
        return this.ordersService.capturePayment(id);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_order_dto_1.CreateOrderDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findMyOrders", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)('test-email'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "testEmail", null);
__decorate([
    (0, common_1.Patch)(':id/cancel'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "cancel", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_order_status_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Get)(':id/invoice'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Res)({ passthrough: false })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "downloadInvoice", null);
__decorate([
    (0, common_1.Post)(':id/capture'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrdersController.prototype, "capturePayment", null);
exports.OrdersController = OrdersController = __decorate([
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService,
        email_service_1.EmailService,
        invoice_service_1.InvoiceService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map