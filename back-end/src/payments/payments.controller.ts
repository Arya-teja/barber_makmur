import {
  Body,
  Controller,
  Param,
  Get,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BookingStatus, PaymentStatus, Role } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async listMine(@Request() req: { user: { sub: string } }) {
    return this.payments.listForUser(req.user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async listAll() {
    return this.payments.listAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('upload-proof')
  @UseInterceptors(FileInterceptor('file'))
  async uploadProof(@UploadedFile() file: Express.Multer.File) {
    return this.payments.uploadProof(file);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('booking/:bookingId')
  async updateByBookingId(
    @Param('bookingId') bookingId: string,
    @Request() req: { user: { sub: string; role: string } },
    @Body()
    payload: { paymentProofUrl: string; status: BookingStatus },
  ) {
    return this.payments.updatePaymentByBookingId(bookingId, payload, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('status')
  async updateStatus(
    @Body() payload: { paymentId: string; status: PaymentStatus },
  ) {
    return this.payments.updateStatus(payload.paymentId, payload.status);
  }
}
