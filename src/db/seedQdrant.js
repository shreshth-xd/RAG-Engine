import qdrant from "../config/qdrant.js";

export async function seedQdrant() {
  await qdrant.upsert("documents", {
    wait: true,
    points: [
      {
        id: 1,
        vector: Array.from({ length: 3072 }, () => Math.random()),
        payload: {
          text: "Docker is a platform for developing and running containers.",
          source: "docker.md",
        },
      },
    ],
  });

  console.log("✅ First point inserted.");
}