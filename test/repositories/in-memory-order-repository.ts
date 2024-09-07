import { DomainEvents } from '@/core/events/domain-events'
import { OrderRepository } from '@/domain/main/application/repositories/order-repository'
import { Order } from '@/domain/main/enterprise/entities/order'

export class InMemoryOrderRepository implements OrderRepository {
  public items: Order[] = []

  async findById(id: string) {
    const order = this.items.find((item) => item.id.toString() === id)

    if (!order) {
      return null
    }

    return order
  }

  async findManyOrderIds(ids: string[], page: number) {
    return this.items
      .filter(
        (order) =>
          ids.includes(order.recipientId.toString()) &&
          order.removeIn === undefined,
      )
      .slice((page - 1) * 20, page * 20)
  }

  async findManyDeliveries(
    deliverymanId: string,
    page: number,
  ): Promise<Order[]> {
    return this.items
      .filter((order) => order.deliverymanId?.toString() === deliverymanId)
      .slice((page - 1) * 20, page * 20)
  }

  async save(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items[itemIndex] = order

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async create(order: Order) {
    this.items.push(order)

    DomainEvents.dispatchEventsForAggregate(order.id)
  }

  async delete(order: Order) {
    const itemIndex = this.items.findIndex((item) => item.id === order.id)

    this.items.splice(itemIndex, 1)
  }
}
