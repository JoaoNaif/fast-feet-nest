import { DeliverymanRepository } from '@/domain/main/application/repositories/deliveryman-repository'
import { Deliveryman } from '@/domain/main/enterprise/entities/deliveryman'

export class InMemoryDeliverymanRepository implements DeliverymanRepository {
  public items: Deliveryman[] = []

  async findById(id: string) {
    const deliverman = this.items.find((item) => item.id.toString() === id)

    if (!deliverman) {
      return null
    }

    return deliverman
  }

  async findByCPF(cpf: string) {
    const deliverman = this.items.find((item) => item.cpf.value === cpf)

    if (!deliverman) {
      return null
    }

    return deliverman
  }

  async save(deliveryman: Deliveryman) {
    const itemIndex = this.items.findIndex((item) => item.id === deliveryman.id)

    this.items[itemIndex] = deliveryman
  }

  async create(deliveryman: Deliveryman) {
    this.items.push(deliveryman)
  }

  async delete(deliveryman: Deliveryman) {
    const itemIndex = this.items.findIndex((item) => item.id === deliveryman.id)

    this.items.splice(itemIndex, 1)
  }
}
