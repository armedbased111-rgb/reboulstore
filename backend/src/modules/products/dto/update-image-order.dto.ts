import { IsNumber, Min } from 'class-validator';

export class UpdateImageOrderDto {
  @IsNumber()
  @Min(0)
  order: number;
}