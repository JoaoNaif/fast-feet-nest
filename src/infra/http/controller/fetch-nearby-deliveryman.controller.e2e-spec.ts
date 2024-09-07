import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Fetch Nearby Delivery (E2E)', () => {
  let app: INestApplication
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory, RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /orders/nearby/:deliverymanId', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      name: 'John Doe',
      latitude: -23.5591942,
      longitude: -46.5836981,
    })

    const accessToken = jwt.sign({ sub: deliveryman.id.toString() })

    const recipient1 = await recipientFactory.makePrismaRecipient({
      name: 'Near',
      latitude: -23.5591942,
      longitude: -46.5836981,
    })

    const recipient2 = await recipientFactory.makePrismaRecipient({
      name: 'Far',
      latitude: -22.6145,
      longitude: -177.6862,
    })

    await Promise.all([
      orderFactory.makePrismaRecipient({
        recipientId: recipient1.id,
      }),
      orderFactory.makePrismaRecipient({
        recipientId: recipient2.id,
      }),
    ])

    const response = await request(app.getHttpServer())
      .get(`/orders/nearby/${deliveryman.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.body).toEqual({
      deliveryman: expect.objectContaining({
        recipientNearby: expect.arrayContaining([
          expect.objectContaining({ name: 'Near' }),
        ]),
      }),
    })
  })
})
