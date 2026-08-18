import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateMedicalRecordDto {
  @IsString()
  @MinLength(1)
  recordType: string;

  @IsString()
  @MinLength(1)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  recordDate: string;

  @IsOptional()
  @IsString()
  vetName?: string;
}

export class UpdateMedicalRecordDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  recordType?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  recordDate?: string;

  @IsOptional()
  @IsString()
  vetName?: string;
}
