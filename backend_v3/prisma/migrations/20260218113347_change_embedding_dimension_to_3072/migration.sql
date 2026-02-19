/*
  Warnings:

  - Made the column `embedding` on table `OkrEmbedding` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "OkrEmbedding" ALTER COLUMN "embedding" SET NOT NULL;
