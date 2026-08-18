import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { VetClinicsService } from './vet-clinics.service';
import { CreateVetClinicDto, UpdateVetClinicDto } from './vet-clinics.dto';

@UseGuards(JwtAuthGuard)
@Controller('vet-clinics')
export class VetClinicsController {
  constructor(private readonly service: VetClinicsService) {}

  @Post()
  create(@Body() dto: CreateVetClinicDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVetClinicDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
