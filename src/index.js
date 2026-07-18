import { configDotenv } from "dotenv";
configDotenv();

import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import qdrant from "./config/qdrant.js";
import { testQdrantConnection, initializeQdrant } from "./db/initQdrant.js";
import { seedQdrant } from "./db/seedQdrant.js";
import { searchQdrant } from "./db/searchQdrant.js";
import { generateEmbedding } from "./services/embeddingService.js";
import { buildPrompt } from "./services/promptBuilder.js";
import { generateAnswer } from "./services/llmService.js";

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.post("/api/chat", async (req, res) => {
  try {
    const { question } = req.body;

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({ error: "Question is required." });
    }

    const chunks = await searchQdrant(question);
    const prompt = buildPrompt(question, chunks);
    const answer = await generateAnswer(prompt);

    res.json({ answer });
  } catch (error) {
    console.error("Chat request failed:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// Preserve the existing terminal-style RAG test flow.
try {
  const chunks = await searchQdrant("What is Docker?");
  const prompt = buildPrompt("What is Docker?", chunks);
  const finalResponse = await generateAnswer(prompt);
  console.log(finalResponse);
} catch (error) {
  console.error("Initial RAG check failed:", error);
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});