import { Module } from '@nestjs/common';
import { PetWeightRecordsController, WeightRecordsController } from './weight-records.controller';
import { WeightRecordsService } from './weight-records.service';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [PetsModule],
  controllers: [PetWeightRecordsController, WeightRecordsController],
  providers: [WeightRecordsService],
})
export class WeightRecordsModule {}
