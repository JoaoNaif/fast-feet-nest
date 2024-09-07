import { Either, left, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { Injectable } from '@nestjs/common'

interface DeleteDeliverymanUseCaseRequest {
  adminId: string
  id: string
}

type DeleteDeliverymanUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError,
  null
>

@Injectable()
export class DeleteDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliverymanRepository) {}

  async execute({
    adminId,
    id,
  }: DeleteDeliverymanUseCaseRequest): Promise<DeleteDeliverymanUseCaseResponse> {
    const admin = await this.deliverymanRepository.findById(adminId)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    if (admin.role === 'MEMBER') {
      return left(new UnauthorizedError())
    }

    const deliveryman = await this.deliverymanRepository.findById(id)

    if (!deliveryman) {
      return left(new ResourceNotFoundError())
    }

    await this.deliverymanRepository.delete(deliveryman)

    return right(null)
  }
}
