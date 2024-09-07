import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { RegisterDeliverymanController } from './controller/register-deliveryman.contoller'
import { RegisterDeliverymanUseCase } from '@/domain/main/application/use-cases/register-deliveryman'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateDeliverymanController } from './controller/authenticate-deliveryman.controller'
import { AuthenticateDeliverymanUseCase } from '@/domain/main/application/use-cases/authenticate-deliveryman'
import { RegisterAdminController } from './controller/register-admin.controller'
import { RegisterAdminUseCase } from '@/domain/main/application/use-cases/register-admin'
import { GetDeliverymanController } from './controller/get-deliveryman.controller'
import { GetDeliverymanUseCase } from '@/domain/main/application/use-cases/get-deliveryman'
import { CreateRecipientController } from './controller/create-recipient.controller'
import { CreateRecipientUseCase } from '@/domain/main/application/use-cases/create-recipient'
import { GetRecipientController } from './controller/get-recipient.contoller'
import { GetRecipientUseCase } from '@/domain/main/application/use-cases/get-recipient'
import { DeleteDeliverymanController } from './controller/delete-deliveryman.contoller'
import { DeleteDeliverymanUseCase } from '@/domain/main/application/use-cases/delete-deliveryman'
import { DeleteRecipientController } from './controller/delete-recipient.controller'
import { DeleteRecipientUseCase } from '@/domain/main/application/use-cases/delete-recipient'
import { EditDeliverymanController } from './controller/edit-deliveryman.controller'
import { EditDeliverymanUseCase } from '@/domain/main/application/use-cases/edit-deliveryman'
import { EditRecipientController } from './controller/edit-recipient.controller'
import { EditRecipientUseCase } from '@/domain/main/application/use-cases/edit-recipient'
import { CreateOrderController } from './controller/create-order.controller'
import { CreateOrderUseCase } from '@/domain/main/application/use-cases/create-order'
import { FetchOrderCityController } from './controller/fetch-order-city.controller'
import { FetchOrderCityUseCase } from '@/domain/main/application/use-cases/fetch-order-city'
import { FetchNearbyDeliveryController } from './controller/fetch-nearby-deliveryman.controller'
import { FetchNearbyDeliveryUseCase } from '@/domain/main/application/use-cases/fetch-nearby-delivery'
import { EditOrderController } from './controller/edit-order.controller'
import { EditOrderUseCase } from '@/domain/main/application/use-cases/edit-order'
import { DeleteOrderController } from './controller/delete-order.controller'
import { DeleteOrderUseCase } from '@/domain/main/application/use-cases/delete-order'
import { WithdrawOrderController } from './controller/withdraw-order.controller'
import { WithdrawOrderUseCase } from '@/domain/main/application/use-cases/withdraw-order'
import { OrderCompletedController } from './controller/order-completed.controller'
import { OrderCompletedUseCase } from '@/domain/main/application/use-cases/order-completed'
import { StorageModule } from '../storage/storage.module'
import { UploadAttachmentController } from './controller/upload-attachment.controller'
import { UploadAndCreateAttachmentUseCase } from '@/domain/main/application/use-cases/upload-and-create-attachment'
import { ReadNotificationController } from './controller/read-notification.controller'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { FetchOrderDeliverymanUseCase } from '@/domain/main/application/use-cases/fetch-order-deliveryman'
import { FetchOrderDeliverymanController } from './controller/fetch-order-deliveryman.controller'

@Module({
  imports: [DatabaseModule, CryptographyModule, StorageModule],
  controllers: [
    RegisterDeliverymanController,
    AuthenticateDeliverymanController,
    RegisterAdminController,
    GetDeliverymanController,
    CreateRecipientController,
    GetRecipientController,
    DeleteDeliverymanController,
    DeleteRecipientController,
    EditDeliverymanController,
    EditRecipientController,
    CreateOrderController,
    FetchOrderCityController,
    FetchNearbyDeliveryController,
    EditOrderController,
    DeleteOrderController,
    WithdrawOrderController,
    FetchOrderDeliverymanController,
    OrderCompletedController,
    UploadAttachmentController,
    ReadNotificationController,
  ],
  providers: [
    RegisterDeliverymanUseCase,
    AuthenticateDeliverymanUseCase,
    RegisterAdminUseCase,
    GetDeliverymanUseCase,
    CreateRecipientUseCase,
    GetRecipientUseCase,
    DeleteDeliverymanUseCase,
    DeleteRecipientUseCase,
    EditDeliverymanUseCase,
    EditRecipientUseCase,
    CreateOrderUseCase,
    FetchOrderCityUseCase,
    FetchNearbyDeliveryUseCase,
    EditOrderUseCase,
    DeleteOrderUseCase,
    WithdrawOrderUseCase,
    FetchOrderDeliverymanUseCase,
    OrderCompletedUseCase,
    UploadAndCreateAttachmentUseCase,
    ReadNotificationUseCase,
  ],
})
export class HttpModule {}
