import qdrant from "../config/qdrant.js";

export async function testQdrantConnection() {
  try {
    const collections = await qdrant.getCollections();

    console.log("✅ Connected to Qdrant");
    console.log(collections);
  } catch (error) {
    console.error("❌ Failed to connect to Qdrant");
    console.error(error);
  }
}

export async function initializeQdrant() {
  const COLLECTION_NAME = "documents";

  try {
    const collections = await qdrant.getCollections();

    const exists = collections.collections.some(
      (collection) => collection.name === COLLECTION_NAME
    );

    if (exists) {
      console.log("✅ Collection already exists.");
      return;
    }

    await qdrant.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 3072,
        distance: "Cosine",
      },
    });

    console.log("✅ Collection created successfully.");
  } catch (error) {
    console.error("❌ Failed to initialize Qdrant.");
    console.error(error);
  }
}