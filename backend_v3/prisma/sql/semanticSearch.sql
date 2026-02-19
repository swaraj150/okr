SELECT 
  e."objectiveId",
  o."title",
  e."embedding"
FROM "OkrEmbedding" e
JOIN "Objective" o ON o."id" = e."objectiveId"
ORDER BY e."embedding" <=> $1
LIMIT 5;
