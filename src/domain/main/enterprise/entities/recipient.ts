import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface RecipientProps {
  email: string
  name: string
  address: string
  number: number
  uf: string
  city: string
  cep: number
  latitude: number
  longitude: number
  createdAt: Date
}

export class Recipient extends Entity<RecipientProps> {
  get email() {
    return this.props.email
  }

  get name() {
    return this.props.name
  }

  get address() {
    return this.props.address
  }

  get number() {
    return this.props.number
  }

  get uf() {
    return this.props.uf
  }

  get city() {
    return this.props.city
  }

  get cep() {
    return this.props.cep
  }

  get latitude() {
    return this.props.latitude
  }

  get longitude() {
    return this.props.longitude
  }

  get createdAt() {
    return this.props.createdAt
  }

  set name(name: string) {
    this.props.name = name
  }

  set address(address: string) {
    this.props.address = address
  }

  set cep(cep: number) {
    this.props.cep = cep
  }

  set latitude(latitude: number) {
    this.props.latitude = latitude
  }

  set longitude(longitude: number) {
    this.props.longitude = longitude
  }

  static create(
    props: Optional<RecipientProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const recipient = new Recipient(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return recipient
  }
}
