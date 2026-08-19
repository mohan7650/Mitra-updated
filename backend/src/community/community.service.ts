import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const SEARCH_RESULT_LIMIT = 20;

const PUBLIC_PET_SELECT = {
  id: true,
  name: true,
  species: true,
  customSpecies: true,
  breed: true,
  bio: true,
  personalityTraits: true,
  photos: {
    where: { isProfile: true },
    take: 1,
    select: { imageUrl: true },
  },
} as const;

function toPublicPet(pet: {
  id: string;
  name: string;
  species: string;
  customSpecies: string | null;
  breed: string | null;
  bio: string | null;
  personalityTraits: string[];
  photos: { imageUrl: string }[];
}) {
  return {
    id: pet.id,
    name: pet.name,
    species: pet.species,
    customSpecies: pet.customSpecies,
    breed: pet.breed,
    bio: pet.bio,
    personalityTraits: pet.personalityTraits,
    profilePhotoUrl: pet.photos[0]?.imageUrl ?? null,
  };
}

@Injectable()
export class CommunityService {
  constructor(private readonly prisma: PrismaService) {}

  async searchPets(ownerId: string, q: string) {
    const pets = await this.prisma.pet.findMany({
      where: {
        ownerId: { not: ownerId },
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { breed: { contains: q, mode: 'insensitive' } },
          { customSpecies: { contains: q, mode: 'insensitive' } },
        ],
      },
      select: PUBLIC_PET_SELECT,
      orderBy: { name: 'asc' },
      take: SEARCH_RESULT_LIMIT,
    });
    return pets.map(toPublicPet);
  }

  async getPublicPet(id: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      select: PUBLIC_PET_SELECT,
    });
    if (!pet) throw new NotFoundException('Pet not found');
    return toPublicPet(pet);
  }
}
