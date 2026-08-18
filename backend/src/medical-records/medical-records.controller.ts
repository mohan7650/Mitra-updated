import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from './medical-records.dto';

function ownerId(req: Request) {
  return (req.user as { sub: string }).sub;
}

@UseGuards(JwtAuthGuard)
@Controller('pets/:petId/medical-records')
export class PetMedicalRecordsController {
  constructor(private readonly service: MedicalRecordsService) {}

  @Post()
  create(@Req() req: Request, @Param('petId') petId: string, @Body() dto: CreateMedicalRecordDto) {
    return this.service.create(ownerId(req), petId, dto);
  }

  @Get()
  findAll(@Req() req: Request, @Param('petId') petId: string) {
    return this.service.findAllForPet(ownerId(req), petId);
  }
}

@UseGuards(JwtAuthGuard)
@Controller('medical-records')
export class MedicalRecordsController {
  constructor(private readonly service: MedicalRecordsService) {}

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.service.findOne(ownerId(req), id);
  }

  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateMedicalRecordDto) {
    return this.service.update(ownerId(req), id, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.service.remove(ownerId(req), id);
  }
}
