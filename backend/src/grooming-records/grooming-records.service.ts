import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PetsService } from '../pets/pets.service';
import { CreateGroomingRecordDto, UpdateGroomingRecordDto } from './grooming-records.dto';

@Injectable()
export class GroomingRecordsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly petsService: PetsService,
  ) {}

  async create(ownerId: string, petId: string, dto: CreateGroomingRecordDto) {
    await this.petsService.findOneForOwner(ownerId, petId);
    return this.prisma.groomingRecord.create({
      data: {
        ...dto,
        date: new Date(dto.date),
        nextDueDate: dto.nextDueDate ? new Date(dto.nextDueDate) : undefined,
        petId,
      },
    });
  }

  async findAllForPet(ownerId: string, petId: string) {
    await this.petsService.findOneForOwner(ownerId, petId);
    return this.prisma.groomingRecord.findMany({ where: { petId }, orderBy: { date: 'desc' } });
  }

  async findOne(ownerId: string, id: string) {
    const record = await this.prisma.groomingRecord.findUnique({ where: { id }, include: { pet: true } });
    if (!record) throw new NotFoundException('Grooming record not found');
    if (record.pet.ownerId !== ownerId) throw new ForbiddenException();
    return record;
  }

  async update(ownerId: string, id: string, dto: UpdateGroomingRecordDto) {
    await this.findOne(ownerId, id);
    return this.prisma.groomingRecord.update({
      where: { id },
      data: {
        ...dto,
        date: dto.date ? new Date(dto.date) : undefined,
        nextDueDate: dto.nextDueDate ? new Date(dto.nextDueDate) : undefined,
      },
    });
  }

  async remove(ownerId: string, id: string) {
    await this.findOne(ownerId, id);
    await this.prisma.groomingRecord.delete({ where: { id } });
  }
}
