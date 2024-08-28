import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Recipient } from '@/domain/main/enterprise/entities/recipient'
import { Prisma, Recipient as PrismaRecipient } from '@prisma/client'

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        email: raw.email,
        name: raw.name,
        address: raw.address,
        uf: raw.uf,
        cep: raw.cep,
        city: raw.city,
        number: raw.number,
        latitude: Number(raw.latitude),
        longitude: Number(raw.longitude),
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      id: recipient.id.toString(),
      email: recipient.email,
      name: recipient.name,
      address: recipient.address,
      uf: recipient.uf,
      cep: recipient.cep,
      city: recipient.city,
      number: recipient.number,
      latitude: recipient.latitude,
      longitude: recipient.longitude,
      createdAt: recipient.createdAt,
    }
  }
}
