import { OrderAttachment } from '../../enterprise/entities/order-attachment'

export abstract class OrderAttachmentRepository {
  abstract create(attachment: OrderAttachment): Promise<void>
  abstract delete(attachment: OrderAttachment): Promise<void>
}
