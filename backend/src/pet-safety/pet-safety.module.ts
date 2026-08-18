import { Module } from '@nestjs/common';
import { PetSafetyController } from './pet-safety.controller';
import { PetSafetyService } from './pet-safety.service';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [PetsModule],
  controllers: [PetSafetyController],
  providers: [PetSafetyService],
})
export class PetSafetyModule {}
