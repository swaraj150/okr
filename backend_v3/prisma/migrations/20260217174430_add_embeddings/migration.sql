CREATE EXTENSION IF NOT EXISTS vector;

-- CreateTable
CREATE TABLE "OkrEmbedding" (
    "id" TEXT NOT NULL,
    "embedding" vector(768) NOT NULL,

    CONSTRAINT "OkrEmbedding_pkey" PRIMARY KEY ("id")
);

