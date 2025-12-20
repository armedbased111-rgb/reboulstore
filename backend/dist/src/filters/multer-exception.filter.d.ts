import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class MulterExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost): void;
}
