import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, totalBookings, totalTransactions, totalServices] =
      await Promise.all([
        this.prisma.user.count(),
        this.prisma.booking.count(),
        this.prisma.payment.count(),
        this.prisma.service.count(),
      ]);

    return { totalUsers, totalBookings, totalTransactions, totalServices };
  }

  async listAccounts() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        membership: true,
        createdAt: true,
      },
    });
  }
}
