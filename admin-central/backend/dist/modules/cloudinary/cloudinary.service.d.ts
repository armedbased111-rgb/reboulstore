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
    resource_type?: 'image' | 'video' | 'auto';
}
export declare class CloudinaryService {
    private readonly configService;
    constructor(configService: ConfigService);
    uploadImage(file: UploadedFile, options?: CloudinaryUploadOptions): Promise<UploadApiResponse>;
    uploadVideo(file: UploadedFile, options?: CloudinaryUploadOptions): Promise<UploadApiResponse>;
    deleteImage(publicId: string): Promise<any>;
    deleteVideo(publicId: string): Promise<any>;
    getTransformedImageUrl(publicId: string, transformation?: TransformationOptions | TransformationOptions[]): string;
}
export {};
