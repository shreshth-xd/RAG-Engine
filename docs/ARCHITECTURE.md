# Pipeline

## Indexing

1.  Load documents
2.  Clean text (optional)
3.  Chunk text
4.  Generate embeddings
5.  Store vectors + metadata in Qdrant

## Retrieval

1.  User query
2.  Embed query
3.  Similarity search
4.  Build prompt
5.  Send to LLM
6.  Return answer
