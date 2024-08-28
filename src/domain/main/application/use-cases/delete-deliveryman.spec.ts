import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeleteDeliverymanUseCase } from './delete-deliveryman'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let sut: DeleteDeliverymanUseCase

describe('Delete Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    sut = new DeleteDeliverymanUseCase(inMemoryDeliverymanRepository)
  })

  it('should be able to edit a deliveryman', async () => {
    const newDeliveryman = makeDeliveryman(
      {
        role: 'ADMIN',
      },
      new UniqueEntityId('deliveryman-1'),
    )

    await inMemoryDeliverymanRepository.create(newDeliveryman)

    await sut.execute({
      id: 'deliveryman-1',
    })

    expect(inMemoryDeliverymanRepository.items).toHaveLength(0)
  })

  it('only an admin should be able to delete a record', async () => {
    const newDeliveryman = makeDeliveryman(
      {
        role: 'MEMBER',
      },
      new UniqueEntityId('deliveryman-1'),
    )

    await inMemoryDeliverymanRepository.create(newDeliveryman)

    const result = await sut.execute({
      id: 'deliveryman-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
