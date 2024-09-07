import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchOrderDeliverymanUseCase } from './fetch-order-deliveryman'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { makeOrder } from 'test/factories/make-order'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: FetchOrderDeliverymanUseCase

describe('Fetch Order Deliveryman', () => {
  beforeEach(() => {
    inMemoryOrderRepository = new InMemoryOrderRepository()
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    sut = new FetchOrderDeliverymanUseCase(inMemoryOrderRepository)
  })

  it('should be able to get a deliveryman', async () => {
    const deliveryman = makeDeliveryman(
      {
        role: 'MEMBER',
      },
      new UniqueEntityId('deliveryman-1'),
    )

    await inMemoryDeliverymanRepository.create(deliveryman)

    const order = makeOrder({
      deliverymanId: deliveryman.id,
    })

    await inMemoryOrderRepository.create(order)

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      page: 1,
    })

    expect(result.isRight()).toBe(true)
  })

  it('should be able to get a deliveryman', async () => {
    const deliveryman = makeDeliveryman(
      {
        role: 'MEMBER',
      },
      new UniqueEntityId('deliveryman-1'),
    )

    await inMemoryDeliverymanRepository.create(deliveryman)

    for (let i = 1; i <= 22; i++) {
      const order = makeOrder({
        status: `user-${i}`,
        deliverymanId: deliveryman.id,
      })

      await inMemoryOrderRepository.create(order)
    }

    const result = await sut.execute({
      deliverymanId: deliveryman.id.toString(),
      page: 2,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      const deliveries = result.value.orders
      expect(deliveries).toHaveLength(2)
      expect(deliveries).toEqual([
        expect.objectContaining({ status: 'user-21' }),
        expect.objectContaining({ status: 'user-22' }),
      ])
    }
  })
})
