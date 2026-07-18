import qdrant from "../config/qdrant.js";
import { generateEmbedding } from "../services/embeddingService.js";
import { loadDocuments } from "../services/documentLoader.js";
import { splitText } from "../services/chunker.js";

export async function seedQdrant() {
  await qdrant.delete("documents", {
    filter: {},
    wait: true,
  });

  console.log("🗑️ Cleared previous index.");

  const documents = await loadDocuments();

  const points = [];
  let pointId = 1;

  for (const document of documents) {
    const chunks = splitText(document.text);

    for (const chunk of chunks) {
      const embedding = await generateEmbedding(chunk);

      points.push({
        id: pointId++,
        vector: embedding,
        payload: {
          text: chunk,
          source: document.source,
        },
      });
    }
  }

  await qdrant.upsert("documents", {
    wait: true,
    points,
  });

  console.log(`✅ Indexed ${points.length} chunks.`);


}