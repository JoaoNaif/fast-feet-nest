import { Either, left, right } from '@/core/either'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { HashGenerator } from '../cryptography/hash-generator'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface EditDeliverymanUseCaseRequest {
  id: string
  name: string
  password: string
  latitude: number
  longitude: number
}

type EditDeliverymanUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    deliveryman: Deliveryman
  }
>

export class EditDeliverymanUseCase {
  constructor(
    private deliverymanRepository: DeliverymanRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    id,
    name,
    password,
    latitude,
    longitude,
  }: EditDeliverymanUseCaseRequest): Promise<EditDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(id)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    deliveryman.name = name
    deliveryman.password = hashedPassword
    deliveryman.latitude = latitude
    deliveryman.longitude = longitude

    await this.deliverymanRepository.save(deliveryman)

    return right({
      deliveryman,
    })
  }
}
