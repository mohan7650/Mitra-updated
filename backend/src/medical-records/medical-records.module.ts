import { Module } from '@nestjs/common';
import { PetMedicalRecordsController, MedicalRecordsController } from './medical-records.controller';
import { MedicalRecordsService } from './medical-records.service';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [PetsModule],
  controllers: [PetMedicalRecordsController, MedicalRecordsController],
  providers: [MedicalRecordsService],
})
export class MedicalRecordsModule {}
