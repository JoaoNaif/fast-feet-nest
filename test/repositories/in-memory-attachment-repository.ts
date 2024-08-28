import { AttachmentRepository } from '@/domain/main/application/repositories/attachment-repository'
import { Attachment } from '@/domain/main/enterprise/entities/attachment'

export class InMemoryAttachmentRepository implements AttachmentRepository {
  public items: Attachment[] = []

  async create(attachment: Attachment) {
    this.items.push(attachment)
  }
}
