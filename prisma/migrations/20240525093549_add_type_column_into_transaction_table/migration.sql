-- CreateEnum
CREATE TYPE "Type" AS ENUM ('IN', 'OUT', 'TRANSFER');

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "type" "Type" NOT NULL DEFAULT 'IN';
