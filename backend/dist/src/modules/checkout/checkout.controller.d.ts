import type { RawBodyRequest } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutSessionDto } from './dto/create-checkout-session.dto';
import { CheckoutSessionResponseDto } from './dto/checkout-session-response.dto';
export declare class CheckoutController {
    private readonly checkoutService;
    constructor(checkoutService: CheckoutService);
    createSession(createCheckoutSessionDto: CreateCheckoutSessionDto, req: any): Promise<CheckoutSessionResponseDto>;
    handleWebhook(req: RawBodyRequest<Request>, signature: string): Promise<{
        received: boolean;
    }>;
}
