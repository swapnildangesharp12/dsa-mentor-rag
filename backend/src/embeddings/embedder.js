const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "embedding-001",
});

async function splitDocuments(text) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 600,      // bigger for DSA
    chunkOverlap: 200,
  });

  const docs = await splitter.createDocuments([text]);
  return docs;
}

module.exports = { embeddings, splitDocuments };