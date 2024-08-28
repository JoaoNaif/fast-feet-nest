import { Deliveryman } from '../../enterprise/entities/deliveryman'

export abstract class DeliverymanRepository {
  abstract findById(id: string): Promise<Deliveryman | null>
  abstract findByCPF(cpf: string): Promise<Deliveryman | null>
  abstract save(deliveryman: Deliveryman): Promise<void>
  abstract create(deliveryman: Deliveryman): Promise<void>
  abstract delete(deliveryman: Deliveryman): Promise<void>
}
