import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImagesOptimizationService } from './images-optimization.service';
import { ImagesOptimizationController } from './images-optimization.controller';
import { ImagesOptimizationScheduler } from './images-optimization.scheduler';
import { Image } from '../../entities/image.entity';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Image]),
    CloudinaryModule,
  ],
  providers: [ImagesOptimizationService, ImagesOptimizationScheduler],
  controllers: [ImagesOptimizationController],
  exports: [ImagesOptimizationService],
})
export class ImagesOptimizationModule {}

