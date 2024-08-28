import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeOrder } from 'test/factories/make-order'
import { WithdrawOrderUseCase } from './withdraw-order'

let inMemoryOrderRepository: InMemoryOrderRepository
let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let inMemoryRecipentRepository: InMemoryRecipientRepository
let sut: WithdrawOrderUseCase

describe('Delete Order', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    inMemoryRecipentRepository = new InMemoryRecipientRepository()
    sut = new WithdrawOrderUseCase(
      inMemoryOrderRepository,
      inMemoryDeliverymanRepository,
    )
  })

  it('must be able to edit an order', async () => {
    const deliveryman = makeDeliveryman(
      {
        name: 'John Doe',
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

    const order = makeOrder(
      {
        recipientId: new UniqueEntityId(recipient.id.toString()),
      },
      new UniqueEntityId('order-1'),
    )

    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      orderId: 'order-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryOrderRepository.items[0].deliverymanId).toEqual(
      expect.objectContaining({ value: 'deliveryman-1' }),
    )
    expect(inMemoryOrderRepository.items[0].status).toEqual(
      'Pedido retirado por John Doe',
    )
    expect(inMemoryOrderRepository.items[0].removeIn).toEqual(expect.any(Date))
  })
})
