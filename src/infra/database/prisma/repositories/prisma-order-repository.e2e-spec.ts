import { OrderRepository } from '@/domain/main/application/repositories/order-repository'
import { AppModule } from '@/infra/app.module'
import { CacheRepository } from '@/infra/cache/cache-repository'
import { CacheModule } from '@/infra/cache/cache.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Prisma Orders Repository (E2E)', () => {
  let app: INestApplication
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let cacheRepository: CacheRepository
  let orderRepository: OrderRepository

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [DeliverymanFactory, RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)
    cacheRepository = moduleRef.get(CacheRepository)
    orderRepository = moduleRef.get(OrderRepository)

    await app.init()
  })

  it('should cache orders deliveries', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()

    const recipient = await recipientFactory.makePrismaRecipient()

    await orderFactory.makePrismaRecipient({
      recipientId: recipient.id,
      deliverymanId: deliveryman.id,
      removeIn: new Date(),
    })

    const deliverymanId = deliveryman.id.toString()
    const page = 1

    const ordersDeliveries = await orderRepository.findManyDeliveries(
      deliverymanId,
      page,
    )

    const cached = await cacheRepository.get(
      `orders:${deliverymanId}:deliveries:page:${page}`,
    )

    if (!cached) {
      throw new Error()
    }

    expect(JSON.parse(cached)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: ordersDeliveries[0].id.toString(),
        }),
      ]),
    )
  })

  it('should return cached orders deliveries on subsequent calls', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()

    const recipient = await recipientFactory.makePrismaRecipient()

    await orderFactory.makePrismaRecipient({
      recipientId: recipient.id,
      deliverymanId: deliveryman.id,
      removeIn: new Date(),
    })

    const deliverymanId = deliveryman.id.toString()
    const page = 1

    let cached = await cacheRepository.get(
      `orders:${deliverymanId}:deliveries:page:${page}`,
    )

    expect(cached).toBeNull()

    await orderRepository.findManyDeliveries(deliverymanId, page)

    cached = await cacheRepository.get(
      `orders:${deliverymanId}:deliveries:page:${page}`,
    )

    expect(cached).not.toBeNull()

    if (!cached) {
      throw new Error()
    }

    const ordersDeliveries = await orderRepository.findManyDeliveries(
      deliverymanId,
      page,
    )

    expect(JSON.parse(cached)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: ordersDeliveries[0].id.toString(),
        }),
      ]),
    )
  })

  it('should cache orders deliveries', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()

    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaRecipient({
      recipientId: recipient.id,
      deliverymanId: deliveryman.id,
      removeIn: new Date(),
    })

    const deliverymanId = deliveryman.id.toString()

    await cacheRepository.set(
      `orders:${deliverymanId}:deliveries:*`,
      JSON.stringify({ empty: true }),
    )

    await orderRepository.save(order)

    const cached = await cacheRepository.get(
      `orders:${deliverymanId}:deliveries:*`,
    )

    expect(cached).toBeNull()
  })
})
