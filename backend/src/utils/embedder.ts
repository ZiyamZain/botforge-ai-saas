import { GoogleGenerativeAI } from "@google/generative-ai";
import { Organization } from "@prisma/client";

function getGeminiClient(org?: Organization): GoogleGenerativeAI {
  if (org?.hasOwnKey && org?.geminiApiKey) {
    const { decrypt } = require("./crypto");
    return new GoogleGenerativeAI(decrypt(org.geminiApiKey));
  }
  return new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
}

export async function getEmbedding(
  text: string,
  org?: Organization,
): Promise<number[]> {
  const genAI = getGeminiClient(org);
  const model = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

export async function generateAnswer(
  question: string,
  context: string,
  org?: Organization,
): Promise<string> {
  const genAI = getGeminiClient(org);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const botName = org?.botName || "Assistant";
  const instructions = org?.botInstructions || "You are a helpful assistant.";

  const prompt = `${instructions} Your name is ${botName}.
Answer the user's question using the context below.
If the user's question is a casual greeting or conversational (like "how are you"), respond politely and naturally as an AI assistant.
If the user asks a specific question about company policies or products and the answer is not in the context, say "I don't have information about that."

Context:
${context}

Question: ${question}

Answer:`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function generateAnswerStream(
  question: string,
  context: string,
  org?: Organization,
) {
  const genAI = getGeminiClient(org);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const botName = org?.botName || "Assistant";
  const instructions = org?.botInstructions || "You are a helpful assistant.";

  const prompt = `${instructions} Your name is ${botName}.
Answer the user's question using the context below.
If the user's question is a casual greeting or conversational (like "how are you"), respond politely and naturally as an AI assistant.
If the user asks a specific question about company policies or products and the answer is not in the context, say "I don't have information about that."

Context:
${context}

Question: ${question}

Answer:`;

  return await model.generateContentStream(prompt);
}
