import { Injectable } from '@nestjs/common'
import { createHash } from 'crypto'
import { Membership, Role } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        membership: true,
        createdAt: true,
      },
    })
  }

  async create(payload: {
    name: string
    email: string
    phone?: string
    password: string
    role?: Role
    membership?: Membership
  }) {
    const passwordHash = this.hashPassword(payload.password)
    return this.prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        passwordHash,
        role: payload.role ?? Role.USER,
        membership: payload.membership ?? Membership.STANDARD,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        membership: true,
        createdAt: true,
      },
    })
  }

  async update(
    id: string,
    payload: { role?: Role; membership?: Membership },
  ) {
    return this.prisma.user.update({
      where: { id },
      data: payload,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        membership: true,
        createdAt: true,
      },
    })
  }

  async remove(id: string) {
    return this.prisma.user.delete({ where: { id } })
  }

  private hashPassword(password: string) {
    const salt = process.env.PASSWORD_SALT ?? 'barber_noir_salt'
    return createHash('sha256').update(`${salt}:${password}`).digest('hex')
  }
}
