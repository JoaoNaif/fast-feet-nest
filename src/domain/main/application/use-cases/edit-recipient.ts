import { Either, left, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { RecipientRepository } from '../repositories/recipient-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { RecipientAlreadyExistError } from './errors/recipient-already-exist-error'
import { Recipient } from '../../enterprise/entities/recipient'

interface EditRecipientUseCaseRequest {
  adminId: string
  recipientId: string
  name: string
  address: string
  cep: number
  latitude: number
  longitude: number
}

type EditRecipientUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError | RecipientAlreadyExistError,
  {
    recipient: Recipient
  }
>

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

    recipient.name = name
    recipient.address = address
    recipient.cep = cep
    recipient.latitude = latitude
    recipient.longitude = longitude

    await this.recipientRepository.save(recipient)

    return right({
      recipient,
    })
  }
}
