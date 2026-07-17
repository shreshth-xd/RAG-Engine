import fs from "fs/promises";
import path from "path";

const DATA_DIRECTORY = "../data";

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