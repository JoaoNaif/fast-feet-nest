import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { AttachmentRepository } from '@/domain/main/application/repositories/attachment-repository'
import { PrismaAttachmentRepository } from './prisma/repositories/prisma-attachment-repository'
import { DeliverymanRepository } from '@/domain/main/application/repositories/deliveryman-repository'
import { PrismaDeliverymanRepository } from './prisma/repositories/prisma-deliveryman-repository'
import { OrderAttachmentRepository } from '@/domain/main/application/repositories/order-attachment-repository'
import { PrismaOrderAttachmentRepository } from './prisma/repositories/prisma-order-attachment-repository'
import { PrismaOrderRepository } from './prisma/repositories/prisma-order-repository'
import { OrderRepository } from '@/domain/main/application/repositories/order-repository'
import { RecipientRepository } from '@/domain/main/application/repositories/recipient-repository'
import { PrismaRecipientRepository } from './prisma/repositories/prisma-recipient-repository'
import { NotificationRepository } from '@/domain/notification/application/repositories/notification-repository'
import { PrismaNotificationRepository } from './prisma/repositories/prisma-notification-repository'
import { CacheModule } from '../cache/cache.module'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    {
      provide: AttachmentRepository,
      useClass: PrismaAttachmentRepository,
    },
    {
      provide: DeliverymanRepository,
      useClass: PrismaDeliverymanRepository,
    },
    {
      provide: OrderAttachmentRepository,
      useClass: PrismaOrderAttachmentRepository,
    },
    {
      provide: OrderRepository,
      useClass: PrismaOrderRepository,
    },
    {
      provide: RecipientRepository,
      useClass: PrismaRecipientRepository,
    },
    {
      provide: NotificationRepository,
      useClass: PrismaNotificationRepository,
    },
  ],
  exports: [
    PrismaService,
    AttachmentRepository,
    DeliverymanRepository,
    OrderAttachmentRepository,
    OrderRepository,
    RecipientRepository,
    NotificationRepository,
  ],
})
export class DatabaseModule {}
