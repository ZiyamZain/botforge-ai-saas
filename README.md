# BotForge AI SaaS 🚀

BotForge is a multi-tenant B2B AI SaaS platform that allows businesses to easily build, train, and deploy custom AI customer support agents. By simply uploading PDF documents or providing a public URL to scrape, businesses can instantly generate a highly accurate Retrieval-Augmented Generation (RAG) agent that answers questions based entirely on their own knowledge base.

It provides a vanilla JS/React cross-origin widget that clients can embed directly into their websites.

## 🌟 Key Features

- **Multi-Tenant Architecture:** Secure isolation of data, API keys, and document processing across different organizations.
- **Production RAG Pipeline:** 
  - Extracts text from unstructured PDFs and scraped HTML.
  - Mathematically chunks data for semantic search.
  - Generates embeddings using the Gemini API.
  - Upserts vector data into a **Pinecone Serverless** database.
- **Website Scraping:** Ingest knowledge directly from public URLs using Cheerio.
- **Real-Time Streaming (SSE):** LLM responses are streamed via Server-Sent Events (SSE) directly to the frontend, creating a seamless, low-latency typewriter effect.
- **Embeddable Chat Widget:** A compiled vanilla JavaScript widget that clients can inject into their own DOM, authenticated securely via an `x-api-key` header.
- **Chat History & Analytics:** Tracks user-agent conversation history in a PostgreSQL database for monitoring and fallback analytics.

## 🏗️ Architecture & Tech Stack

- **Frontend (Dashboard):** React, Next.js, TailwindCSS, React Query
- **Frontend (Widget):** React, Vite (compiled to a single embeddable script)
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL, Prisma ORM
- **Vector Database:** Pinecone
- **AI / LLM:** Google Gemini 2.5 Flash
- **Storage:** Cloudinary (for raw PDF storage)

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database
- API Keys for: Gemini, Pinecone, and Cloudinary.

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ZiyamZain/botforge-ai-saas.git
   cd botforge-ai-saas
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder with the following keys:
   ```env
   DATABASE_URL="postgresql://user:pass@localhost:5432/botforge"
   JWT_SECRET="your-secret"
   PINECONE_API_KEY="your-pinecone-key"
   GEMINI_API_KEY="your-gemini-key"
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```
   Push the schema to the database and start the server:
   ```bash
   npx prisma db push
   npm run dev
   ```

3. **Setup the Dashboard (Frontend):**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Build the Widget:**
   ```bash
   cd ../widget
   npm install
   npm run build
   ```
   *Note: This automatically copies the compiled `widget.js` to the backend public folder to be served cross-origin.*
