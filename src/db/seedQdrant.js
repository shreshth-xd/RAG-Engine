import qdrant from "../config/qdrant.js";
import { generateEmbedding } from "../services/embeddingService.js";

export async function seedQdrant() {
  const documents = [
    {
      id: 1,
      text: "Docker is a platform for developing and running containers.",
      source: "docker.md",
    },
    {
      id: 2,
      text: "Express is a minimalist web framework for Node.js.",
      source: "express.md",
    },
  ];

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