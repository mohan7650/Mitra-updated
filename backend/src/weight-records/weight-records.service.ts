import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PetsService } from '../pets/pets.service';
import { CreateWeightRecordDto } from './weight-records.dto';

@Injectable()
export class WeightRecordsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly petsService: PetsService,
  ) {}

  async create(ownerId: string, petId: string, dto: CreateWeightRecordDto) {
    await this.petsService.findOneForOwner(ownerId, petId);
    return this.prisma.weightRecord.create({
      data: {
        ...dto,
        recordedAt: dto.recordedAt ? new Date(dto.recordedAt) : undefined,
        petId,
      },
    });
  }

  async findAllForPet(ownerId: string, petId: string) {
    await this.petsService.findOneForOwner(ownerId, petId);
    return this.prisma.weightRecord.findMany({ where: { petId }, orderBy: { recordedAt: 'asc' } });
  }

  async remove(ownerId: string, id: string) {
    const record = await this.prisma.weightRecord.findUnique({ where: { id }, include: { pet: true } });
    if (!record) throw new NotFoundException('Weight record not found');
    if (record.pet.ownerId !== ownerId) throw new ForbiddenException();
    await this.prisma.weightRecord.delete({ where: { id } });
  }
}
