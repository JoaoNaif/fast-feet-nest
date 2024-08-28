import { InMemoryDeliverymanRepository } from 'test/repositories/in-memory-deliveryman-repository'
import { RegisterDeliverymanUseCase } from './register-deliveryman'
import { FakeHasher } from 'test/cryptography/fake-hasher'

let inMemoryDeliverymanRepository: InMemoryDeliverymanRepository
let fakeHasher: FakeHasher
let sut: RegisterDeliverymanUseCase

describe('Create Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliverymanRepository()
    fakeHasher = new FakeHasher()
    sut = new RegisterDeliverymanUseCase(
      inMemoryDeliverymanRepository,
      fakeHasher,
    )
  })

  it('should be able to register a new deliveryman', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '12345678900',
      password: '123456',
      latitude: -23.623352,
      longitude: -46.558612,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      deliveryman: inMemoryDeliverymanRepository.items[0],
    })
  })

  it('should hash deliveryman password upon registration', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      cpf: '12345678900',
      password: '123456',
      latitude: -23.623352,
      longitude: -46.558612,
    })

    const hashedPassword = await fakeHasher.hash('123456')

    expect(result.isRight()).toBe(true)
    expect(inMemoryDeliverymanRepository.items[0].password).toEqual(
      hashedPassword,
    )
  })
})
