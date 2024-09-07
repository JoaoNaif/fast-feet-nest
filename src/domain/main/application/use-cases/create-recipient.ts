import { Either, left, right } from '@/core/either'
import { DeliverymanRepository } from '../repositories/deliveryman-repository'
import { RecipientRepository } from '../repositories/recipient-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientAlreadyExistError } from './errors/recipient-already-exist-error'
import { Injectable } from '@nestjs/common'

interface CreateRecipientUseCaseRequest {
  adminId: string
  email: string
  name: string
  address: string
  number: number
  uf: string
  city: string
  cep: number
  latitude: number
  longitude: number
}

type CreateRecipientUseCaseResponse = Either<
  ResourceNotFoundError | UnauthorizedError | RecipientAlreadyExistError,
  {
    recipient: Recipient
  }
>

@Injectable()
export class CreateRecipientUseCase {
  constructor(
    private recipientRepository: RecipientRepository,
    private deliverymanRepository: DeliverymanRepository,
  ) {}

  async execute({
    adminId,
    email,
    name,
    address,
    number,
    uf,
    city,
    cep,
    latitude,
    longitude,
  }: CreateRecipientUseCaseRequest): Promise<CreateRecipientUseCaseResponse> {
    const admin = await this.deliverymanRepository.findById(adminId)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    if (admin.role === 'MEMBER') {
      return left(new UnauthorizedError())
    }

    const recipeintWithSameEmail =
      await this.recipientRepository.findByEmail(email)

    if (recipeintWithSameEmail) {
      return left(new RecipientAlreadyExistError(email))
    }

    const recipient = Recipient.create({
      email,
      name,
      address,
      number,
      uf,
      city,
      cep,
      latitude,
      longitude,
    })

    await this.recipientRepository.create(recipient)

    return right({
      recipient,
    })
  }
}
