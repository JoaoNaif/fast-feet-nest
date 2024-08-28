import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Deliveryman,
  DeliverymanProps,
} from '@/domain/main/enterprise/entities/deliveryman'
import { Cpf } from '@/domain/main/enterprise/entities/value-objects/cpf'
import { faker } from '@faker-js/faker'
import { generateFakeCPF } from 'test/utils/fake-random-generate-CPF'

export function makeDeliveryman(
  override: Partial<DeliverymanProps> = {},
  id?: UniqueEntityId,
) {
  const fakeCPF = generateFakeCPF()
  const deliverman = Deliveryman.create(
    {
      name: faker.person.fullName(),
      cpf: Cpf.createFromText(fakeCPF),
      password: faker.internet.password(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      ...override,
    },
    id,
  )

  return deliverman
}
