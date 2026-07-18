import { configDotenv } from "dotenv";
configDotenv();

import path from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import express from "express";
import { seedQdrant } from "./db/seedQdrant.js";
import { searchQdrant } from "./db/searchQdrant.js";
import { buildPrompt } from "./services/promptBuilder.js";
import { generateAnswer } from "./services/llmService.js";

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const adminSessions = new Map();

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

function parseCookies(cookieHeader = "") {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce((cookies, part) => {
      const separatorIndex = part.indexOf("=");
      if (separatorIndex === -1) {
        return cookies;
      }

      const key = part.slice(0, separatorIndex).trim();
      const value = part.slice(separatorIndex + 1).trim();
      cookies[key] = value;
      return cookies;
    }, {});
}

function getAdminSession(req) {
  const cookies = parseCookies(req.headers.cookie || "");
  const sessionId = cookies.adminSession;

  if (!sessionId) {
    return null;
  }

  return adminSessions.get(sessionId) || null;
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "admin.html"));
});

app.post("/admin/login", async (req, res) => {
  try {
    const { password } = req.body;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminPasswordHash) {
      return res.status(500).json({ error: "Admin password is not configured." });
    }

    if (typeof password !== "string" || !password) {
      return res.status(401).json({ error: "Invalid password." });
    }

    const isValid = await bcrypt.compare(password, adminPasswordHash);

    if (!isValid) {
      return res.status(401).json({ error: "Invalid password." });
    }

    const sessionId = crypto.randomBytes(24).toString("hex");
    adminSessions.set(sessionId, { authenticated: true });

    res.cookie("adminSession", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Admin login failed:", error);
    res.status(500).json({ error: "Login failed." });
  }
});

app.post("/admin/reindex", async (req, res) => {
  const session = getAdminSession(req);

  if (!session) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  try {
    await seedQdrant();
    res.json({ success: true });
  } catch (error) {
    console.error("Admin reindex failed:", error);
    res.status(500).json({ error: "Indexing failed." });
  }
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