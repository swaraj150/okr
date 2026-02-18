ALTER TABLE "OkrEmbedding"
DROP COLUMN "embedding";

ALTER TABLE "OkrEmbedding"
ADD COLUMN "embedding" vector(3072);
