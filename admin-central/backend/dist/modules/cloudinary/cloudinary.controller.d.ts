import { CloudinaryService } from './cloudinary.service';
export declare class CloudinaryController {
    private readonly cloudinaryService;
    constructor(cloudinaryService: CloudinaryService);
    uploadImage(file: Express.Multer.File): Promise<{
        url: string;
        publicId: string;
        width: number;
        height: number;
        format: string;
    }>;
    uploadVideo(file: Express.Multer.File): Promise<{
        url: string;
        publicId: string;
        width: number;
        height: number;
        format: string;
        duration: any;
    }>;
}
