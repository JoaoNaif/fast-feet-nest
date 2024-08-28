import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order } from '@/domain/main/enterprise/entities/order'
import { Prisma, Order as PrismaOrder } from '@prisma/client'

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder): Order {
    return Order.create(
      {
        recipientId: new UniqueEntityId(raw.recipientId),
        deliverymanId: raw.deliverymanId
          ? new UniqueEntityId(raw.deliverymanId)
          : null,
        status: raw.status,
        createAt: raw.createdAt,
        deliveredTo: raw.deliveredTo,
        removeIn: raw.removeIn,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      recipientId: order.recipientId.toString(),
      deliverymanId: order.deliverymanId?.toString(),
      status: order.status,
      createdAt: order.createAt,
      deliveredTo: order.deliveredTo,
      removeIn: order.removeIn,
    }
  }
}
