-- AlterTable
ALTER TABLE "notes" ADD COLUMN     "in_reply_to_id" TEXT,
ADD COLUMN     "renote_id" TEXT;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_in_reply_to_id_fkey" FOREIGN KEY ("in_reply_to_id") REFERENCES "notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notes" ADD CONSTRAINT "notes_renote_id_fkey" FOREIGN KEY ("renote_id") REFERENCES "notes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
