import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Deliveryman } from '@/domain/main/enterprise/entities/deliveryman'
import { Cpf } from '@/domain/main/enterprise/entities/value-objects/cpf'
import { Prisma, Deliveryman as PrismaDeliveryman } from '@prisma/client'

export class PrismaDeliverymanMapper {
  static toDomain(raw: PrismaDeliveryman): Deliveryman {
    return Deliveryman.create(
      {
        cpf: Cpf.create(raw.cpf),
        name: raw.name,
        password: raw.password,
        role: raw.role,
        latitude: Number(raw.latitude),
        longitude: Number(raw.longitude),
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    deliveryman: Deliveryman,
  ): Prisma.DeliverymanUncheckedCreateInput {
    return {
      id: deliveryman.id.toString(),
      cpf: deliveryman.cpf.value,
      name: deliveryman.name,
      password: deliveryman.password,
      role: deliveryman.role,
      latitude: deliveryman.latitude,
      longitude: deliveryman.longitude,
      createdAt: deliveryman.createdAt,
    }
  }
}
