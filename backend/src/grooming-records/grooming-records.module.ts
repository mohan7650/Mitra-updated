import { Module } from '@nestjs/common';
import { PetGroomingRecordsController, GroomingRecordsController } from './grooming-records.controller';
import { GroomingRecordsService } from './grooming-records.service';
import { PetsModule } from '../pets/pets.module';

@Module({
  imports: [PetsModule],
  controllers: [PetGroomingRecordsController, GroomingRecordsController],
  providers: [GroomingRecordsService],
})
export class GroomingRecordsModule {}
