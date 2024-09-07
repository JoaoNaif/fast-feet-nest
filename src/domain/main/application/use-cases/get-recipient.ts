import { Either, left, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { RecipientRepository } from '../repositories/recipient-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientAlreadyExistError } from './errors/recipient-already-exist-error'
import { Injectable } from '@nestjs/common'

interface GetRecipientUseCaseRequest {
  adminId: string
  email: string
}

type GetRecipientUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError | RecipientAlreadyExistError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class GetRecipientUseCase {
  constructor(
    private recipientRepository: RecipientRepository,
    private deliverymanRepository: DeliverymanRepository,
  ) {}

  async execute({
    adminId,
    email,
  }: GetRecipientUseCaseRequest): Promise<GetRecipientUseCaseResponse> {
    const admin = await this.deliverymanRepository.findById(adminId)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    if (admin.role === 'MEMBER') {
      return left(new UnauthorizedError())
    }

    const recipient = await this.recipientRepository.findByEmail(email)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    return right({
      recipient,
    })
  }
}
