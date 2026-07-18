export function splitText(
  text,
  maxChunkSize = 500,
  overlapSentences = 1
) {
  // Split into sentences while keeping punctuation.
  const sentences =
    text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(s => s.trim()) || [];

  const chunks = [];

  let currentChunk = [];
  let currentLength = 0;

  for (const sentence of sentences) {
    // +1 accounts for the space we'll insert when joining.
    if (currentLength + sentence.length + 1 > maxChunkSize) {
      chunks.push(currentChunk.join(" "));

      // Semantic overlap
      currentChunk = currentChunk.slice(-overlapSentences);
      currentLength = currentChunk.join(" ").length;
    }

    currentChunk.push(sentence);
    currentLength += sentence.length + 1;
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }

  return chunks;
}