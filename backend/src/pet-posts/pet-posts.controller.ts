import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PetPostsService } from './pet-posts.service';
import { CreatePetPostDto, CreateInteractionDto } from './pet-posts.dto';

function ownerId(req: Request) {
  return (req.user as { sub: string }).sub;
}

@UseGuards(JwtAuthGuard)
@Controller('pets/:petId/posts')
export class PetPostsSubController {
  constructor(private readonly service: PetPostsService) {}

  @Post()
  create(@Req() req: Request, @Param('petId') petId: string, @Body() dto: CreatePetPostDto) {
    return this.service.create(ownerId(req), petId, dto);
  }

  @Post(':postId/interactions')
  toggleInteraction(
    @Req() req: Request,
    @Param('petId') petId: string,
    @Param('postId') postId: string,
    @Body() dto: CreateInteractionDto,
  ) {
    return this.service.toggleInteraction(ownerId(req), petId, postId, dto);
  }

  @Post(':postId/repost')
  repost(@Req() req: Request, @Param('petId') petId: string, @Param('postId') postId: string) {
    return this.service.repost(ownerId(req), petId, postId);
  }
}

@UseGuards(JwtAuthGuard)
@Controller('posts')
export class PetPostsController {
  constructor(private readonly service: PetPostsService) {}

  @Get()
  findFeed(@Req() req: Request, @Query('asPetId') asPetId?: string) {
    return this.service.findFeed(ownerId(req), asPetId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  remove(@Req() req: Request, @Param('id') id: string) {
    return this.service.remove(ownerId(req), id);
  }
}
