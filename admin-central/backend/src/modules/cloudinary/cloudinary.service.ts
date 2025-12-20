import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  v2 as cloudinary,
  UploadApiErrorResponse,
  UploadApiResponse,
  UploadApiOptions,
  TransformationOptions,
} from 'cloudinary';

// Type pour les fichiers uploadés (compatible avec multer)
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

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: UploadedFile,
    options: CloudinaryUploadOptions = {},
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder ?? 'admin-uploads',
          resource_type: options.resource_type ?? 'image',
          overwrite: options.overwrite ?? false,
          eager: options.eager,
          transformation:
            options.transformation ??
            ({
              quality: 'auto',
              fetch_format: 'auto',
            } as TransformationOptions),
          use_filename: true,
          unique_filename: true,
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            reject(
              new InternalServerErrorException(
                `Cloudinary upload failed: ${error.message ?? 'Unknown error'}`,
              ),
            );
            return;
          }

          if (!result) {
            reject(
              new InternalServerErrorException(
                'Cloudinary upload failed: empty response',
              ),
            );
            return;
          }

          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async uploadVideo(
    file: UploadedFile,
    options: CloudinaryUploadOptions = {},
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder ?? 'admin-uploads/videos',
          resource_type: 'video',
          overwrite: options.overwrite ?? false,
          eager: options.eager,
          transformation: options.transformation,
          use_filename: true,
          unique_filename: true,
        },
        (
          error: UploadApiErrorResponse | undefined,
          result: UploadApiResponse | undefined,
        ) => {
          if (error) {
            reject(
              new InternalServerErrorException(
                `Cloudinary upload failed: ${error.message ?? 'Unknown error'}`,
              ),
            );
            return;
          }

          if (!result) {
            reject(
              new InternalServerErrorException(
                'Cloudinary upload failed: empty response',
              ),
            );
            return;
          }

          resolve(result);
        },
      );

      uploadStream.end(file.buffer);
    });
  }

  async deleteImage(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'image',
      });
      return result;
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Cloudinary delete failed: ${error?.message ?? 'Unknown error'}`,
      );
    }
  }

  async deleteVideo(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: 'video',
      });
      return result;
    } catch (error: any) {
      throw new InternalServerErrorException(
        `Cloudinary delete failed: ${error?.message ?? 'Unknown error'}`,
      );
    }
  }

  getTransformedImageUrl(
    publicId: string,
    transformation?: TransformationOptions | TransformationOptions[],
  ) {
    return cloudinary.url(publicId, {
      transformation,
      secure: true,
    });
  }
}
