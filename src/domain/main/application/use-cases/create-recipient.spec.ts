import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { CreateRecipientUseCase } from './create-recipient'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let inMemoryRecipentRepository: InMemoryRecipientRepository
let sut: CreateRecipientUseCase

describe('Create Recipient', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    inMemoryRecipentRepository = new InMemoryRecipientRepository()
    sut = new CreateRecipientUseCase(
      inMemoryRecipentRepository,
      inMemoryDeliverymanRepository,
    )
  })

  it('should be able to create a new recipient', async () => {
    const deliveryman = makeDeliveryman(
      {
        role: 'ADMIN',
      },
      new UniqueEntityId('deliveryman-1'),
    )

    await inMemoryDeliverymanRepository.create(deliveryman)

    await sut.execute({
      adminId: deliveryman.id.toString(),
      name: 'John Doe',
      email: 'johndoe@email.com',
      latitude: -23.623352,
      longitude: -46.558612,
      cep: 13172040,
      address: 'Av. Paulista',
      city: 'São Paulo',
      uf: 'SP',
      number: 1239,
    })

    expect(inMemoryRecipentRepository.items[0]).toMatchObject({
      name: 'John Doe',
      latitude: -23.623352,
      longitude: -46.558612,
      cep: 13172040,
      address: 'Av. Paulista',
      city: 'São Paulo',
      uf: 'SP',
      number: 1239,
    })
  })

  it('only admin can create a recipient', async () => {
    const deliveryman = makeDeliveryman(
      {
        role: 'MEMBER',
      },
      new UniqueEntityId('deliveryman-1'),
    )

    await inMemoryDeliverymanRepository.create(deliveryman)

    const result = await sut.execute({
      adminId: deliveryman.id.toString(),
      name: 'John Doe',
      email: 'johndoe@email.com',
      latitude: -23.623352,
      longitude: -46.558612,
      cep: 13172040,
      address: 'Av. Paulista',
      city: 'São Paulo',
      uf: 'SP',
      number: 1239,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
