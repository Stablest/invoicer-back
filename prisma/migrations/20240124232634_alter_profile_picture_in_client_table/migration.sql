-- AlterTable
ALTER TABLE "clients" ALTER COLUMN "profilePicture" DROP NOT NULL,
ALTER COLUMN "profilePicture" SET DATA TYPE TEXT;
