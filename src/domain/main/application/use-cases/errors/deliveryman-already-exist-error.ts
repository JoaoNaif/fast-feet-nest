import { UseCaseError } from '@/core/errors/use-case-error'

export class DeliverymanAlreadyExistError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`Deliveryman "${identifier}" already exists`)
  }
}
