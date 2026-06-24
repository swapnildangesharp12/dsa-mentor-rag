DSA Assistant — RAG-Based Q&A System


An intelligent question-answering system for Data Structures & Algorithms, powered by Retrieval-Augmented Generation (RAG) using LangChain and Hugging Face.




Table of Contents


Overview
Architecture
Tech Stack
Features
Project Structure
Installation
Usage
How It Works
Sample Output
Future Improvements
Author



Overview

The DSA Assistant is a Retrieval-Augmented Generation (RAG) system that answers Data Structures & Algorithms queries by retrieving relevant context from PDF-based knowledge sources and generating precise, document-grounded responses using a Large Language Model (LLM).

Unlike a plain chatbot that relies solely on parametric knowledge, this system grounds every answer in your uploaded DSA documents — making responses accurate, explainable, and traceable to a source.


Architecture

┌─────────────────────────────────────────────────────────────┐
│                        USER QUERY                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   INGESTION PIPELINE                        │
│                                                             │
│   PDF Documents  →  PyPDFLoader  →  Text Chunks             │
│                                   (RecursiveCharacter       │
│                                    TextSplitter)            │
│                        │                                    │
│                        ▼                                    │
│              Hugging Face Embeddings                        │
│                        │                                    │
│                        ▼                                    │
│                  FAISS Vector Index                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                   RETRIEVAL PIPELINE                        │
│                                                             │
│   Query  →  Embed Query  →  FAISS Similarity Search        │
│                                   │                         │
│                                   ▼                         │
│                        Top-K Relevant Chunks                │
│                                   │                         │
│                                   ▼                         │
│                     LLM (Hugging Face Inference)            │
│                                   │                         │
│                                   ▼                         │
│                     Context-Aware Final Answer              │
└─────────────────────────────────────────────────────────────┘


Tech Stack

ComponentTechnologyLanguagePython 3.10+RAG FrameworkLangChainEmbeddingsHugging Face (sentence-transformers)LLM InferenceHugging Face (transformers / Inference API)Vector StoreFAISSDocument LoaderPyPDFLoaderText SplitterRecursiveCharacterTextSplitterEnvironmentPython venv / conda


Features


PDF ingestion — load any DSA textbook or notes in PDF format
Smart chunking — recursively splits documents preserving context boundaries
Semantic search — FAISS-powered similarity search over dense vector embeddings
Context-aware answers — LLM generates answers grounded in retrieved document chunks
Fully open-source — no OpenAI API key required; runs on Hugging Face models
Modular architecture — ingestion, retrieval, and generation are independent modules, easy to swap or extend



Project Structure

dsa-assistant/
│
├── data/
│   └── *.pdf                  # Your DSA PDF documents go here
│
├── src/
│   ├── ingestion.py           # PDF loading, chunking, embedding, FAISS indexing
│   ├── retrieval.py           # Query embedding + FAISS similarity search
│   ├── generation.py          # LLM response generation with retrieved context
│   └── pipeline.py            # End-to-end RAG pipeline orchestration
│
├── faiss_index/
│   └── index.faiss            # Saved FAISS vector index (auto-generated)
│
├── requirements.txt
├── .env.example               # Template for environment variables
└── README.md


Installation

1. Clone the repository

bashgit clone https://github.com/SwapnilDange/dsa-assistant.git
cd dsa-assistant

2. Create a virtual environment

bashpython -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

3. Install dependencies

bashpip install -r requirements.txt

4. Set up environment variables

bashcp .env.example .env
# Add your Hugging Face API token to .env

.env format:

HUGGINGFACE_API_TOKEN=your_token_here


Usage

Step 1 — Ingest your PDF documents

Place your DSA PDF files inside the data/ folder, then run:

bashpython src/ingestion.py

This will:


Load all PDFs from data/
Split them into chunks
Generate embeddings using Hugging Face
Save the FAISS index to faiss_index/


Step 2 — Ask a question

bashpython src/pipeline.py --query "What is the time complexity of merge sort?"

Example queries you can try

bashpython src/pipeline.py --query "Explain how a binary search tree works"
python src/pipeline.py --query "What is dynamic programming and when should I use it?"
python src/pipeline.py --query "Difference between BFS and DFS"
python src/pipeline.py --query "How does quicksort work in the worst case?"


How It Works

1. Ingestion Pipeline

python# Load PDFs
loader = PyPDFLoader("data/dsa_book.pdf")
documents = loader.load()

# Split into chunks
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_documents(documents)

# Generate embeddings and index
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstore = FAISS.from_documents(chunks, embeddings)
vectorstore.save_local("faiss_index")

2. Retrieval Pipeline

python# Load saved index
vectorstore = FAISS.load_local("faiss_index", embeddings)

# Retrieve top-k relevant chunks
retriever = vectorstore.as_retriever(search_kwargs={"k": 4})
relevant_docs = retriever.get_relevant_documents(query)

3. Generation Pipeline

python# Build RAG chain using LangChain
llm = HuggingFaceHub(repo_id="google/flan-t5-large", model_kwargs={"temperature": 0.5})
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)
answer = qa_chain.run(query)


Sample Output

Query: What is the time complexity of merge sort?

Retrieved Context: [from Chapter 4 — Sorting Algorithms, page 87]
"Merge sort divides the array into two halves recursively and merges them
in sorted order. The recurrence relation is T(n) = 2T(n/2) + O(n)..."

Answer:
Merge sort has a time complexity of O(n log n) in all cases — best, average,
and worst. This is because the array is always divided into two equal halves
(log n levels) and each level requires O(n) work to merge. Unlike quicksort,
merge sort guarantees O(n log n) even in the worst case.


Future Improvements


 Add a Streamlit / Gradio web UI for browser-based interaction
 Support multi-PDF ingestion with source attribution per answer
 Add re-ranking of retrieved chunks for better answer quality
 Integrate a more powerful LLM (Mistral, LLaMA 3) via Ollama for local inference
 Implement conversational memory for multi-turn Q&A sessions
 Add evaluation metrics (ROUGE, BERTScore) for answer quality measurement
