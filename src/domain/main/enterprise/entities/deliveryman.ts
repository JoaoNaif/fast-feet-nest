import { Entity } from '../../../../core/entities/entity'
import { UniqueEntityId } from '../../../../core/entities/unique-entity-id'
import { Optional } from '../../../../core/types/optional'
import { Cpf } from './value-objects/cpf'

export interface DeliverymanProps {
  cpf: Cpf
  name: string
  password: string
  role: 'ADMIN' | 'MEMBER'
  latitude: number
  longitude: number
  createdAt: Date
}

export class Deliveryman extends Entity<DeliverymanProps> {
  get cpf() {
    return this.props.cpf
  }

  get name() {
    return this.props.name
  }

  get password() {
    return this.props.password
  }

  get role() {
    return this.props.role
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

  set password(password: string) {
    this.props.password = password
  }

  set latitude(latitude: number) {
    this.props.latitude = latitude
  }

  set longitude(longitude: number) {
    this.props.longitude = longitude
  }

  static create(
    props: Optional<DeliverymanProps, 'createdAt' | 'role'>,
    id?: UniqueEntityId,
  ) {
    const deliveryman = new Deliveryman(
      {
        ...props,
        role: props.role ?? 'MEMBER',
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return deliveryman
  }
}
