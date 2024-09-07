import { Public } from '@/infra/auth/public'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { AuthenticateDeliverymanUseCase } from '@/domain/main/application/use-cases/authenticate-deliveryman'
import { WrongCredentialsError } from '@/domain/main/application/use-cases/errors/wrong-credentials-error'
import { Cpf } from '@/domain/main/enterprise/entities/value-objects/cpf'

const authenticateDeliverymanBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

type AuthenticateDeliverymanBodySchema = z.infer<
  typeof authenticateDeliverymanBodySchema
>

@Controller('/sessions')
@Public()
export class AuthenticateDeliverymanController {
  constructor(
    private authenticateDeliveryman: AuthenticateDeliverymanUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateDeliverymanBodySchema))
  async handle(@Body() body: AuthenticateDeliverymanBodySchema) {
    const { cpf, password } = body

    const cpfText = Cpf.createFromText(cpf)

    const result = await this.authenticateDeliveryman.execute({
      cpf: cpfText.value,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
