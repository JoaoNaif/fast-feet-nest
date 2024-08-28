import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeOrder } from 'test/factories/make-order'
import { EditOrderUseCase } from './edit-order'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let inMemoryRecipentRepository: InMemoryRecipientRepository
let sut: EditOrderUseCase

describe('Delete Order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    inMemoryRecipentRepository = new InMemoryRecipientRepository()
    sut = new EditOrderUseCase(
      inMemoryOrderRepository,
      inMemoryDeliverymanRepository,
    )
  })

  it('must be able to edit an order', async () => {
    const admin = makeDeliveryman(
      {
        role: 'ADMIN',
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

    const order = makeOrder(
      {
        recipientId: new UniqueEntityId(recipient.id.toString()),
      },
      new UniqueEntityId('order-1'),
    )

    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      adminId: admin.id.toString(),
      orderId: order.id.toString(),
      recipientId: 'recipient-2',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items[0].recipientId).toEqual({
      value: 'recipient-2',
    })
  })

  it('only admin can edit a order', async () => {
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
      orderId: 'recipient-1',
      recipientId: 'recipient-2',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnauthorizedError)
  })
})
