import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

describe('Edit Deliveryman (E2E)', () => {
  let app: INestApplication
  let deliverymanFactory: DeliverymanFactory
  let jwt: JwtService
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /deliveryman/edit/:id', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()

    const accessToken = jwt.sign({ sub: deliveryman.id.toString() })

    const deliverymanId = deliveryman.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/deliveryman/edit/${deliverymanId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'Test',
        password: 'alskdhsgd',
        latitude: -23.623352,
        longitude: -46.558612,
      })

    expect(response.statusCode).toBe(204)

    const deliverymanOnDatabase = await prisma.deliveryman.findFirst({
      where: {
        name: 'Test',
      },
    })

    expect(deliverymanOnDatabase).toBeTruthy()
  })
})
