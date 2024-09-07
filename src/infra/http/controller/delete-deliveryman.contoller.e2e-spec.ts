import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

describe('Delete Deliveryman (E2E)', () => {
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

  test('[DELETE] /deliveryman/:id', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      role: 'ADMIN',
      name: 'John Doe',
    })

    const accessToken = jwt.sign({ sub: deliveryman.id.toString() })

    const response = await request(app.getHttpServer())
      .delete(`/deliveryman/${deliveryman.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const deliverymanOnDatabase = await prisma.deliveryman.findUnique({
      where: {
        id: deliveryman.id.toString(),
      },
    })

    expect(deliverymanOnDatabase).toBeNull()
  })
})
