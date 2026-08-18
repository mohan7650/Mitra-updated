import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PetPhotosService } from './pet-photos.service';
import { CreatePetPhotoDto } from './pet-photos.dto';

function ownerId(req: Request) {
  return (req.user as { sub: string }).sub;
}

@UseGuards(JwtAuthGuard)
@Controller('pets/:petId/photos')
export class PetPhotosController {
  constructor(private readonly service: PetPhotosService) {}

  @Post()
  create(@Req() req: Request, @Param('petId') petId: string, @Body() dto: CreatePetPhotoDto) {
    return this.service.create(ownerId(req), petId, dto);
  }

  @Get()
  findAll(@Req() req: Request, @Param('petId') petId: string) {
    return this.service.findAllForPet(ownerId(req), petId);
  }
}

@UseGuards(JwtAuthGuard)
@Controller('photos')
export class PhotosController {
  constructor(private readonly service: PetPhotosService) {}

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.service.remove(ownerId(req), id);
  }
}
