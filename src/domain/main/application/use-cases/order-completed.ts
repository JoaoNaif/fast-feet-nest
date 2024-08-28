import { Either, left, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { OrderRepository } from '../repositories/order-repository'
import { Order } from '../../enterprise/entities/order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderAttachment } from '../../enterprise/entities/order-attachment'

interface OrderCompletedUseCaseRequest {
  deliverymanId: string
  orderId: string
  attachmentId: string
}

type OrderCompletedUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    order: Order
  }
>

export class OrderCompletedUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private deliverymanRepository: DeliverymanRepository,
  ) {}

  async execute({
    deliverymanId,
    orderId,
    attachmentId,
  }: OrderCompletedUseCaseRequest): Promise<OrderCompletedUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const orderAttachment = OrderAttachment.create({
      attachmentId: new UniqueEntityId(attachmentId),
      orderId: order.id,
    })

    order.status = `Pedido entregue por ${deliveryman.name}`
    order.attachment = orderAttachment

    await this.orderRepository.save(order)

    return right({
      order,
    })
  }
}
