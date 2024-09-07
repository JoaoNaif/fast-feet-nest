import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Edit Order (E2E)', () => {
  let app: INestApplication
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let jwt: JwtService
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory, RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /order/edit/:orderId', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      role: 'ADMIN',
    })

    const accessToken = jwt.sign({ sub: deliveryman.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const recipient1 = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaRecipient({
      recipientId: new UniqueEntityId(recipient.id.toString()),
    })

    const orderId = order.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/order/edit/${orderId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        recipientId: recipient1.id.toString(),
      })

    expect(response.statusCode).toEqual(204)

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        recipientId: recipient1.id.toString(),
      },
    })

    expect(orderOnDatabase).toBeTruthy()
  })
})
