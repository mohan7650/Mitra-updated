import { Module } from '@nestjs/common';
import { PetMedicationsController, MedicationsController } from './medications.controller';
import { MedicationsService } from './medications.service';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [PetsModule],
  controllers: [PetMedicationsController, MedicationsController],
  providers: [MedicationsService],
})
export class MedicationsModule {}
