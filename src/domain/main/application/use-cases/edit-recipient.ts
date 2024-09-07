import { Either, left, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { RecipientRepository } from '../repositories/recipient-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { RecipientAlreadyExistError } from './errors/recipient-already-exist-error'
import { Recipient } from '../../enterprise/entities/recipient'
import { Injectable } from '@nestjs/common'

interface EditRecipientUseCaseRequest {
  adminId: string
  recipientId: string
  name?: string | null
  address?: string | null
  cep?: number | null
  latitude?: number | null
  longitude?: number | null
}

type EditRecipientUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError | RecipientAlreadyExistError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class EditRecipientUseCase {
  constructor(
    private recipientRepository: RecipientRepository,
    private deliverymanRepository: DeliverymanRepository,
  ) {}

  async execute({
    adminId,
    recipientId,
    name,
    address,
    cep,
    latitude,
    longitude,
  }: EditRecipientUseCaseRequest): Promise<EditRecipientUseCaseResponse> {
    const admin = await this.deliverymanRepository.findById(adminId)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    if (admin.role === 'MEMBER') {
      return left(new UnauthorizedError())
    }

    const recipient = await this.recipientRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    recipient.name = name ?? recipient.name
    recipient.address = address ?? recipient.address
    recipient.cep = cep ?? recipient.cep
    recipient.latitude = latitude ?? recipient.latitude
    recipient.longitude = longitude ?? recipient.longitude

    await this.recipientRepository.save(recipient)

    return right({
      recipient,
    })
  }
}
