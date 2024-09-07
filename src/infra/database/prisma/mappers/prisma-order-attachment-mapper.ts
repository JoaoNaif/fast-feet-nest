import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderAttachment } from '@/domain/main/enterprise/entities/order-attachment'
import { Prisma, Attachment as PrismaOrderAttachment } from '@prisma/client'

export class PrismaOrderAttachmentMapper {
  static toDomain(raw: PrismaOrderAttachment): OrderAttachment {
    if (!raw.orderId) {
      throw new Error('Invalid attachment type.')
    }

    return OrderAttachment.create(
      {
        attachmentId: new UniqueEntityId(raw.id),
        orderId: new UniqueEntityId(raw.orderId),
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrismaUpdate(
    orderAttachment: OrderAttachment,
  ): Prisma.AttachmentUpdateArgs {
    const attachmentId = orderAttachment.attachmentId.toString()
    return {
      where: {
        id: attachmentId,
      },
      data: {
        order: {
          connect: { id: orderAttachment.orderId.toString() },
        },
      },
    }
  }
}
