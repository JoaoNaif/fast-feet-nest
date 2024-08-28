import { OrderAttachmentRepository } from '@/domain/main/application/repositories/order-attachment-repository'
import { OrderAttachment } from '@/domain/main/enterprise/entities/order-attachment'

export class InMemoryOrderAttachmentRepository
  implements OrderAttachmentRepository
{
  public items: OrderAttachment[] = []

  async create(attachment: OrderAttachment) {
    this.items.push(attachment)
  }

  async delete(attachment: OrderAttachment) {
    const itemIndex = this.items.findIndex((item) => item.id === attachment.id)

    this.items.splice(itemIndex, 1)
  }
}
