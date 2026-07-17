import qdrant from "../config/qdrant.js";
import { generateEmbedding } from "../services/embeddingService.js";
import { loadDocuments } from "../services/documentLoader.js";

export async function seedQdrant() {
  const documents = await loadDocuments();;

  const points = [];

  for (const document of documents) {
    const embedding = await generateEmbedding(document.text);

    points.push({
      id: document.id,
      vector: embedding,
      payload: {
        text: document.text,
        source: document.source,
      },
    });
  }

  await qdrant.upsert("documents", {
    wait: true,
    points,
  });

  console.log("✅ Seeded Qdrant with real embeddings.");
}