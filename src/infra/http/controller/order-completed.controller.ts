import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { OrderCompletedUseCase } from '@/domain/main/application/use-cases/order-completed'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'

const orderCompletedBodySchema = z.object({
  attachmentId: z.string().uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(orderCompletedBodySchema)

type OrderCompletedBodySchema = z.infer<typeof orderCompletedBodySchema>

@Controller('/order/completed/:orderId')
export class OrderCompletedController {
  constructor(private orderCompleted: OrderCompletedUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: OrderCompletedBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('orderId') orderId: string,
  ) {
    const { attachmentId } = body
    const userId = user.sub

    const result = await this.orderCompleted.execute({
      deliverymanId: userId,
      orderId,
      attachmentId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
