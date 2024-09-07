import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { FetchOrderCityUseCase } from '@/domain/main/application/use-cases/fetch-order-city'
import { DeliveriesPresenter } from '../presenters/deliveries-presenter'

const pageQueryParamSchema = z.number().optional().default(1)

const pageQueryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/deliveryman/city/:deliverymanId')
export class FetchOrderCityController {
  constructor(private fetchOrderCity: FetchOrderCityUseCase) {}

  @Get()
  async handle(
    @Param('deliverymanId') deliverymanId: string,
    @Query('page', pageQueryValidationPipe)
    page: PageQueryParamSchema,
    @Query('query') query: string,
  ) {
    const result = await this.fetchOrderCity.execute({
      deliverymanId,
      page,
      query,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    return {
      deliveryman: DeliveriesPresenter.toHTTP(result.value.deliveries),
    }
  }
}
