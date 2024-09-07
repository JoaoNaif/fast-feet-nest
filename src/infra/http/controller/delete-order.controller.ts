import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { DeleteOrderUseCase } from '@/domain/main/application/use-cases/delete-order'

@Controller('/order/:id')
export class DeleteOrderController {
  constructor(private deleteOrder: DeleteOrderUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param('id') id: string) {
    const adminId = user.sub

    const result = await this.deleteOrder.execute({
      adminId,
      orderId: id,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
