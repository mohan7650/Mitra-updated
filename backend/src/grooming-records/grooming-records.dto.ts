import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateGroomingRecordDto {
  @IsString()
  @MinLength(1)
  serviceType: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsDateString()
  nextDueDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateGroomingRecordDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  serviceType?: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsDateString()
  nextDueDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
