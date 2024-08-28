import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export interface OrderAttachmentProps {
  orderId: UniqueEntityId
  attachmentId: UniqueEntityId
}

export class OrderAttachment extends Entity<OrderAttachmentProps> {
  get orderId() {
    return this.props.orderId
  }

  get attachmentId() {
    return this.props.attachmentId
  }

  static create(props: OrderAttachmentProps, id?: UniqueEntityId) {
    const attachment = new OrderAttachment(props, id)

    return attachment
  }
}
