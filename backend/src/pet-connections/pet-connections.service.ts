import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PetsService } from '../pets/pets.service';
import { CreatePetConnectionDto, UpdatePetConnectionDto } from './pet-connections.dto';

@Injectable()
export class PetConnectionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly petsService: PetsService,
  ) {}

  async create(ownerId: string, petId: string, dto: CreatePetConnectionDto) {
    await this.petsService.findOneForOwner(ownerId, petId);
    if (dto.receiverId === petId) {
      throw new BadRequestException('A pet cannot connect with itself');
    }
    return this.prisma.petConnection.create({
      data: { requesterId: petId, receiverId: dto.receiverId, status: 'PENDING' },
    });
  }

  async findAllForPet(ownerId: string, petId: string) {
    await this.petsService.findOneForOwner(ownerId, petId);
    return this.prisma.petConnection.findMany({
      where: { OR: [{ requesterId: petId }, { receiverId: petId }] },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(ownerId: string, id: string, dto: UpdatePetConnectionDto) {
    const connection = await this.prisma.petConnection.findUnique({
      where: { id },
      include: { receiverPet: true },
    });
    if (!connection) throw new NotFoundException('Connection not found');
    if (connection.receiverPet.ownerId !== ownerId) throw new ForbiddenException();
    return this.prisma.petConnection.update({ where: { id }, data: { status: dto.status } });
  }
}
