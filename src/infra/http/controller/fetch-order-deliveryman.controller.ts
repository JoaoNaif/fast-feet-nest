import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { FetchOrderDeliverymanUseCase } from '@/domain/main/application/use-cases/fetch-order-deliveryman'
import { OrdersPresenter } from '../presenters/orders-presenter'

const pageQueryParamSchema = z.number().optional().default(1)

const pageQueryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/deliveryman/orders/:deliverymanId')
export class FetchOrderDeliverymanController {
  constructor(private fetchOrderDeliveryman: FetchOrderDeliverymanUseCase) {}

  @Get()
  async handle(
    @Param('deliverymanId') deliverymanId: string,
    @Query('page', pageQueryValidationPipe)
    page: PageQueryParamSchema,
  ) {
    const result = await this.fetchOrderDeliveryman.execute({
      deliverymanId,
      page,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      deliveryman: OrdersPresenter.toHTTP(result.value.orders),
    }
  }
}
