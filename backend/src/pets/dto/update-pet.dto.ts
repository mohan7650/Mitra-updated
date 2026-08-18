import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { FAVORITE_ACTIVITIES, FAVORITE_TREATS, PERSONALITY_TRAITS } from '../pet-options';

export class UpdatePetDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  species?: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsString()
  weightUnit?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  coatType?: string;

  @IsOptional()
  @IsString()
  coatColor?: string;

  @IsOptional()
  @IsString()
  uniqueMarks?: string;

  @IsOptional()
  @IsBoolean()
  microchipped?: boolean;

  @IsOptional()
  @IsBoolean()
  vaccinated?: boolean;

  @IsOptional()
  @IsBoolean()
  neutered?: boolean;

  @IsOptional()
  @IsBoolean()
  hasAllergies?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsIn(PERSONALITY_TRAITS, { each: true })
  personalityTraits?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @IsIn(FAVORITE_ACTIVITIES, { each: true })
  favoriteActivities?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @IsIn(FAVORITE_TREATS, { each: true })
  favoriteTreats?: string[];
}
