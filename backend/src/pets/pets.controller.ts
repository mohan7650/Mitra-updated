import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PetsService } from './pets.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@UseGuards(JwtAuthGuard)
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  private ownerId(req: Request) {
    return (req.user as { sub: string }).sub;
  }

  @Post()
  create(@Req() req: Request, @Body() dto: CreatePetDto) {
    return this.petsService.create(this.ownerId(req), dto);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.petsService.findAllForOwner(this.ownerId(req));
  }

  @Get(':id')
  findOne(@Req() req: Request, @Param('id') id: string) {
    return this.petsService.findOneForOwner(this.ownerId(req), id);
  }

  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdatePetDto) {
    return this.petsService.update(this.ownerId(req), id, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.petsService.remove(this.ownerId(req), id);
  }
}
