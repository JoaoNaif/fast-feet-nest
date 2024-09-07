import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeliverymanAlreadyExistError } from '@/domain/main/application/use-cases/errors/deliveryman-already-exist-error'
import { CreateRecipientUseCase } from '@/domain/main/application/use-cases/create-recipient'
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'

const createRecipientBodySchema = z.object({
  adminId: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  address: z.string(),
  number: z.number(),
  uf: z.string(),
  city: z.string(),
  cep: z.number(),
  latitude: z.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
})

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>

@Controller('/recipients')
export class CreateRecipientController {
  constructor(private createRecipient: CreateRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createRecipientBodySchema))
  async handle(@Body() body: CreateRecipientBodySchema) {
    const {
      adminId,
      name,
      email,
      address,
      number,
      uf,
      city,
      cep,
      latitude,
      longitude,
    } = body

    const result = await this.createRecipient.execute({
      adminId,
      name,
      email,
      address,
      number,
      uf,
      city,
      cep,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case DeliverymanAlreadyExistError:
          throw new ConflictException(error.message)
        case UnauthorizedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
