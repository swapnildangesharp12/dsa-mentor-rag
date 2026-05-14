const { Pinecone } = require("@pinecone-database/pinecone");
const { PineconeStore } = require("@langchain/pinecone");
const { embeddings } = require("../embeddings/embedder");

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const indexName = process.env.PINECONE_INDEX_NAME;

let vectorStore;

async function createVectorStore(docs) {
  const index = pinecone.Index(indexName);

  vectorStore = await PineconeStore.fromDocuments(docs, embeddings, {
    pineconeIndex: index,
  });

  return vectorStore;
}

async function loadVectorStore() {
  const index = pinecone.Index(indexName);

  vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: index,
  });

  return vectorStore;
}

function getVectorStore() {
  return vectorStore;
}

module.exports = {
  createVectorStore,
  loadVectorStore,
  getVectorStore,
};