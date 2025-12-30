import { IsString, IsOptional, IsBoolean, MaxLength, MinLength } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name: string; // Ex: "SS2025", "AW2025"

  @IsString()
  @IsOptional()
  @MaxLength(255)
  displayName?: string; // Ex: "Printemps-Été 2025"

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean; // Par défaut false
}

