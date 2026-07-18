export function buildPrompt(question, chunks) {
  const context = chunks
    .map((chunk, index) => {
      return `[Source ${index + 1}: ${chunk.source}]

${chunk.text}`;
    })
    .join("\n\n");

  return `
You are a helpful AI assistant.

Answer the user's question ONLY using the provided context.

If the answer cannot be found in the context, reply:
"I couldn't find that information in the provided documents."

Context:
${context}

Question:
${question}

Answer:
`;
}