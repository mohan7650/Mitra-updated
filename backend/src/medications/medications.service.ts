import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PetsService } from '../pets/pets.service';
import { CreateMedicationDto, UpdateMedicationDto } from './medications.dto';

@Injectable()
export class MedicationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly petsService: PetsService,
  ) {}

  async create(ownerId: string, petId: string, dto: CreateMedicationDto) {
    await this.petsService.findOneForOwner(ownerId, petId);
    return this.prisma.medication.create({
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        petId,
      },
    });
  }

  async findAllForPet(ownerId: string, petId: string) {
    await this.petsService.findOneForOwner(ownerId, petId);
    return this.prisma.medication.findMany({ where: { petId }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(ownerId: string, id: string) {
    const record = await this.prisma.medication.findUnique({ where: { id }, include: { pet: true } });
    if (!record) throw new NotFoundException('Medication not found');
    if (record.pet.ownerId !== ownerId) throw new ForbiddenException();
    return record;
  }

  async update(ownerId: string, id: string, dto: UpdateMedicationDto) {
    await this.findOne(ownerId, id);
    return this.prisma.medication.update({
      where: { id },
      data: {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    });
  }

  async remove(ownerId: string, id: string) {
    await this.findOne(ownerId, id);
    await this.prisma.medication.delete({ where: { id } });
  }
}
