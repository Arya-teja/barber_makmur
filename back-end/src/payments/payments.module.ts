import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, CloudinaryService, PrismaService],
})
export class PaymentsModule {}