import { Either, left, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { OrderRepository } from '../repositories/order-repository'
import { Order } from '../../enterprise/entities/order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderAlreadyPickedUpError } from './errors/order-already-picked-up-error'

interface WithdrawOrderUseCaseRequest {
  deliverymanId: string
  orderId: string
}

type WithdrawOrderUseCaseResponse = Either<
  ResourceNotFoundError | OrderAlreadyPickedUpError,
  {
    order: Order
  }
>

export class WithdrawOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private deliverymanRepository: DeliverymanRepository,
  ) {}

  async execute({
    deliverymanId,
    orderId,
  }: WithdrawOrderUseCaseRequest): Promise<WithdrawOrderUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (order.deliverymanId !== undefined && order.removeIn !== undefined) {
      return left(new OrderAlreadyPickedUpError())
    }

    order.deliverymanId = new UniqueEntityId(deliverymanId)
    order.status = `Pedido retirado por ${deliveryman.name}`

    await this.orderRepository.save(order)

    return right({
      order,
    })
  }
}
