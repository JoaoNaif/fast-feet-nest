import { OrderAttachmentRepository } from '@/domain/main/application/repositories/order-attachment-repository'
import { PrismaService } from '../prisma.service'
import { OrderAttachment } from '@/domain/main/enterprise/entities/order-attachment'
import { PrismaOrderAttachmentMapper } from '../mappers/prisma-order-attachment-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaOrderAttachmentRepository
  implements OrderAttachmentRepository
{
  constructor(private prisma: PrismaService) {}

  async create(orderAttachment: OrderAttachment): Promise<void> {
    if (orderAttachment) {
      const data = PrismaOrderAttachmentMapper.toPrismaUpdate(orderAttachment)

      await this.prisma.attachment.update(data)
    }
  }

  async delete(attachment: OrderAttachment): Promise<void> {
    await this.prisma.attachment.delete({
      where: {
        id: attachment.attachmentId.toString(),
      },
    })
  }
}
