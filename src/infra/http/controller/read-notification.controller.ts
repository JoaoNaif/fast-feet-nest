import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const readNotificationBodySchema = z.object({
  recipientId: z.string().uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(readNotificationBodySchema)

type ReadNotificationBodySchema = z.infer<typeof readNotificationBodySchema>

@Controller('notifications/:notificationId/read')
export class ReadNotificationController {
  constructor(private readNotification: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: ReadNotificationBodySchema,
    @Param('notificationId') notificationId: string,
  ) {
    const { recipientId } = body

    const result = await this.readNotification.execute({
      notificationId,
      recipientId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
