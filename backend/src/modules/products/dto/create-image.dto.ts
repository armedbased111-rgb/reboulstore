import { IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateImageDto {
  @IsString()
  @IsOptional()
  alt?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @IsOptional()
  order?: number;
}