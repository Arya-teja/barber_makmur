import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, PaymentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

interface ManualCheckoutPayload {
  paymentProofUrl: string;
  status: BookingStatus;
}

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinary: CloudinaryService,
  ) {}

  async listAll() {
    return this.prisma.payment.findMany({
      include: { booking: { include: { user: true, service: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async listForUser(userId: string) {
    return this.prisma.payment.findMany({
      where: { booking: { userId } },
      include: { booking: { include: { service: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async uploadProof(file: Express.Multer.File) {
    if (!file) {
      throw new NotFoundException('Proof file not found');
    }

    const url = await this.cloudinary.uploadImage(file);
    return { url };
  }

  async updatePaymentByBookingId(
    bookingId: string,
    payload: ManualCheckoutPayload,
    requester?: { sub: string; role: string },
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true, payment: true },
    });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (
      requester &&
      requester.role !== 'ADMIN' &&
      booking.userId !== requester.sub
    ) {
      throw new ForbiddenException('Booking not found');
    }

    const payment = await this.prisma.payment.upsert({
      where: { bookingId },
      create: {
        bookingId,
        amount: booking.service.price,
        method: 'QRIS',
        status: PaymentStatus.WAITING,
        paymentProofUrl: payload.paymentProofUrl,
      },
      update: {
        paymentProofUrl: payload.paymentProofUrl,
      },
    });

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: payload.status },
      include: { user: true, service: true, payment: true },
    });

    return { payment, booking: updatedBooking };
  }

  async updateStatus(id: string, status: PaymentStatus) {
    return this.prisma.payment.update({ where: { id }, data: { status } });
  }

  async updateStatusByBookingId(
    bookingId: string,
    status: BookingStatus,
    paymentProofUrl?: string,
  ) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const payment = await this.prisma.payment.upsert({
      where: { bookingId },
      create: {
        bookingId,
        amount: booking.service.price,
        method: 'QRIS',
        status: PaymentStatus.WAITING,
        paymentProofUrl,
      },
      update: {
        ...(paymentProofUrl ? { paymentProofUrl } : {}),
      },
    });

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: { user: true, service: true, payment: true },
    });

    if (status === BookingStatus.CONFIRMED) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.PAID },
      });
    }

    if (status === BookingStatus.CANCELLED) {
      await this.prisma.payment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.FAILED },
      });
    }

    return { payment, booking: updatedBooking };
  }
}
