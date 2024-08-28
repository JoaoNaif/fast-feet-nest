import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderAttachment } from './order-attachment'
import { Optional } from '@/core/types/optional'
import { OrderUpdatedEvent } from '../events/order-update-event'

export interface OrderProps {
  recipientId: UniqueEntityId
  deliverymanId?: UniqueEntityId | null
  status: string
  attachment?: OrderAttachment | null
  createAt: Date
  removeIn?: Date | null
  deliveredTo?: Date | null
}

export class Order extends AggregateRoot<OrderProps> {
  get recipientId() {
    return this.props.recipientId
  }

  get deliverymanId() {
    return this.props.deliverymanId
  }

  get status() {
    return this.props.status
  }

  get attachment() {
    return this.props.attachment
  }

  get createAt() {
    return this.props.createAt
  }

  get removeIn() {
    return this.props.removeIn
  }

  get deliveredTo() {
    return this.props.deliveredTo
  }

  set recipientId(recipientId: UniqueEntityId) {
    this.props.recipientId = recipientId
  }

  set deliverymanId(deliverymanId: UniqueEntityId | undefined | null) {
    this.props.deliverymanId = deliverymanId
    this.touchRemoveIn()
  }

  set status(status: string) {
    if (status !== this.props.status) {
      this.addDomainEvent(new OrderUpdatedEvent(this))
    }

    this.props.status = status
  }

  set attachment(attachment: OrderAttachment | undefined | null) {
    this.props.attachment = attachment
    if (attachment !== undefined) {
      this.touchDeliveredTo()
    }
  }

  private touchRemoveIn() {
    this.props.removeIn = new Date()
  }

  private touchDeliveredTo() {
    this.props.deliveredTo = new Date()
  }

  static create(props: Optional<OrderProps, 'createAt'>, id?: UniqueEntityId) {
    const order = new Order(
      {
        ...props,
        createAt: props.createAt ?? new Date(),
      },
      id,
    )

    const isNewOrder = !id

    if (isNewOrder) {
      order.addDomainEvent(new OrderUpdatedEvent(order))
    }

    return order
  }
}
