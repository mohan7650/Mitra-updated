import { BadRequestException, Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommunityService } from './community.service';

@UseGuards(JwtAuthGuard)
@Controller('community/pets')
export class CommunityController {
  constructor(private readonly service: CommunityService) {}

  @Get('search')
  search(@Req() req: Request, @Query('q') q?: string) {
    const query = (q ?? '').trim();
    if (query.length < 2) {
      throw new BadRequestException('Query must be at least 2 characters');
    }
    const ownerId = (req.user as { sub: string }).sub;
    return this.service.searchPets(ownerId, query);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.service.getPublicPet(id);
  }
}
