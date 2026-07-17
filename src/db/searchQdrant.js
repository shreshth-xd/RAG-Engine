import qdrant from "../config/qdrant.js";

export async function searchQdrant() {
  const queryVector = Array.from({ length: 3072 }, () => Math.random());

  const results = await qdrant.query("documents", {
    query: queryVector,
    limit: 2,
    with_payload: true,
  });

  console.log(results.points);
}