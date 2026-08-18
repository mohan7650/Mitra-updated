import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AllergiesService } from './allergies.service';
import { CreateAllergyDto, UpdateAllergyDto } from './allergies.dto';

function ownerId(req: Request) {
  return (req.user as { sub: string }).sub;
}

@UseGuards(JwtAuthGuard)
@Controller('pets/:petId/allergies')
export class PetAllergiesController {
  constructor(private readonly service: AllergiesService) {}

  @Post()
  create(@Req() req: Request, @Param('petId') petId: string, @Body() dto: CreateAllergyDto) {
    return this.service.create(ownerId(req), petId, dto);
  }

  @Get()
  findAll(@Req() req: Request, @Param('petId') petId: string) {
    return this.service.findAllForPet(ownerId(req), petId);
  }
}

@UseGuards(JwtAuthGuard)
@Controller('allergies')
export class AllergiesController {
  constructor(private readonly service: AllergiesService) {}

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.service.findOne(ownerId(req), id);
  }

  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateAllergyDto) {
    return this.service.update(ownerId(req), id, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.service.remove(ownerId(req), id);
  }
}
