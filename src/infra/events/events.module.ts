import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { OnOrderUpdated } from '@/domain/notification/application/subscribers/on-order-updated'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

@Module({
  imports: [DatabaseModule],
  providers: [OnOrderUpdated, SendNotificationUseCase],
})
export class EventsModule {}
