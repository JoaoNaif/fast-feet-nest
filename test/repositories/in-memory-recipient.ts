import {
  findManyNearbyParams,
  RecipientRepository,
} from '@/domain/main/application/repositories/recipient-repository'
import { Recipient } from '@/domain/main/enterprise/entities/recipient'
import { getDistanceBetweenCoordinates } from 'utils/get-distance-between-coordinates'

export class InMemoryRecipientRepository implements RecipientRepository {
  public items: Recipient[] = []

  async findByEmail(email: string) {
    const recipient = this.items.find((item) => item.email === email)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findById(id: string) {
    const recipient = this.items.find((item) => item.id.toString() === id)

    if (!recipient) {
      return null
    }

    return recipient
  }

  async findManyNearby(params: findManyNearbyParams) {
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        {
          latitude: params.latitude,
          longitude: params.longitude,
        },
        {
          latitude: item.latitude,
          longitude: item.longitude,
        },
      )

      return distance < 10 // seeking deliveries up to 10km
    })
  }

  async searchByCities(query: string) {
    return this.items.filter((item) => item.city.includes(query))
  }

  async save(recipient: Recipient) {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    this.items[itemIndex] = recipient
  }

  async create(recipient: Recipient) {
    this.items.push(recipient)
  }

  async delete(recipient: Recipient) {
    const itemIndex = this.items.findIndex((item) => item.id === recipient.id)

    this.items.splice(itemIndex, 1)
  }
}
