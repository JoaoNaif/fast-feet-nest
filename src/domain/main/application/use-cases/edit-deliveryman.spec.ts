import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { EditDeliverymanUseCase } from './edit-deliveryman'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let fakeHasher: FakeHasher
let sut: EditDeliverymanUseCase

describe('Edit Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    fakeHasher = new FakeHasher()
    sut = new EditDeliverymanUseCase(inMemoryDeliverymanRepository, fakeHasher)
  })

  it('should be able to edit a deliveryman', async () => {
    const newDeliveryman = makeDeliveryman(
      {
        name: 'John Joe',
      },
      new UniqueEntityId('deliveryman-1'),
    )

    await inMemoryDeliverymanRepository.create(newDeliveryman)

    await sut.execute({
      id: newDeliveryman.id.toValue(),
      name: 'John Doe',
      password: '654321',
      latitude: -23.623352,
      longitude: -46.558612,
    })

    expect(inMemoryDeliverymanRepository.items[0]).toMatchObject({
      name: 'John Doe',
      password: '654321-hashed',
      latitude: -23.623352,
      longitude: -46.558612,
    })
  })
})
