import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmergencyContactsService } from './emergency-contacts.service';
import { CreateEmergencyContactDto, UpdateEmergencyContactDto } from './emergency-contacts.dto';

function userId(req: Request) {
  return (req.user as { sub: string }).sub;
}

@UseGuards(JwtAuthGuard)
@Controller('emergency-contacts')
export class EmergencyContactsController {
  constructor(private readonly service: EmergencyContactsService) {}

  @Post()
  create(@Req() req: Request, @Body() dto: CreateEmergencyContactDto) {
    return this.service.create(userId(req), dto);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.service.findAllForUser(userId(req));
  }

  @Patch(':id')
  update(@Req() req: Request, @Param('id') id: string, @Body() dto: UpdateEmergencyContactDto) {
    return this.service.update(userId(req), id, dto);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.service.remove(userId(req), id);
  }
}
