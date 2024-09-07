import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { DeleteDeliverymanUseCase } from '@/domain/main/application/use-cases/delete-deliveryman'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'

@Controller('/deliveryman/:id')
export class DeleteDeliverymanController {
  constructor(private deleteDeliveryman: DeleteDeliverymanUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param('id') id: string) {
    const adminId = user.sub

    const result = await this.deleteDeliveryman.execute({
      adminId,
      id,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
