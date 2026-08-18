import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}

  create(ownerId: string, dto: CreatePetDto) {
    return this.prisma.pet.create({
      data: {
        ...dto,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        ownerId,
      },
    });
  }

  findAllForOwner(ownerId: string) {
    return this.prisma.pet.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOneForOwner(ownerId: string, id: string) {
    const pet = await this.prisma.pet.findUnique({ where: { id } });
    if (!pet) throw new NotFoundException('Pet not found');
    if (pet.ownerId !== ownerId) throw new ForbiddenException();
    return pet;
  }

  async update(ownerId: string, id: string, dto: UpdatePetDto) {
    await this.findOneForOwner(ownerId, id);
    return this.prisma.pet.update({
      where: { id },
      data: {
        ...dto,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      },
    });
  }

  async remove(ownerId: string, id: string) {
    await this.findOneForOwner(ownerId, id);
    await this.prisma.pet.delete({ where: { id } });
  }

  async getProfile(ownerId: string, id: string) {
    const pet = await this.prisma.pet.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        species: true,
        customSpecies: true,
        breed: true,
        dateOfBirth: true,
        gender: true,
        bio: true,
        weight: true,
        weightUnit: true,
        size: true,
        coatType: true,
        coatColor: true,
        uniqueMarks: true,
        microchipped: true,
        vaccinated: true,
        neutered: true,
        hasAllergies: true,
        personalityTraits: true,
        favoriteActivities: true,
        favoriteTreats: true,
        ownerId: true,
        owner: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
        photos: {
          where: { isProfile: true },
          take: 1,
          select: { id: true, imageUrl: true, isProfile: true, createdAt: true },
        },
        safetyProfile: {
          select: { id: true, microchipNumber: true, qrCodeId: true, emergencyNotes: true },
        },
        medications: {
          where: { active: true },
          select: { id: true, name: true, dosage: true, frequency: true, startDate: true, endDate: true },
        },
        allergies: {
          select: { id: true, name: true, severity: true, notes: true },
        },
        weightRecords: {
          orderBy: { recordedAt: 'desc' },
          take: 1,
          select: { weight: true, unit: true, recordedAt: true },
        },
        vaccinations: {
          where: { nextDueDate: { gte: new Date() } },
          orderBy: { nextDueDate: 'asc' },
          take: 1,
          select: { id: true, name: true, nextDueDate: true, provider: true },
        },
      },
    });

    if (!pet) throw new NotFoundException('Pet not found');
    if (pet.ownerId !== ownerId) throw new ForbiddenException();

    const [emergencyContacts, pawMoments, pawPalsSent, pawPalsReceived, nextCheckup] = await Promise.all([
      this.prisma.emergencyContact.findMany({
        where: { userId: ownerId },
        select: { id: true, name: true, relationship: true, phone: true },
      }),
      this.prisma.petPost.count({ where: { petId: id } }),
      this.prisma.petConnection.count({ where: { requesterId: id, status: 'ACCEPTED' } }),
      this.prisma.petConnection.count({ where: { receiverId: id, status: 'ACCEPTED' } }),
      this.prisma.reminder.findFirst({
        where: { petId: id, type: 'CHECKUP', completed: false, dueAt: { gte: new Date() } },
        orderBy: { dueAt: 'asc' },
        select: { id: true, title: true, dueAt: true },
      }),
    ]);

    const latestWeightRecord = pet.weightRecords[0];
    const latestWeight = latestWeightRecord
      ? {
          weight: latestWeightRecord.weight,
          unit: latestWeightRecord.unit,
          recordedAt: latestWeightRecord.recordedAt,
          source: 'record' as const,
        }
      : pet.weight != null
        ? { weight: pet.weight, unit: pet.weightUnit, recordedAt: null, source: 'pet' as const }
        : null;

    return {
      pet: {
        id: pet.id,
        name: pet.name,
        species: pet.species,
        customSpecies: pet.customSpecies,
        breed: pet.breed,
        dateOfBirth: pet.dateOfBirth,
        gender: pet.gender,
        bio: pet.bio,
        weight: pet.weight,
        weightUnit: pet.weightUnit,
        size: pet.size,
        coatType: pet.coatType,
        coatColor: pet.coatColor,
        uniqueMarks: pet.uniqueMarks,
        microchipped: pet.microchipped,
        vaccinated: pet.vaccinated,
        neutered: pet.neutered,
        hasAllergies: pet.hasAllergies,
        personalityTraits: pet.personalityTraits,
        favoriteActivities: pet.favoriteActivities,
        favoriteTreats: pet.favoriteTreats,
      },
      owner: pet.owner,
      profilePhoto: pet.photos[0] ?? null,
      health: {
        nextVaccination: pet.vaccinations[0] ?? null,
        activeMedications: pet.medications,
        allergies: pet.allergies,
        latestWeight,
        nextCheckup: nextCheckup ?? null,
      },
      emergencyContacts,
      safetyProfile: pet.safetyProfile ?? null,
      socialStats: {
        pawMoments,
        pawPals: pawPalsSent + pawPalsReceived,
      },
    };
  }
}
