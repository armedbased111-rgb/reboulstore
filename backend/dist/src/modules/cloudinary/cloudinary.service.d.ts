import { ConfigService } from '@nestjs/config';
import { UploadApiResponse, UploadApiOptions, TransformationOptions } from 'cloudinary';
interface UploadedFile {
    buffer: Buffer;
    mimetype: string;
    originalname: string;
}
export interface CloudinaryUploadOptions {
    folder?: string;
    overwrite?: boolean;
    eager?: UploadApiOptions['eager'];
    transformation?: UploadApiOptions['transformation'];
}
export declare class CloudinaryService {
    private readonly configService;
    constructor(configService: ConfigService);
    uploadImage(file: UploadedFile, options?: CloudinaryUploadOptions): Promise<UploadApiResponse>;
    deleteImage(publicId: string): Promise<any>;
    getTransformedImageUrl(publicId: string, transformation?: TransformationOptions | TransformationOptions[]): string;
    getProductThumbnailUrls(publicId: string): {
        small: string;
        medium: string;
        large: string;
    };
}
export {};
