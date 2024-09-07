import { Order } from '@/domain/main/enterprise/entities/order'
import { Recipient } from '@/domain/main/enterprise/entities/recipient'

export interface FetchProps {
  orders: Order[]
  recipientNearby: Recipient[]
}
