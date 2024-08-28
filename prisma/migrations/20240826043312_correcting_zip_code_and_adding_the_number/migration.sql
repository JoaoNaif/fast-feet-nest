/*
  Warnings:

  - Added the required column `number` to the `recipients` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `cep` on the `recipients` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "recipients" ADD COLUMN     "number" INTEGER NOT NULL,
DROP COLUMN "cep",
ADD COLUMN     "cep" INTEGER NOT NULL;
