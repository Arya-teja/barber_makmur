import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

interface CreateBookingInput {
  userId: string;
  serviceId: string;
  barberName: string;
  date: string;
  time: string;
  notes?: string;
}

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async listAll() {
    return this.prisma.booking.findMany({
      include: { user: true, service: true, payment: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listForUser(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { service: true, payment: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(payload: CreateBookingInput) {
    const service = await this.prisma.service.findUnique({
      where: { id: payload.serviceId },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          ...payload,
          status: BookingStatus.PENDING_PAYMENT,
        },
      });

      await tx.payment.create({
        data: {
          bookingId: booking.id,
          amount: service.price,
          method: 'QRIS',
          status: PaymentStatus.WAITING,
        },
      });

      return tx.booking.findUnique({
        where: { id: booking.id },
        include: { user: true, service: true, payment: true },
      });
    });
  }

  async getById(id: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { user: true, service: true, payment: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async confirm(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.update({
        where: { id },
        data: { status: BookingStatus.CONFIRMED },
      });

      await tx.payment.updateMany({
        where: { bookingId: booking.id },
        data: { status: PaymentStatus.PAID },
      });

      return tx.booking.findUnique({
        where: { id: booking.id },
        include: { user: true, service: true, payment: true },
      });
    });
  }

  async cancel(id: string) {
    return this.prisma.$transaction(async (tx) => {
      const booking = await tx.booking.update({
        where: { id },
        data: { status: BookingStatus.CANCELLED },
      });

      await tx.payment.updateMany({
        where: { bookingId: booking.id },
        data: { status: PaymentStatus.FAILED },
      });

      return tx.booking.findUnique({
        where: { id: booking.id },
        include: { user: true, service: true, payment: true },
      });
    });
  }

  async updateStatus(id: string, status: BookingStatus) {
    const booking = await this.prisma.booking.update({
      where: { id },
      data: { status },
      include: { user: true, service: true, payment: true },
    });

    if (status === BookingStatus.CONFIRMED) {
      await this.prisma.payment.updateMany({
        where: { bookingId: id },
        data: { status: PaymentStatus.PAID },
      });
    }

    if (status === BookingStatus.CANCELLED) {
      await this.prisma.payment.updateMany({
        where: { bookingId: id },
        data: { status: PaymentStatus.FAILED },
      });
    }

    return booking;
  }
}
