import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { RegisterAdminUseCase } from './register-admin'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let fakeHasher: FakeHasher
let sut: RegisterAdminUseCase

describe('Create Admin', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterAdminUseCase(inMemoryDeliverymanRepository, fakeHasher)
  })

  it('it should not be possible to register a new administrator without the root password ', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '12345678900',
      password: '123456',
      latitude: -23.623352,
      longitude: -46.558612,
    })

    expect(result.isLeft()).toBe(true)
  })

  it('it should be possible to register a new administrator with the root password', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '12345678900',
      password: 'admin123',
      latitude: -23.623352,
      longitude: -46.558612,
    })

    const roleAdmin = 'ADMIN'

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items[0].role).toEqual(roleAdmin)
  })

  it('should hash admin password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '12345678900',
      password: 'admin123',
      latitude: -23.623352,
      longitude: -46.558612,
    })

    const hashedPassword = await fakeHasher.hash('admin123')

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })
})
