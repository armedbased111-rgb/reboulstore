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
exports.CloudinaryService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const cloudinary_1 = require("cloudinary");
let CloudinaryService = class CloudinaryService {
    configService;
    constructor(configService) {
        this.configService = configService;
        cloudinary_1.v2.config({
            cloud_name: this.configService.get('CLOUDINARY_CLOUD_NAME'),
            api_key: this.configService.get('CLOUDINARY_API_KEY'),
            api_secret: this.configService.get('CLOUDINARY_API_SECRET'),
        });
    }
    async uploadImage(file, options = {}) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({
                folder: options.folder ?? 'products',
                resource_type: 'image',
                overwrite: options.overwrite ?? false,
                eager: options.eager,
                transformation: options.transformation ??
                    {
                        quality: 'auto',
                        fetch_format: 'auto',
                    },
                use_filename: true,
                unique_filename: true,
            }, (error, result) => {
                if (error) {
                    reject(new common_1.InternalServerErrorException(`Cloudinary upload failed: ${error.message ?? 'Unknown error'}`));
                    return;
                }
                if (!result) {
                    reject(new common_1.InternalServerErrorException('Cloudinary upload failed: empty response'));
                    return;
                }
                resolve(result);
            });
            uploadStream.end(file.buffer);
        });
    }
    async deleteImage(publicId) {
        try {
            const result = await cloudinary_1.v2.uploader.destroy(publicId, {
                resource_type: 'image',
            });
            return result;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException(`Cloudinary delete failed: ${error?.message ?? 'Unknown error'}`);
        }
    }
    getTransformedImageUrl(publicId, transformation) {
        return cloudinary_1.v2.url(publicId, {
            transformation,
            secure: true,
        });
    }
    getProductThumbnailUrls(publicId) {
        const baseTransformation = {
            crop: 'fill',
            gravity: 'auto',
            quality: 'auto',
            fetch_format: 'auto',
        };
        return {
            small: this.getTransformedImageUrl(publicId, [
                { ...baseTransformation, width: 200, height: 200 },
            ]),
            medium: this.getTransformedImageUrl(publicId, [
                { ...baseTransformation, width: 400, height: 400 },
            ]),
            large: this.getTransformedImageUrl(publicId, [
                { ...baseTransformation, width: 1200, height: 1200 },
            ]),
        };
    }
};
exports.CloudinaryService = CloudinaryService;
exports.CloudinaryService = CloudinaryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CloudinaryService);
//# sourceMappingURL=cloudinary.service.js.map