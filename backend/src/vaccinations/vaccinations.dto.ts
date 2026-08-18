import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateVaccinationDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsDateString()
  dateGiven?: string;

  @IsOptional()
  @IsDateString()
  nextDueDate?: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateVaccinationDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsDateString()
  dateGiven?: string;

  @IsOptional()
  @IsDateString()
  nextDueDate?: string;

  @IsOptional()
  @IsString()
  provider?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
