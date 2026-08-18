import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PetConnectionsService } from './pet-connections.service';
import { CreatePetConnectionDto, UpdatePetConnectionDto } from './pet-connections.dto';

function ownerId(req: Request) {
  return (req.user as { sub: string }).sub;
}

@UseGuards(JwtAuthGuard)
@Controller('pets/:petId/connections')
export class PetConnectionsSubController {
  constructor(private readonly service: PetConnectionsService) {}

  @Post()
  create(@Req() req: Request, @Param('petId') petId: string, @Body() dto: CreatePetConnectionDto) {
    return this.service.create(ownerId(req), petId, dto);
  }

  @Get()
  findAll(@Req() req: Request, @Param('petId') petId: string) {
    return this.service.findAllForPet(ownerId(req), petId);
  }
}

@UseGuards(JwtAuthGuard)
@Controller('connections')
export class PetConnectionsController {
  constructor(private readonly service: PetConnectionsService) {}

  @Patch(':id')
  updateStatus(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdatePetConnectionDto) {
    return this.service.updateStatus(ownerId(req), id, dto);
  }
}
