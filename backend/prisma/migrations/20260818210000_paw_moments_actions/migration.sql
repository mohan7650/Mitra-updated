-- AlterTable
ALTER TABLE "pet_posts" ADD COLUMN "original_post_id" TEXT;

-- CreateIndex
CREATE INDEX "pet_posts_original_post_id_idx" ON "pet_posts"("original_post_id");

-- CreateIndex
CREATE UNIQUE INDEX "pet_posts_pet_id_original_post_id_key" ON "pet_posts"("pet_id", "original_post_id");

-- AddForeignKey
ALTER TABLE "pet_posts" ADD CONSTRAINT "pet_posts_original_post_id_fkey" FOREIGN KEY ("original_post_id") REFERENCES "pet_posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
