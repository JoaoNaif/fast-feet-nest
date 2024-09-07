import {
  BadRequestException,
  ConflictException,
  Controller,
  HttpCode,
  Param,
  Put,
  UnauthorizedException,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { WithdrawOrderUseCase } from '@/domain/main/application/use-cases/withdraw-order'
import { OrderAlreadyPickedUpError } from '@/domain/main/application/use-cases/errors/order-already-picked-up-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

@Controller('/order/withdraw/:orderId')
export class WithdrawOrderController {
  constructor(private withdrawOrder: WithdrawOrderUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('orderId') orderId: string,
    @CurrentUser() user: UserPayload,
  ) {
    const deliverymanId = user.sub

    const result = await this.withdrawOrder.execute({
      deliverymanId,
      orderId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new UnauthorizedException(error.message)
        case OrderAlreadyPickedUpError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
