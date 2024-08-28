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
    attachment: OrderAttachment,
  ): Prisma.AttachmentUpdateArgs {
    return {
      where: {
        id: attachment.attachmentId.toString(),
      },
      data: {
        orderId: attachment.orderId.toString(),
      },
    }
  }
}
