import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PetsService } from '../pets/pets.service';
import { UpsertPetSafetyProfileDto } from './pet-safety.dto';

@Injectable()
export class PetSafetyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly petsService: PetsService,
  ) {}

  async find(ownerId: string, petId: string) {
    await this.petsService.findOneForOwner(ownerId, petId);
    return this.prisma.petSafetyProfile.findUnique({ where: { petId } });
  }

  async upsert(ownerId: string, petId: string, dto: UpsertPetSafetyProfileDto) {
    await this.petsService.findOneForOwner(ownerId, petId);
    return this.prisma.petSafetyProfile.upsert({
      where: { petId },
      create: { ...dto, petId },
      update: dto,
    });
  }
}
