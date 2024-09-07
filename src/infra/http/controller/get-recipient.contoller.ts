import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { GetRecipientUseCase } from '@/domain/main/application/use-cases/get-recipient'
import { RecipientPresenter } from '../presenters/recipient-presenter'

@Controller('/recipient/:adminId/:email')
export class GetRecipientController {
  constructor(private getRecipient: GetRecipientUseCase) {}

  @Get()
  async handle(
    @Param('adminId') adminId: string,
    @Param('email') email: string,
  ) {
    const result = await this.getRecipient.execute({
      adminId,
      email,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      recipient: RecipientPresenter.toHTTP(result.value.recipient),
    }
  }
}
