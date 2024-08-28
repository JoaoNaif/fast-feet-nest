import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { CreateOrderUseCase } from './create-order'
import { makeRecipient } from 'test/factories/make-recipient'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let inMemoryRecipentRepository: InMemoryRecipientRepository
let sut: CreateOrderUseCase

describe('Create Order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    inMemoryRecipentRepository = new InMemoryRecipientRepository()
    sut = new CreateOrderUseCase(
      inMemoryOrderRepository,
      inMemoryRecipentRepository,
      inMemoryDeliverymanRepository,
    )
  })

  it('should be able to create a new order and status waiting', async () => {
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
    expect(inMemoryOrderRepository.items[0].recipientId).toEqual(
      new UniqueEntityId('recipient-1'),
    )
    expect(inMemoryOrderRepository.items[0].status).toEqual(
      'Aguardando retirar',
    )
  })

  it('only admin can create a order', async () => {
    const admin = makeDeliveryman(
      {
        role: 'MEMBER',
      },
      new UniqueEntityId('deliveryman-1'),
    )

    await inMemoryDeliverymanRepository.create(admin)

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
