import { BadRequestException, Controller, Get, Param } from '@nestjs/common'
import { GetDeliverymanUseCase } from '@/domain/main/application/use-cases/get-deliveryman'
import { DeliverymanPresenter } from '../presenters/deliveryman-presenter'

@Controller('/deliveryman/:cpf')
export class GetDeliverymanController {
  constructor(private getDeliveryman: GetDeliverymanUseCase) {}

  @Get()
  async handle(@Param('cpf') cpf: string) {
    const result = await this.getDeliveryman.execute({
      cpf,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      deliveryman: DeliverymanPresenter.toHTTP(result.value.deliveryman),
    }
  }
}
