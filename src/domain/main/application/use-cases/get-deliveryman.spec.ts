import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { GetDeliverymanUseCase } from './get-deliveryman'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let sut: GetDeliverymanUseCase

describe('Create Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    sut = new GetDeliverymanUseCase(inMemoryDeliverymanRepository)
  })

  it('should be able to get a deliveryman', async () => {
    const deliveryman = makeDeliveryman(
      {
        role: 'MEMBER',
      },
      new UniqueEntityId('deliveryman-1'),
    )

    await inMemoryDeliverymanRepository.create(deliveryman)

    const result = await sut.execute({
      cpf: deliveryman.cpf.value,
    })

    expect(result.isRight()).toBe(true)
  })
})
