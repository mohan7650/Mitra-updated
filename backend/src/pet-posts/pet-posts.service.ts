import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PetsService } from '../pets/pets.service';
import { CreatePetPostDto } from './pet-posts.dto';

@Injectable()
export class PetPostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly petsService: PetsService,
  ) {}

  async create(ownerId: string, petId: string, dto: CreatePetPostDto) {
    await this.petsService.findOneForOwner(ownerId, petId);
    return this.prisma.petPost.create({ data: { ...dto, petId } });
  }

  findFeed() {
    return this.prisma.petPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: { pet: true, interactions: true },
      take: 50,
    });
  }

  async findOne(id: string) {
    const post = await this.prisma.petPost.findUnique({
      where: { id },
      include: { pet: true, interactions: true },
    });
    if (!post) throw new NotFoundException('Post not found');
    return post;
  }

  async remove(ownerId: string, id: string) {
    const post = await this.prisma.petPost.findUnique({ where: { id }, include: { pet: true } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.pet.ownerId !== ownerId) throw new ForbiddenException();
    await this.prisma.petPost.delete({ where: { id } });
  }
}
