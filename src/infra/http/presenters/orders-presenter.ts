import { Order } from '@/domain/main/enterprise/entities/order'

export class OrdersPresenter {
  static toHTTP(orders: Order[]) {
    return {
      orders: orders.map((order) => {
        return {
          id: order.id.toString(),
          recipientId: order.recipientId.toString(),
          deliverymanId: order.deliverymanId?.toString(),
          status: order.status,
          attachment: order.attachment,
          createAt: order.createAt,
          removeIn: order.removeIn,
          deliveredTo: order.deliveredTo,
        }
      }),
    }
  }
}
