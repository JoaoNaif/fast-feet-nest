import { OrderRepository } from '@/domain/main/application/repositories/order-repository'
import { PrismaService } from '../prisma.service'
import { Order } from '@/domain/main/enterprise/entities/order'
import { Injectable } from '@nestjs/common'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { OrderAttachmentRepository } from '@/domain/main/application/repositories/order-attachment-repository'
import { DomainEvents } from '@/core/events/domain-events'
import { CacheRepository } from '@/infra/cache/cache-repository'

@Injectable()
export class PrismaOrderRepository implements OrderRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
    private orderAttachmentRepository: OrderAttachmentRepository,
  ) {}

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
    })

    if (!order) {
      return null
    }

    return PrismaOrderMapper.toDomain(order)
  }

  async findManyOrderIds(ids: string[], page: number): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        recipientId: {
          in: ids,
        },
        removeIn: null,
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    return orders.map(PrismaOrderMapper.toDomain)
  }

  async findManyDeliveries(
    deliverymanId: string,
    page: number,
  ): Promise<Order[]> {
    const cacheKey = `orders:${deliverymanId}:deliveries:page:${page}`
    // const cacheTTL = 60 * 60 // Define TTL de 1 hora

    const cacheHit = await this.cache.get(cacheKey)

    if (cacheHit) {
      const cachedOrders = JSON.parse(cacheHit)

      const orderDeliveries = cachedOrders.map(PrismaOrderMapper.toDomain)
      return orderDeliveries
    }

    const orders = await this.prisma.order.findMany({
      where: {
        deliverymanId,
      },
      skip: (page - 1) * 20,
      take: 20,
    })

    await this.cache.set(cacheKey, JSON.stringify(orders))

    const orderDeliveries = orders.map(PrismaOrderMapper.toDomain)

    return orderDeliveries
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.update({
      where: {
        id: data.id,
      },
      data,
    })

    if (order.attachment) {
      await this.orderAttachmentRepository.create(order.attachment)
    }

    const cacheKey = `orders:${order.deliverymanId}:deliveries:*`

    await this.cache.delete(cacheKey)

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async create(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order)

    await this.prisma.order.create({
      data,
    })

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async delete(order: Order): Promise<void> {
    await this.prisma.order.delete({
      where: {
        id: order.id.toString(),
      },
    })
  }
}
