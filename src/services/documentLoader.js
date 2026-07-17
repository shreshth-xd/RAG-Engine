import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIRECTORY = path.join(__dirname, "../data");

export async function loadDocuments() {
  const files = await fs.readdir(DATA_DIRECTORY);

  const documents = [];

  for (const file of files) {
    const text = await fs.readFile(
      path.join(DATA_DIRECTORY, file),
      "utf-8"
    );

    documents.push({
      id: documents.length + 1,
      text,
      source: file,
    });
  }

  return documents;
}