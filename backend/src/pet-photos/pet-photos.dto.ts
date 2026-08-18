import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePetPhotoDto {
  @IsString()
  @MinLength(1)
  imageUrl: string;

  @IsString()
  @MinLength(1)
  imageKey: string;

  @IsOptional()
  @IsBoolean()
  isProfile?: boolean;
}
