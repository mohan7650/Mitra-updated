import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PetsService } from '../pets/pets.service';
import { CreateReminderDto, UpdateReminderDto } from './reminders.dto';

@Injectable()
export class RemindersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly petsService: PetsService,
  ) {}

  async create(userId: string, dto: CreateReminderDto) {
    if (dto.petId) {
      await this.petsService.findOneForOwner(userId, dto.petId);
    }
    return this.prisma.reminder.create({
      data: { ...dto, dueAt: new Date(dto.dueAt), userId },
    });
  }

  findAllForUser(userId: string) {
    return this.prisma.reminder.findMany({ where: { userId }, orderBy: { dueAt: 'asc' } });
  }

  async findOne(userId: string, id: string) {
    const record = await this.prisma.reminder.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Reminder not found');
    if (record.userId !== userId) throw new ForbiddenException();
    return record;
  }

  async update(userId: string, id: string, dto: UpdateReminderDto) {
    await this.findOne(userId, id);
    return this.prisma.reminder.update({
      where: { id },
      data: { ...dto, dueAt: dto.dueAt ? new Date(dto.dueAt) : undefined },
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);
    await this.prisma.reminder.delete({ where: { id } });
  }
}
