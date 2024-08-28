import { DeliverymanRepository } from '@/domain/main/application/repositories/deliveryman-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Deliveryman } from '@/domain/main/enterprise/entities/deliveryman'
import { PrismaDeliverymanMapper } from '../mappers/prisma-deliveyrman-mapper'

@Injectable()
export class PrismaDeliverymanRepository implements DeliverymanRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Deliveryman | null> {
    const deliveryman = await this.prisma.deliveryman.findUnique({
      where: {
        id,
      },
    })

    if (!deliveryman) {
      return null
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async findByCPF(cpf: string): Promise<Deliveryman | null> {
    const deliveryman = await this.prisma.deliveryman.findUnique({
      where: {
        cpf,
      },
    })

    if (!deliveryman) {
      return null
    }

    return PrismaDeliverymanMapper.toDomain(deliveryman)
  }

  async save(deliveryman: Deliveryman): Promise<void> {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)

    await this.prisma.deliveryman.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async create(deliveryman: Deliveryman): Promise<void> {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)

    await this.prisma.deliveryman.create({
      data,
    })
  }

  async delete(deliveryman: Deliveryman): Promise<void> {
    const data = PrismaDeliverymanMapper.toPrisma(deliveryman)

    await this.prisma.deliveryman.delete({
      where: {
        id: data.id,
      },
    })
  }
}
