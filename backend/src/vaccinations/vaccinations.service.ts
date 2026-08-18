import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PetsService } from '../pets/pets.service';
import { CreateVaccinationDto, UpdateVaccinationDto } from './vaccinations.dto';

@Injectable()
export class VaccinationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly petsService: PetsService,
  ) {}

  async create(ownerId: string, petId: string, dto: CreateVaccinationDto) {
    await this.petsService.findOneForOwner(ownerId, petId);
    return this.prisma.vaccination.create({
      data: {
        ...dto,
        dateGiven: dto.dateGiven ? new Date(dto.dateGiven) : undefined,
        nextDueDate: dto.nextDueDate ? new Date(dto.nextDueDate) : undefined,
        petId,
      },
    });
  }

  async findAllForPet(ownerId: string, petId: string) {
    await this.petsService.findOneForOwner(ownerId, petId);
    return this.prisma.vaccination.findMany({ where: { petId }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(ownerId: string, id: string) {
    const record = await this.prisma.vaccination.findUnique({ where: { id }, include: { pet: true } });
    if (!record) throw new NotFoundException('Vaccination not found');
    if (record.pet.ownerId !== ownerId) throw new ForbiddenException();
    return record;
  }

  async update(ownerId: string, id: string, dto: UpdateVaccinationDto) {
    await this.findOne(ownerId, id);
    return this.prisma.vaccination.update({
      where: { id },
      data: {
        ...dto,
        dateGiven: dto.dateGiven ? new Date(dto.dateGiven) : undefined,
        nextDueDate: dto.nextDueDate ? new Date(dto.nextDueDate) : undefined,
      },
    });
  }

  async remove(ownerId: string, id: string) {
    await this.findOne(ownerId, id);
    await this.prisma.vaccination.delete({ where: { id } });
  }
}
