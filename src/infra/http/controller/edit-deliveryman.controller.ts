import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { EditDeliverymanUseCase } from '@/domain/main/application/use-cases/edit-deliveryman'

const editDeliverymanBodySchema = z.object({
  name: z.string().nullable(),
  password: z.string().nullable(),
  latitude: z
    .number()
    .nullable()
    .refine(
      (value) => {
        return (
          value === null || (typeof value === 'number' && Math.abs(value) <= 90)
        )
      },
      {
        message: 'Latitude must be between -90 and 90',
      },
    ),
  longitude: z
    .number()
    .nullable()
    .refine(
      (value) => {
        return (
          value === null ||
          (typeof value === 'number' && Math.abs(value) <= 180)
        )
      },
      {
        message: 'Longitude must be between -180 and 180',
      },
    ),
})

const bodyValidationPipe = new ZodValidationPipe(editDeliverymanBodySchema)

type EditDeliverymanBodySchema = z.infer<typeof editDeliverymanBodySchema>

@Controller('/deliveryman/edit/:id')
export class EditDeliverymanController {
  constructor(private editDeliveryman: EditDeliverymanUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditDeliverymanBodySchema,
    @Param('id') id: string,
  ) {
    const { name, password, latitude, longitude } = body

    const result = await this.editDeliveryman.execute({
      id,
      name,
      password,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
