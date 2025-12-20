import { PartialType } from '@nestjs/mapped-types';
import { CreateBrandDto } from './create-brand.dto';

/**
 * DTO pour mettre à jour une marque
 */
export class UpdateBrandDto extends PartialType(CreateBrandDto) {}
