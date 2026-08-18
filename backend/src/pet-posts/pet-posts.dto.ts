import { IsOptional, IsString } from 'class-validator';

export class CreatePetPostDto {
  @IsOptional()
  @IsString()
  caption?: string;
}
