import { Recipient } from '@/domain/main/enterprise/entities/recipient'

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
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
  }
}
