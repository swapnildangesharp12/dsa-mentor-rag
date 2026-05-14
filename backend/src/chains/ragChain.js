const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-pro",
  temperature: 0.3,
});

async function askQuestion(query, retriever) {
  const docs = await retriever.getRelevantDocuments(query);

  const context = docs.map((doc, i) => {
    return `Source ${i + 1}: ${doc.pageContent}`;
  }).join("\n");

  const prompt = `
You are a DSA Mentor.

Rules:
- Explain clearly and simply
- Provide optimal approach
- Include time and space complexity
- If coding needed → give code in Java
- If not found → say "I don't know"
- If interview question → give hints first

Context:
${context}

Question:
${query}

Answer:
`;

  const response = await model.invoke(prompt);

  return response.content;
}

module.exports = { askQuestion };