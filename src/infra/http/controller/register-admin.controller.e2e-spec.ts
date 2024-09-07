import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'

describe('Register Admin (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /admin', async () => {
    const response = await request(app.getHttpServer()).post('/admin').send({
      name: 'John Doe',
      cpf: '01122233312',
      password: 'admin123',
      latitude: -23.623352,
      longitude: -46.558612,
    })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.deliveryman.findUnique({
      where: {
        cpf: '011.222.333-12',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
