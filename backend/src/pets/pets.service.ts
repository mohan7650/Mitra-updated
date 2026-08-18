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
}
