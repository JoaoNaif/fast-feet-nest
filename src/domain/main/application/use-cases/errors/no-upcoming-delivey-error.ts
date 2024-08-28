import { UseCaseError } from '@/core/errors/use-case-error'

export class NoUpcomingDeliveryError extends Error implements UseCaseError {
  constructor() {
    super(`No deliveries found within a 10km radius`)
  }
}
