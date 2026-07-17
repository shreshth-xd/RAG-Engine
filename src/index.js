import { configDotenv } from "dotenv";
configDotenv();

import express from "express";
import qdrant from "./config/qdrant.js";
import { testQdrantConnection, initializeQdrant } from "./db/initQdrant.js";


const app = express();
const PORT = process.env.PORT;

await initializeQdrant();

app.get("/", (req, res) => {
  res.send("RAG Engine is running 🚀");
});

testQdrantConnection();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});