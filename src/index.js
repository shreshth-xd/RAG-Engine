import { configDotenv } from "dotenv";
configDotenv();

import express from "express";
import qdrant from "./config/qdrant.js";
import { testQdrantConnection, initializeQdrant } from "./db/initQdrant.js";
import { seedQdrant } from "./db/seedQdrant.js";
import { searchQdrant } from "./db/searchQdrant.js";
import { generateEmbedding } from "./services/embeddingService.js";
import ai from "./config/gemini.js";

const app = express();
const PORT = process.env.PORT;


app.get("/", (req, res) => {
  res.send("RAG Engine is running 🚀");
});

// await initializeQdrant();
// await seedQdrant();
const results = await searchQdrant("What is Docker?");
console.log(results);

// Generating an embedding using gemini-embedding-001 for now, will move to gemini-embedding-2 real soon
// const embedding = await generateEmbedding(
//   "Docker is a platform for developing and running containers."
// );

// console.log("Embedding length:", embedding.length);
// console.log("First 10 values:", embedding.slice(0, 10));

// To test the availability of a model
// const response = await ai.models.generateContent({
//   model: "gemini-3.1-flash-lite",
//   contents: "Say hello",
// });

// console.log(response.text);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});