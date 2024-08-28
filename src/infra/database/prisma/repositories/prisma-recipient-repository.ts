import {
  findManyNearbyParams,
  RecipientRepository,
} from '@/domain/main/application/repositories/recipient-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Recipient } from '@/domain/main/enterprise/entities/recipient'
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper'

@Injectable()
export class PrismaRecipientRepository implements RecipientRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        email,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientMapper.toDomain(recipient)
  }

  async findById(id: string): Promise<Recipient | null> {
    const recipient = await this.prisma.recipient.findUnique({
      where: {
        id,
      },
    })

    if (!recipient) {
      return null
    }

    return PrismaRecipientMapper.toDomain(recipient)
  }

  async findManyNearby({
    latitude,
    longitude,
  }: findManyNearbyParams): Promise<Recipient[]> {
    const recipient = await this.prisma.$queryRaw<Recipient[]>`
        SELECT * FROM recipient
        WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
    `

    return recipient
  }

  async searchByCities(query: string): Promise<Recipient[]> {
    const recipients = await this.prisma.recipient.findMany({
      where: {
        city: query,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return recipients.map(PrismaRecipientMapper.toDomain)
  }

  async save(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.create({
      data,
    })
  }

  async delete(recipient: Recipient): Promise<void> {
    const data = PrismaRecipientMapper.toPrisma(recipient)

    await this.prisma.recipient.delete({
      where: {
        id: data.id,
      },
    })
  }
}
