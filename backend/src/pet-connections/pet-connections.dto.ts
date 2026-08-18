import { IsIn, IsString, MinLength } from 'class-validator';

export class CreatePetConnectionDto {
  @IsString()
  @MinLength(1)
  receiverId: string;
}

export class UpdatePetConnectionDto {
  @IsIn(['ACCEPTED', 'REJECTED'])
  status: 'ACCEPTED' | 'REJECTED';
}
