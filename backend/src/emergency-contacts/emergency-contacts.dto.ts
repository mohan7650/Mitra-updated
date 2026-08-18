import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateEmergencyContactDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  relationship?: string;

  @IsString()
  @MinLength(1)
  phone: string;
}

export class UpdateEmergencyContactDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  relationship?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  phone?: string;
}
