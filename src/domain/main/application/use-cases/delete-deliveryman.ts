import { Either, left, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'

interface DeleteDeliverymanUseCaseRequest {
  id: string
}

type DeleteDeliverymanUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  null
>

export class DeleteDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    id,
  }: DeleteDeliverymanUseCaseRequest): Promise<DeleteDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findById(id)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    if (deliveryman.role === 'MEMBER') {
      return left(new UnauthorizedError())
    }

    await this.deliverymanRepository.delete(deliveryman)

    return right(null)
  }
}
