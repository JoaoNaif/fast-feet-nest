import { Either, left, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { OrderRepository } from '../repositories/order-repository'
import { Order } from '../../enterprise/entities/order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

interface EditOrderUseCaseRequest {
  adminId: string
  orderId: string
  recipientId: string
}

type EditOrderUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  {
    order: Order
  }
>

@Injectable()
export class EditOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private deliverymanRepository: DeliverymanRepository,
  ) {}

  async execute({
    adminId,
    orderId,
    recipientId,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const admin = await this.deliverymanRepository.findById(adminId)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    if (admin.role === 'MEMBER') {
      return left(new UnauthorizedError())
    }

    const order = await this.orderRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.recipientId = new UniqueEntityId(recipientId)

    await this.orderRepository.save(order)

    return right({
      order,
    })
  }
}
