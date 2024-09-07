import { RegisterDeliverymanUseCase } from '@/domain/main/application/use-cases/register-deliveryman'
import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeliverymanAlreadyExistError } from '@/domain/main/application/use-cases/errors/deliveryman-already-exist-error'

const registerDeliverymanBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
  latitude: z.number().refine((value) => {
    return Math.abs(value) <= 90
  }),
  longitude: z.number().refine((value) => {
    return Math.abs(value) <= 180
  }),
})

type RegisterDeliverymanBodySchema = z.infer<
  typeof registerDeliverymanBodySchema
>

@Controller('/register')
@Public()
export class RegisterDeliverymanController {
  constructor(private registerDeliveryman: RegisterDeliverymanUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(registerDeliverymanBodySchema))
  async handle(@Body() body: RegisterDeliverymanBodySchema) {
    const { name, cpf, password, latitude, longitude } = body

    const result = await this.registerDeliveryman.execute({
      name,
      cpf,
      password,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case DeliverymanAlreadyExistError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
