import { BadRequestException } from '@nestjs/common'
import { ZodError } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe {
  constructor(private schema) {}

  transform(value) {
    try {
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          errors: fromZodError(error),
        })
      }
    }
  }
}
