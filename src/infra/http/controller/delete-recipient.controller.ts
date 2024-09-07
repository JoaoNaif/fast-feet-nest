import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { DeleteRecipientUseCase } from '@/domain/main/application/use-cases/delete-recipient'

@Controller('/recipient/:id')
export class DeleteRecipientController {
  constructor(private deleteRecipient: DeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param('id') id: string) {
    const adminId = user.sub

    const result = await this.deleteRecipient.execute({
      adminId,
      recipientId: id,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
