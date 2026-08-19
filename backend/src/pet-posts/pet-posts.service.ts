import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PetsService } from '../pets/pets.service';
import { CreatePetPostDto, CreateInteractionDto } from './pet-posts.dto';

const petSummarySelect = {
  id: true,
  name: true,
  species: true,
  customSpecies: true,
  breed: true,
  photos: {
    where: { isProfile: true },
    take: 1,
    select: { imageUrl: true },
  },
} as const;

const postInclude = {
  pet: { select: petSummarySelect },
  interactions: true,
  originalPost: {
    include: {
      pet: { select: petSummarySelect },
    },
  },
  _count: { select: { reposts: true } },
} as const;

function shapePost(post: any, asPetId?: string) {
  const { pet, interactions, originalPost, _count, ...rest } = post;
  const pawInteractions = interactions.filter((i: any) => i.type === 'PAW');
  return {
    ...rest,
    pet: {
      id: pet.id,
      name: pet.name,
      species: pet.species,
      customSpecies: pet.customSpecies,
      breed: pet.breed,
      profilePhotoUrl: pet.photos[0]?.imageUrl ?? null,
    },
    interactions,
    pawCount: pawInteractions.length,
    pawedByMe: asPetId ? pawInteractions.some((i: any) => i.petId === asPetId) : false,
    repostCount: _count.reposts,
    originalPost: originalPost
      ? {
          id: originalPost.id,
          caption: originalPost.caption,
          createdAt: originalPost.createdAt,
          pet: {
            id: originalPost.pet.id,
            name: originalPost.pet.name,
            species: originalPost.pet.species,
            customSpecies: originalPost.pet.customSpecies,
            breed: originalPost.pet.breed,
            profilePhotoUrl: originalPost.pet.photos[0]?.imageUrl ?? null,
          },
        }
      : null,
  };
}

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

  async findFeed(ownerId: string | undefined, asPetId?: string) {
    if (asPetId) {
      // Only trust asPetId for computing "pawedByMe" if it actually belongs
      // to the requesting user; otherwise ignore it silently.
      if (!ownerId) {
        asPetId = undefined;
      } else {
        const owned = await this.prisma.pet
          .findUnique({ where: { id: asPetId } })
          .catch(() => null);
        if (!owned || owned.ownerId !== ownerId) asPetId = undefined;
      }
    }

    const posts = await this.prisma.petPost.findMany({
      orderBy: { createdAt: 'desc' },
      include: postInclude,
      take: 50,
    });
    return posts.map((p) => shapePost(p, asPetId));
  }

  async findOne(id: string) {
    const post = await this.prisma.petPost.findUnique({
      where: { id },
      include: postInclude,
    });
    if (!post) throw new NotFoundException('Post not found');
    return shapePost(post);
  }

  async remove(ownerId: string, id: string) {
    const post = await this.prisma.petPost.findUnique({ where: { id }, include: { pet: true } });
    if (!post) throw new NotFoundException('Post not found');
    if (post.pet.ownerId !== ownerId) throw new ForbiddenException();
    await this.prisma.petPost.delete({ where: { id } });
  }

  async toggleInteraction(ownerId: string, petId: string, postId: string, dto: CreateInteractionDto) {
    await this.petsService.findOneForOwner(ownerId, petId);
    const post = await this.prisma.petPost.findUnique({ where: { id: postId } });
    if (!post) throw new NotFoundException('Post not found');

    const existing = await this.prisma.petInteraction.findUnique({
      where: { postId_petId_type: { postId, petId, type: dto.type } },
    });

    if (existing) {
      await this.prisma.petInteraction.delete({ where: { id: existing.id } });
      return { toggled: 'removed' as const, type: dto.type };
    }

    await this.prisma.petInteraction.create({ data: { postId, petId, type: dto.type } });
    return { toggled: 'added' as const, type: dto.type };
  }

  async repost(ownerId: string, petId: string, postId: string) {
    await this.petsService.findOneForOwner(ownerId, petId);
    const original = await this.prisma.petPost.findUnique({ where: { id: postId } });
    if (!original) throw new NotFoundException('Post not found');

    const existing = await this.prisma.petPost.findUnique({
      where: { petId_originalPostId: { petId, originalPostId: postId } },
    });
    if (existing) throw new ConflictException('Already Pawed this forward');

    const created = await this.prisma.petPost.create({
      data: { petId, originalPostId: postId },
      include: postInclude,
    });
    return shapePost(created, petId);
  }
}
