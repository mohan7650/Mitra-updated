import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVetClinicDto, UpdateVetClinicDto } from './vet-clinics.dto';

@Injectable()
export class VetClinicsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateVetClinicDto) {
    return this.prisma.vetClinic.create({ data: dto });
  }

  findAll() {
    return this.prisma.vetClinic.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const record = await this.prisma.vetClinic.findUnique({ where: { id } });
    if (!record) throw new NotFoundException('Vet clinic not found');
    return record;
  }

  async update(id: string, dto: UpdateVetClinicDto) {
    await this.findOne(id);
    return this.prisma.vetClinic.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.vetClinic.delete({ where: { id } });
  }
}
