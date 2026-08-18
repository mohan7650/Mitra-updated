import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PetsService } from '../pets/pets.service';
import { CreatePetPhotoDto } from './pet-photos.dto';

@Injectable()
export class PetPhotosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly petsService: PetsService,
  ) {}

  async create(ownerId: string, petId: string, dto: CreatePetPhotoDto) {
    await this.petsService.findOneForOwner(ownerId, petId);
    if (dto.isProfile) {
      await this.prisma.petPhoto.updateMany({ where: { petId }, data: { isProfile: false } });
    }
    return this.prisma.petPhoto.create({ data: { ...dto, petId } });
  }

  async findAllForPet(ownerId: string, petId: string) {
    await this.petsService.findOneForOwner(ownerId, petId);
    return this.prisma.petPhoto.findMany({ where: { petId }, orderBy: { createdAt: 'desc' } });
  }

  async remove(ownerId: string, id: string) {
    const record = await this.prisma.petPhoto.findUnique({ where: { id }, include: { pet: true } });
    if (!record) throw new NotFoundException('Photo not found');
    if (record.pet.ownerId !== ownerId) throw new ForbiddenException();
    await this.prisma.petPhoto.delete({ where: { id } });
  }
}
