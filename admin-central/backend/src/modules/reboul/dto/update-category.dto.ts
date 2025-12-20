import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

/**
 * DTO pour mettre à jour une catégorie
 */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
