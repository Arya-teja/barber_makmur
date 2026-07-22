import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface CreateServiceInput {
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  category: string;
  status: string;
  imageURL: string;
 
}

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async list() {
    return this.prisma.service.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getById(id: string) {
    return this.prisma.service.findUnique({ where: { id } });
  }


  async create(payload: CreateServiceInput) {
    return this.prisma.service.create({ data: payload });
  }

  async update(id: string, payload: Partial<CreateServiceInput>) {
    return this.prisma.service.update({ where: { id }, data: payload });
  }

  async remove(id: string) {
    return this.prisma.service.delete({ where: { id } });
  }
}
