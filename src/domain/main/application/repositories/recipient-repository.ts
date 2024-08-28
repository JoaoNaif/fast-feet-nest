import { Recipient } from '../../enterprise/entities/recipient'

export interface findManyNearbyParams {
  latitude: number
  longitude: number
}

export abstract class RecipientRepository {
  abstract findByEmail(email: string): Promise<Recipient | null>
  abstract findById(id: string): Promise<Recipient | null>
  abstract findManyNearby(params: findManyNearbyParams): Promise<Recipient[]>
  abstract searchByCities(query: string): Promise<Recipient[]>
  abstract save(recipient: Recipient): Promise<void>
  abstract create(recipient: Recipient): Promise<void>
  abstract delete(recipient: Recipient): Promise<void>
}
