import { Module } from '@nestjs/common';
import { PetVaccinationsController, VaccinationsController } from './vaccinations.controller';
import { VaccinationsService } from './vaccinations.service';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [PetsModule],
  controllers: [PetVaccinationsController, VaccinationsController],
  providers: [VaccinationsService],
})
export class VaccinationsModule {}
