import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { PetsService } from '../pets/pets.service';
import { UpsertPetSafetyProfileDto } from './pet-safety.dto';
import { generateQrCodeId } from './qr-code-id.util';

const MAX_QR_GENERATION_ATTEMPTS = 5;

@Injectable()
export class PetSafetyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly petsService: PetsService,
  ) {}

  async find(ownerId: string, petId: string) {
    await this.petsService.findOneForOwner(ownerId, petId);
    return this.ensureProfile(petId);
  }

  async upsert(ownerId: string, petId: string, dto: UpsertPetSafetyProfileDto) {
    await this.petsService.findOneForOwner(ownerId, petId);
    await this.ensureProfile(petId);
    return this.prisma.petSafetyProfile.update({ where: { petId }, data: dto });
  }

  // Creates the safety profile (with a stable, unique QR code) the first time it's
  // needed, rather than for every pet up front — avoids empty rows for pets whose
  // owner never opens the safety section.
  private async ensureProfile(petId: string) {
    const existing = await this.prisma.petSafetyProfile.findUnique({ where: { petId } });
    if (existing?.qrCodeId) return existing;
    return this.assignQrCode(petId);
  }

  private async assignQrCode(petId: string) {
    for (let attempt = 0; attempt < MAX_QR_GENERATION_ATTEMPTS; attempt++) {
      const qrCodeId = generateQrCodeId();
      try {
        return await this.prisma.petSafetyProfile.upsert({
          where: { petId },
          create: { petId, qrCodeId },
          update: { qrCodeId },
        });
      } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
          continue;
        }
        throw err;
      }
    }
    throw new Error('Could not generate a unique QR code id');
  }

  async findByQrCode(qrCodeId: string) {
    const profile = await this.prisma.petSafetyProfile.findUnique({
      where: { qrCodeId },
      select: {
        qrCodeId: true,
        emergencyNotes: true,
        pet: {
          select: {
            name: true,
            species: true,
            breed: true,
            photos: {
              where: { isProfile: true },
              take: 1,
              select: { imageUrl: true },
            },
          },
        },
      },
    });
    if (!profile) return null;

    return {
      qrCodeId: profile.qrCodeId as string,
      petName: profile.pet.name,
      species: profile.pet.species,
      breed: profile.pet.breed,
      emergencyNotes: profile.emergencyNotes,
      profilePhotoUrl: profile.pet.photos[0]?.imageUrl ?? null,
    };
  }
}
