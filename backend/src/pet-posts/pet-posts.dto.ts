import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreatePetPostDto {
  @IsOptional()
  @IsString()
  caption?: string;
}

export const INTERACTION_TYPES = ['PAW'] as const;

export class CreateInteractionDto {
  @IsIn(INTERACTION_TYPES)
  type: (typeof INTERACTION_TYPES)[number];
}
