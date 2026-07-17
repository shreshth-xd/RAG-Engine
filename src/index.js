import { configDotenv } from "dotenv";
configDotenv();

import express from "express";
import qdrant from "./config/qdrant.js";
import { testQdrantConnection, initializeQdrant } from "./db/initQdrant.js";
import { seedQdrant } from "./db/seedQdrant.js";
import { searchQdrant } from "./db/searchQdrant.js";


const app = express();
const PORT = process.env.PORT;


app.get("/", (req, res) => {
  res.send("RAG Engine is running 🚀");
});

await initializeQdrant();
await seedQdrant();
await searchQdrant();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});