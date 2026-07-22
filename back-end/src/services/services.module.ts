import { Module } from '@nestjs/common'
import { CloudinaryModule } from '../cloudinary/cloudinary.module'
import { ServicesController } from './services.controller'
import { ServicesService } from './services.service'

@Module({
  imports: [CloudinaryModule],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}