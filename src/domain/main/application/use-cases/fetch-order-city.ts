import { Either, left, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { RecipientRepository } from '../repositories/recipient-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NoUpcomingDeliveryError } from './errors/no-upcoming-delivey-error'
import { OrderRepository } from '../repositories/order-repository'
import { Order } from '../../enterprise/entities/order'
import { Recipient } from '../../enterprise/entities/recipient'

interface FetchCityProps {
  orders: Order[]
  recipientNearby: Recipient[]
}

interface FetchOrderCityUseCaseRequest {
  deliverymanId: string
  query: string
  page: number
}

type FetchOrderCityUseCaseResponse = Either<
  ResourceNotFoundError | NoUpcomingDeliveryError,
  {
    deliveries: FetchCityProps
  }
>

export class FetchOrderCityUseCase {
  constructor(
    private recipientRepository: RecipientRepository,
    private deliverymanRepository: DeliverymanRepository,
    private orderRepository: OrderRepository,
  ) {}

  async execute({
    deliverymanId,
    query,
    page,
  }: FetchOrderCityUseCaseRequest): Promise<FetchOrderCityUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(deliverymanId)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    const recipientNearby = await this.recipientRepository.searchByCities(query)

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
