import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ContentService {
  constructor(private readonly prisma: PrismaService) {}

  async getLandingContent() {
    const [features, testimonials, metrics] = await Promise.all([
      this.prisma.feature.findMany({ orderBy: { createdAt: 'asc' } }),
      this.prisma.testimonial.findMany({ orderBy: { createdAt: 'asc' } }),
      this.prisma.landingMetric.findMany({ orderBy: { createdAt: 'asc' } }),
    ])

    return { features, testimonials, metrics }
  }
}
