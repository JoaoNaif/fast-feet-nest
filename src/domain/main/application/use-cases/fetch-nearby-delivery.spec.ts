import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient'
import { makeRecipient } from 'test/factories/make-recipient'
import { makeDeliveryman } from 'test/factories/make-deliveryman'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchNearbyDeliveryUseCase } from './fetch-nearby-delivery'
import { InMemoryOrderRepository } from 'test/repositories/in-memory-order-repository'
import { makeOrder } from 'test/factories/make-order'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let inMemoryRecipentRepository: InMemoryRecipientRepository
let inMemoryOrderRepository: InMemoryOrderRepository
let sut: FetchNearbyDeliveryUseCase

describe('Fetch Nearby Delivery', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    inMemoryRecipentRepository = new InMemoryRecipientRepository()
    inMemoryOrderRepository = new InMemoryOrderRepository()
    sut = new FetchNearbyDeliveryUseCase(
      inMemoryRecipentRepository,
      inMemoryDeliverymanRepository,
      inMemoryOrderRepository,
    )
  })

  it('must be able to search for all deliveries within 10km', async () => {
    const deliveryman = makeDeliveryman(
      {
        role: 'ADMIN',
        latitude: -23.5591942,
        longitude: -46.5836981,
      },
      new UniqueEntityId('deliveryman-1'),
    )

    await inMemoryDeliverymanRepository.create(deliveryman)

    const recipient1 = makeRecipient(
      {
        name: 'near',
        latitude: -23.5591942,
        longitude: -46.5836981,
      },
      new UniqueEntityId('recipient-1'),
    )

    const recipient2 = makeRecipient(
      {
        name: 'far',
      },
      new UniqueEntityId('recipient-2'),
    )

    await inMemoryRecipentRepository.create(recipient1)
    await inMemoryRecipentRepository.create(recipient2)

    const order1 = makeOrder({
      recipientId: new UniqueEntityId('recipient-1'),
    })

    const order2 = makeOrder({
      recipientId: new UniqueEntityId('recipient-2'),
    })

    await inMemoryOrderRepository.create(order1)
    await inMemoryOrderRepository.create(order2)

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      const deliveries = result.value.deliveries
      expect(deliveries.orders).toHaveLength(1)
      expect(deliveries.orders[0].recipientId.toString()).toBe('recipient-1')
      expect(deliveries.recipientNearby[0].name).toBe('near')
    }
  })

  it('should be able to fetch paginated nearby deliveries', async () => {
    const deliveryman = makeDeliveryman(
      {
        role: 'ADMIN',
        latitude: -23.5591942,
        longitude: -46.5836981,
      },
      new UniqueEntityId('deliveryman-1'),
    )

    await inMemoryDeliverymanRepository.create(deliveryman)

    const recipient1 = makeRecipient(
      {
        name: 'near',
        latitude: -23.5591942,
        longitude: -46.5836981,
      },
      new UniqueEntityId('recipient-1'),
    )

    await inMemoryRecipentRepository.create(recipient1)

    for (let i = 1; i <= 22; i++) {
      const order = makeOrder({
        status: `user-${i}`,
        recipientId: new UniqueEntityId(`recipient-1`),
      })

      await inMemoryOrderRepository.create(order)
    }

    const result = await sut.execute({
      deliverymanId: 'deliveryman-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      const deliveries = result.value.deliveries
      expect(deliveries.orders).toHaveLength(2)
      expect(deliveries.orders).toEqual([
        expect.objectContaining({ status: 'user-21' }),
        expect.objectContaining({ status: 'user-22' }),
      ])
    }
  })
})
