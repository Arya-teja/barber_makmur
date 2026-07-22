import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { AdminModule } from './admin/admin.module';
import { BarbersModule } from './barbers/barbers.module';
import { ContentModule } from './content/content.module';
import { PaymentsModule } from './payments/payments.module';
import { PrismaModule } from './prisma/prisma.module';
import { ServicesModule } from './services/services.module';
import { UsersModule } from './users/users.module';
import {CloudinaryModule} from "./cloudinary/cloudinary.module";
@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ServicesModule,
    BookingsModule,
    PaymentsModule,
    AdminModule,
    BarbersModule,
    ContentModule,
    UsersModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
