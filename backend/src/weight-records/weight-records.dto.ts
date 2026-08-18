import { IsDateString, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateWeightRecordDto {
  @IsNumber()
  weight: number;

  @IsString()
  @MinLength(1)
  unit: string;

  @IsOptional()
  @IsDateString()
  recordedAt?: string;
}
