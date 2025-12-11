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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderEmail = exports.EmailType = void 0;
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./order.entity");
var EmailType;
(function (EmailType) {
    EmailType["ORDER_RECEIVED"] = "order_received";
    EmailType["ORDER_CONFIRMED"] = "order_confirmed";
    EmailType["ORDER_SHIPPED"] = "order_shipped";
    EmailType["ORDER_DELIVERED"] = "order_delivered";
    EmailType["ORDER_CANCELLED"] = "order_cancelled";
})(EmailType || (exports.EmailType = EmailType = {}));
let OrderEmail = class OrderEmail {
    id;
    orderId;
    order;
    emailType;
    recipientEmail;
    subject;
    sent;
    errorMessage;
    sentAt;
    createdAt;
};
exports.OrderEmail = OrderEmail;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], OrderEmail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], OrderEmail.prototype, "orderId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => order_entity_1.Order, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'orderId' }),
    __metadata("design:type", order_entity_1.Order)
], OrderEmail.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: EmailType,
    }),
    __metadata("design:type", String)
], OrderEmail.prototype, "emailType", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], OrderEmail.prototype, "recipientEmail", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], OrderEmail.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], OrderEmail.prototype, "sent", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", Object)
], OrderEmail.prototype, "errorMessage", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Object)
], OrderEmail.prototype, "sentAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], OrderEmail.prototype, "createdAt", void 0);
exports.OrderEmail = OrderEmail = __decorate([
    (0, typeorm_1.Entity)('order_emails')
], OrderEmail);
//# sourceMappingURL=order-email.entity.js.map