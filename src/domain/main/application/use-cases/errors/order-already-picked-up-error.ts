import { UseCaseError } from '@/core/errors/use-case-error'

export class OrderAlreadyPickedUpError extends Error implements UseCaseError {
  constructor() {
    super(`Order already picked up`)
  }
}
