import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { DeliveriesPresenter } from '../presenters/deliveries-presenter'
import { FetchNearbyDeliveryUseCase } from '@/domain/main/application/use-cases/fetch-nearby-delivery'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NoUpcomingDeliveryError } from '@/domain/main/application/use-cases/errors/no-upcoming-delivey-error'

const pageQueryParamSchema = z.number().optional().default(1)

const pageQueryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/orders/nearby/:deliverymanId')
export class FetchNearbyDeliveryController {
  constructor(private fetchNearbyDelivery: FetchNearbyDeliveryUseCase) {}

  @Get()
  async handle(
    @Param('deliverymanId') deliverymanId: string,
    @Query('page', pageQueryValidationPipe)
    page: PageQueryParamSchema,
  ) {
    const result = await this.fetchNearbyDelivery.execute({
      deliverymanId,
      page,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new ConflictException(error.message)
        case NoUpcomingDeliveryError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return {
      deliveryman: DeliveriesPresenter.toHTTP(result.value.deliveries),
    }
  }
}
