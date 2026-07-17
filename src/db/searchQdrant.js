import qdrant from "../config/qdrant.js";
import { generateEmbedding } from "../services/embeddingService.js";

export async function searchQdrant(query) {
  const queryEmbedding = await generateEmbedding(query);

  const results = await qdrant.query("documents", {
    query: queryEmbedding,
    limit: 2,
    with_payload: true,
  });

  return results.points;
}