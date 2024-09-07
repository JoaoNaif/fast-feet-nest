import { FetchProps } from '@/domain/main/application/use-cases/types/fetchProps'

export class DeliveriesPresenter {
  static toHTTP(deliveries: FetchProps) {
    return {
      orders: deliveries.orders.map((order) => {
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
      recipientNearby: deliveries.recipientNearby.map((recipient) => {
        return {
          id: recipient.id.toString(),
          email: recipient.email,
          name: recipient.name,
          address: recipient.address,
          number: recipient.number,
          uf: recipient.uf,
          city: recipient.city,
          cep: recipient.cep,
          latitude: recipient.latitude,
          longitude: recipient.longitude,
          createdAt: recipient.createdAt,
        }
      }),
    }
  }
}
