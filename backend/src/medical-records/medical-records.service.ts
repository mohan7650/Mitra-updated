import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PetsService } from '../pets/pets.service';
import { CreateMedicalRecordDto, UpdateMedicalRecordDto } from './medical-records.dto';

@Injectable()
export class MedicalRecordsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly petsService: PetsService,
  ) {}

  async create(ownerId: string, petId: string, dto: CreateMedicalRecordDto) {
    await this.petsService.findOneForOwner(ownerId, petId);
    return this.prisma.medicalRecord.create({
      data: { ...dto, recordDate: new Date(dto.recordDate), petId },
    });
  }

  async findAllForPet(ownerId: string, petId: string) {
    await this.petsService.findOneForOwner(ownerId, petId);
    return this.prisma.medicalRecord.findMany({ where: { petId }, orderBy: { recordDate: 'desc' } });
  }

  async findOne(ownerId: string, id: string) {
    const record = await this.prisma.medicalRecord.findUnique({ where: { id }, include: { pet: true } });
    if (!record) throw new NotFoundException('Medical record not found');
    if (record.pet.ownerId !== ownerId) throw new ForbiddenException();
    return record;
  }

  async update(ownerId: string, id: string, dto: UpdateMedicalRecordDto) {
    await this.findOne(ownerId, id);
    return this.prisma.medicalRecord.update({
      where: { id },
      data: { ...dto, recordDate: dto.recordDate ? new Date(dto.recordDate) : undefined },
    });
  }

  async remove(ownerId: string, id: string) {
    await this.findOne(ownerId, id);
    await this.prisma.medicalRecord.delete({ where: { id } });
  }
}
