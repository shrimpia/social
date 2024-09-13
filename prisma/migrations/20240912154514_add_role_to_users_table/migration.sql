-- CreateEnum
CREATE TYPE "Role" AS ENUM ('User', 'Admin', 'Moderator');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'User';
