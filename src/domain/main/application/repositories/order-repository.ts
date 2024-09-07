import { Order } from '../../enterprise/entities/order'

export abstract class OrderRepository {
  abstract findById(id: string): Promise<Order | null>
  abstract findManyOrderIds(ids: string[], page: number): Promise<Order[]>
  abstract findManyDeliveries(
    deliverymanId: string,
    page: number,
  ): Promise<Order[]>

  abstract save(order: Order): Promise<void>
  abstract create(order: Order): Promise<void>
  abstract delete(order: Order): Promise<void>
}
