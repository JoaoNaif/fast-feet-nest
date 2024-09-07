import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Order Completed (E2E)', () => {
  let app: INestApplication
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let attachmentFactory: AttachmentFactory
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        DeliverymanFactory,
        RecipientFactory,
        OrderFactory,
        AttachmentFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /order/completed/:orderId', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()

    const accessToken = jwt.sign({ sub: deliveryman.id.toString() })

    const recipient = await recipientFactory.makePrismaRecipient()

    const order = await orderFactory.makePrismaRecipient({
      recipientId: recipient.id,
      deliverymanId: deliveryman.id,
      removeIn: new Date(),
    })

    const attachment = await attachmentFactory.makePrismaAttachment()

    const attachmentId = attachment.id.toString()

    const orderId = order.id.toString()

    const response = await request(app.getHttpServer())
      .post(`/order/completed/${orderId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        attachmentId,
      })

    expect(response.statusCode).toEqual(201)

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        deliverymanId: deliveryman.id.toString(),
        status: `Pedido entregue por ${deliveryman.name}`,
      },
    })

    expect(orderOnDatabase).toBeTruthy()

    const attachmentOnDatabase = await prisma.attachment.findUnique({
      where: {
        id: attachmentId,
      },
    })

    expect(attachmentOnDatabase).toEqual(
      expect.objectContaining({
        orderId,
      }),
    )
  })
})
