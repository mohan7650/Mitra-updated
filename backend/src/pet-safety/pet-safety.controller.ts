import { Body, Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PetSafetyService } from './pet-safety.service';
import { UpsertPetSafetyProfileDto } from './pet-safety.dto';

function ownerId(req: Request) {
  return (req.user as { sub: string }).sub;
}

@UseGuards(JwtAuthGuard)
@Controller('pets/:petId/safety-profile')
export class PetSafetyController {
  constructor(private readonly service: PetSafetyService) {}

  @Get()
  find(@Req() req: Request, @Param('petId') petId: string) {
    return this.service.find(ownerId(req), petId);
  }

  @Put()
  upsert(@Req() req: Request, @Param('petId') petId: string, @Body() dto: UpsertPetSafetyProfileDto) {
    return this.service.upsert(ownerId(req), petId, dto);
  }
}
