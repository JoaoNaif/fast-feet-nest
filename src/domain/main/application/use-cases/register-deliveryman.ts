import { Either, left, right } from '@/core/either'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { HashGenerator } from '../cryptography/hash-generator'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { DeliverymanAlreadyExistError } from './errors/deliveryman-already-exist-error'
import { Cpf } from '../../enterprise/entities/value-objects/cpf'

interface RegisterDeliverymanUseCaseRequest {
  name: string
  cpf: string
  password: string
  latitude: number
  longitude: number
}

type RegisterDeliverymanUseCaseResponse = Either<
  DeliverymanAlreadyExistError,
  {
    deliveryman: Deliveryman
  }
>

export class RegisterDeliverymanUseCase {
  constructor(
    private deliverymanRepository: DeliverymanRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
    latitude,
    longitude,
  }: RegisterDeliverymanUseCaseRequest): Promise<RegisterDeliverymanUseCaseResponse> {
    const deliverymanWithSameCpf =
      await this.deliverymanRepository.findByCPF(cpf)

    if (deliverymanWithSameCpf) {
      return left(new DeliverymanAlreadyExistError(cpf))
    }

    const cpfText = Cpf.createFromText(cpf)
    const hashedPassword = await this.hashGenerator.hash(password)

    const deliveryman = Deliveryman.create({
      cpf: cpfText,
      name,
      password: hashedPassword,
      latitude,
      longitude,
    })

    await this.deliverymanRepository.create(deliveryman)

    return right({
      deliveryman,
    })
  }
}
