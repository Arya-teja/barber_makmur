import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreateBarberInput {
  name: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

@Injectable()
export class BarbersService {
  constructor(private readonly prisma: PrismaService) {}

  async listActive() {
    return this.prisma.barber.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(payload: CreateBarberInput) {
    return this.prisma.barber.create({ data: payload });
  }

  async update(id: string, payload: Partial<CreateBarberInput>) {
    return this.prisma.barber.update({ where: { id }, data: payload });
  }

  async remove(id: string) {
    return this.prisma.barber.delete({ where: { id } });
  }
}
