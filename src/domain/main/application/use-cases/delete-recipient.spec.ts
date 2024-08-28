import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { DeleteRecipientUseCase } from './delete-recipient'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let inMemoryRecipentRepository: InMemoryRecipientRepository
let sut: DeleteRecipientUseCase

describe('Delete Recipient', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    inMemoryRecipentRepository = new InMemoryRecipientRepository()
    sut = new DeleteRecipientUseCase(
      inMemoryRecipentRepository,
      inMemoryDeliverymanRepository,
    )
  })

  it('should be able to delete a recipient', async () => {
    const deliveryman = makeDeliveryman(
      {
        role: 'ADMIN',
      },
      new UniqueEntityId('deliveryman-1'),
    )

    await inMemoryDeliverymanRepository.create(deliveryman)

    const recipient = makeRecipient(
      {
        email: 'johndoe@email.com',
      },
      new UniqueEntityId('recipient-1'),
    )

    await inMemoryRecipentRepository.create(recipient)

    const result = await sut.execute({
      adminId: 'deliveryman-1',
      recipientId: 'recipient-1',
    })

    expect(result.isRight()).toBe(true)
  })

  it('only admin can create a recipient', async () => {
    const deliveryman = makeDeliveryman(
      {
        role: 'MEMBER',
      },
      new UniqueEntityId('deliveryman-1'),
    )

    await inMemoryDeliverymanRepository.create(deliveryman)

    const recipient = makeRecipient(
      {
        email: 'johndoe@email.com',
      },
      new UniqueEntityId('recipient-1'),
    )

    await inMemoryRecipentRepository.create(recipient)

    const result = await sut.execute({
      adminId: 'deliveryman-1',
      recipientId: 'recipient-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
