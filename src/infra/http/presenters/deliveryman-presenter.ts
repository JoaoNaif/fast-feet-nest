import { Deliveryman } from '@/domain/main/enterprise/entities/deliveryman'

export class DeliverymanPresenter {
  static toHTTP(deliveryman: Deliveryman) {
    return {
      id: deliveryman.id.toString(),
      cpf: deliveryman.cpf.value,
      name: deliveryman.name,
      role: deliveryman.role,
      latitude: deliveryman.latitude,
      longitude: deliveryman.longitude,
      createdAt: deliveryman.createdAt,
    }
  }
}
