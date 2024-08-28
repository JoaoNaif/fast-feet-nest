-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_order_id_fkey";

-- AlterTable
ALTER TABLE "attachments" ALTER COLUMN "order_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
