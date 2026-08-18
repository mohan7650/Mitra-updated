import { Module } from '@nestjs/common';
import { VetClinicsController } from './vet-clinics.controller';
import { VetClinicsService } from './vet-clinics.service';

@Module({
  controllers: [VetClinicsController],
  providers: [VetClinicsService],
})
export class VetClinicsModule {}
