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
import { UnauthorizedError } from '@/core/errors/errors/unauthorized-error'
import { CreateOrderUseCase } from '@/domain/main/application/use-cases/create-order'

const createOrderBodySchema = z.object({
  adminId: z.string().uuid(),
  recipientId: z.string().uuid(),
})

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>

@Controller('/orders')
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe(createOrderBodySchema))
  async handle(@Body() body: CreateOrderBodySchema) {
    const { adminId, recipientId } = body

    const result = await this.createOrder.execute({
      adminId,
      recipientId,
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
