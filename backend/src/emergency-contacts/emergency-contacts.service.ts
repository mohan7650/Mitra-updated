import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmergencyContactDto, UpdateEmergencyContactDto } from './emergency-contacts.dto';

@Injectable()
export class EmergencyContactsService {
  constructor(private readonly prisma: PrismaService) {}

  create(userId: string, dto: CreateEmergencyContactDto) {
    return this.prisma.emergencyContact.create({ data: { ...dto, userId } });
  }

  findAllForUser(userId: string) {
    return this.prisma.emergencyContact.findMany({ where: { userId }, orderBy: { createdAt: 'asc' } });
  }

  async findOne(userId: string, id: string) {
    const record = await this.prisma.emergencyContact.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Emergency contact not found');
    if (record.userId !== userId) throw new ForbiddenException();
    return record;
  }

  async update(userId: string, id: string, dto: UpdateEmergencyContactDto) {
    await this.findOne(userId, id);
    return this.prisma.emergencyContact.update({ where: { id }, data: dto });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.emergencyContact.delete({ where: { id } });
  }
}
