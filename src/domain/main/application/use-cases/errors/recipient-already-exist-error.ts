import { UseCaseError } from '@/core/errors/use-case-error'

export class RecipientAlreadyExistError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Recipient "${identifier}" already exists`)
  }
}
