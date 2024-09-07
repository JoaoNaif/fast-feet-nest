import { Either, left, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { RecipientRepository } from '../repositories/recipient-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NoUpcomingDeliveryError } from './errors/no-upcoming-delivey-error'
import { OrderRepository } from '../repositories/order-repository'
import { Order } from '../../enterprise/entities/order'
import { Recipient } from '../../enterprise/entities/recipient'
import { Injectable } from '@nestjs/common'

interface FetchNearbyProps {
  orders: Order[]
  recipientNearby: Recipient[]
}

interface FetchNearbyDeliveryUseCaseRequest {
  deliverymanId: string
  page: number
}

type FetchNearbyDeliveryUseCaseResponse = Either<
  ResourceNotFoundError | NoUpcomingDeliveryError,
  {
    deliveries: FetchNearbyProps
  }
>

@Injectable()
export class FetchNearbyDeliveryUseCase {
  constructor(
    private recipientRepository: RecipientRepository,
    private deliverymanRepository: DeliverymanRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute({
    deliverymanId,
    page,
  }: FetchNearbyDeliveryUseCaseRequest): Promise<FetchNearbyDeliveryUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    const recipientNearby = await this.recipientRepository.findManyNearby({
      latitude: deliveryman.latitude,
      longitude: deliveryman.longitude,
    })

    if (recipientNearby.length === 0) {
      return left(new NoUpcomingDeliveryError())
    }

    const recipientIds = recipientNearby.map((item) => item.id.toString())

    const orders = await this.orderRepository.findManyOrderIds(
      recipientIds,
      page,
    )

    return right({
      deliveries: {
        orders,
        recipientNearby,
      },
    })
  }
}
