import { Module } from '@nestjs/common';
import { PetAllergiesController, AllergiesController } from './allergies.controller';
import { AllergiesService } from './allergies.service';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [PetsModule],
  controllers: [PetAllergiesController, AllergiesController],
  providers: [AllergiesService],
})
export class AllergiesModule {}
