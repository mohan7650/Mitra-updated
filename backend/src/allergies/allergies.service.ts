import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PetsService } from '../pets/pets.service';
import { CreateAllergyDto, UpdateAllergyDto } from './allergies.dto';

@Injectable()
export class AllergiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly petsService: PetsService,
  ) {}

  async create(ownerId: string, petId: string, dto: CreateAllergyDto) {
    await this.petsService.findOneForOwner(ownerId, petId);
    return this.prisma.allergy.create({ data: { ...dto, petId } });
  }

  async findAllForPet(ownerId: string, petId: string) {
    await this.petsService.findOneForOwner(ownerId, petId);
    return this.prisma.allergy.findMany({ where: { petId }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(ownerId: string, id: string) {
    const record = await this.prisma.allergy.findUnique({ where: { id }, include: { pet: true } });
    if (!record) throw new NotFoundException('Allergy not found');
    if (record.pet.ownerId !== ownerId) throw new ForbiddenException();
    return record;
  }

  async update(ownerId: string, id: string, dto: UpdateAllergyDto) {
    await this.findOne(ownerId, id);
    return this.prisma.allergy.update({ where: { id }, data: dto });
  }

  async remove(ownerId: string, id: string) {
    await this.findOne(ownerId, id);
    await this.prisma.allergy.delete({ where: { id } });
  }
}
