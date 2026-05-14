const { loadPDF } = require("../loaders/pdfLoaders");
const { splitDocuments } = require("../embeddings/embedder");
const {
  createVectorStore,
  loadVectorStore,
  getVectorStore,
} = require("../vectorstore/vectorStore");

const { askQuestion } = require("../chains/ragChain");

async function uploadPDF(req, res) {
  try {
    const filePath = req.file.path;

    const text = await loadPDF(filePath);
    const docs = await splitDocuments(text);

    await createVectorStore(docs);

    res.json({ message: "DSA content uploaded successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function chat(req, res) {
  try {
    const { query } = req.body;

    let store = getVectorStore();

    if (!store) {
      store = await loadVectorStore();
    }

    const retriever = store.asRetriever({ k: 4 });

    const answer = await askQuestion(query, retriever);

    res.json({ answer });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { uploadPDF, chat };