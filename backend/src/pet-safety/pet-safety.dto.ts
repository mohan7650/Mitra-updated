import { IsOptional, IsString } from 'class-validator';

export class UpsertPetSafetyProfileDto {
  @IsOptional()
  @IsString()
  microchipNumber?: string;

  @IsOptional()
  @IsString()
  qrCodeId?: string;

  @IsOptional()
  @IsString()
  emergencyNotes?: string;
}
