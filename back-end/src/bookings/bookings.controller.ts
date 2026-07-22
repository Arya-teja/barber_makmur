import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BookingStatus, Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { BookingsService } from './bookings.service';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async listMine(@Request() req: { user: { sub: string } }) {
    return this.bookings.listForUser(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my')
  async listMy(@Request() req: { user: { sub: string } }) {
    return this.bookings.listForUser(req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async listAll() {
    return this.bookings.listAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getById(
    @Param('id') id: string,
    @Request() req: { user: { sub: string; role: string } },
  ) {
    const booking = await this.bookings.getById(id);

    if (req.user.role !== 'ADMIN' && booking.userId !== req.user.sub) {
      throw new ForbiddenException('Booking not found');
    }

    return booking;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req: { user: { sub: string } },
    @Body() payload: any,
  ) {
    return this.bookings.create({
      userId: req.user.sub,
      serviceId: payload.serviceId,
      barberName: payload.barberName,
      date: payload.date,
      time: payload.time,
      notes: payload.notes,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/confirm')
  async confirm(@Param('id') id: string) {
    return this.bookings.confirm(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch(':id/cancel')
  async cancel(@Param('id') id: string) {
    return this.bookings.cancel(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('status')
  async updateStatus(
    @Body() payload: { bookingId: string; status: BookingStatus },
  ) {
    return this.bookings.updateStatus(payload.bookingId, payload.status);
  }
}
