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
import { EditRecipientUseCase } from '@/domain/main/application/use-cases/edit-recipient'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'

const editRecipientBodySchema = z.object({
  name: z.string().nullable(),
  address: z.string().nullable(),
  cep: z.number().nullable(),
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

const bodyValidationPipe = new ZodValidationPipe(editRecipientBodySchema)

type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>

@Controller('/recipient/edit/:id')
export class EditRecipientController {
  constructor(private editRecipient: EditRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditRecipientBodySchema,
    @CurrentUser() user: UserPayload,
    @Param('id') id: string,
  ) {
    const { name, address, cep, latitude, longitude } = body
    const adminId = user.sub

    const result = await this.editRecipient.execute({
      adminId,
      recipientId: id,
      name,
      address,
      cep,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
