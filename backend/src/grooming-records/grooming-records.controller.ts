import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GroomingRecordsService } from './grooming-records.service';
import { CreateGroomingRecordDto, UpdateGroomingRecordDto } from './grooming-records.dto';

function ownerId(req: Request) {
  return (req.user as { sub: string }).sub;
}

@UseGuards(JwtAuthGuard)
@Controller('pets/:petId/grooming-records')
export class PetGroomingRecordsController {
  constructor(private readonly service: GroomingRecordsService) {}

  @Post()
  create(@Req() req: Request, @Param('petId') petId: string, @Body() dto: CreateGroomingRecordDto) {
    return this.service.create(ownerId(req), petId, dto);
  }

  @Get()
  findAll(@Req() req: Request, @Param('petId') petId: string) {
    return this.service.findAllForPet(ownerId(req), petId);
  }
}

@UseGuards(JwtAuthGuard)
@Controller('grooming-records')
export class GroomingRecordsController {
  constructor(private readonly service: GroomingRecordsService) {}

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.service.findOne(ownerId(req), id);
  }

  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateGroomingRecordDto) {
    return this.service.update(ownerId(req), id, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.service.remove(ownerId(req), id);
  }
}
