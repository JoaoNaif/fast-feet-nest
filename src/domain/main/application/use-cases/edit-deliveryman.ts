import { Either, left, right } from '@/core/either'
import { Deliveryman } from '../../enterprise/entities/deliveryman'
import { HashGenerator } from '../cryptography/hash-generator'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface EditDeliverymanUseCaseRequest {
  id: string
  name?: string | null
  password?: string | null
  latitude?: number | null
  longitude?: number | null
}

type EditDeliverymanUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    deliveryman: Deliveryman
  }
>

@Injectable()
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

    const hashedPassword = await this.hashGenerator.hash(
      password ?? deliveryman.password,
    )

    deliveryman.name = name ?? deliveryman.name
    deliveryman.password = hashedPassword
    deliveryman.latitude = latitude ?? deliveryman.latitude
    deliveryman.longitude = longitude ?? deliveryman.longitude

    await this.deliverymanRepository.save(deliveryman)

    return right({
      deliveryman,
    })
  }
}
