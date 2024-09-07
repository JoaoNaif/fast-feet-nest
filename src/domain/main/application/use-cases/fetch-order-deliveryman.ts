import { Either, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { OrderRepository } from '../repositories/order-repository'
import { Order } from '../../enterprise/entities/order'

interface FetchOrderDeliverymanUseCaseRequest {
  deliverymanId: string
  page: number
}

type FetchOrderDeliverymanUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    orders: Order[]
  }
>

@Injectable()
export class FetchOrderDeliverymanUseCase {
  constructor(private orderRepository: OrderRepository) {}

  async execute({
    deliverymanId,
    page,
  }: FetchOrderDeliverymanUseCaseRequest): Promise<FetchOrderDeliverymanUseCaseResponse> {
    const orders = await this.orderRepository.findManyDeliveries(
      deliverymanId,
      page,
    )

    return right({
      orders,
    })
  }
}
