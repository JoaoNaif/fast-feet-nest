import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { RecipientFactory } from 'test/factories/make-recipient'

describe('Edit Deliveryman (E2E)', () => {
  let app: INestApplication
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory
  let jwt: JwtService
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /recipient/edit/:id', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      role: 'ADMIN',
    })

    const recipient = await recipientFactory.makePrismaRecipient()

    const accessToken = jwt.sign({ sub: deliveryman.id.toString() })

    const recipientId = recipient.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/recipient/edit/${recipientId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
        address: 'rua test',
        cep: 320350,
        latitude: -23.623352,
        longitude: -46.558612,
      })

    expect(response.statusCode).toBe(204)

    const recipientOnDatabase = await prisma.recipient.findFirst({
      where: {
        name: 'Test',
      },
    })

    expect(recipientOnDatabase).toBeTruthy()
  })
})
