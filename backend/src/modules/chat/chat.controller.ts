import { Request, Response } from "express";
import { prisma } from "../../config/db";
import { getEmbedding, generateAnswerStream } from "../../utils/embedder";
import { getIndex } from "../../config/pinecone";

export async function chat(req: Request, res: Response) {
  try {
    const { message, sessionId } = req.body;
    const org = req.org;

    if (!message) return res.status(400).json({ error: "Message is required" });

    // 1. Create or reuse chat session
    let session;
    if (sessionId) {
      session = await prisma.chatSession.findFirst({
        where: { id: sessionId, orgId: org.id },
      });
    }
    if (!session) {
      session = await prisma.chatSession.create({
        data: { orgId: org.id },
      });
    }

    // 2. Save user message
    await prisma.message.create({
      data: { sessionId: session.id, role: "USER", content: message },
    });

    // 3. Embed the question
    const questionEmbedding = await getEmbedding(message, org);

    // 4. Query Pinecone — filter by orgId for tenant isolation
    const index = getIndex();
    const queryResult = await index.query({
      vector: questionEmbedding,
      topK: 5,
      filter: { orgId: org.id },
      includeMetadata: true,
    });

    // 5. Build context from retrieved chunks
    const context = queryResult.matches
      .map((match) => match.metadata?.text as string)
      .filter(Boolean)
      .join("\n\n");

    // 6. Set up SSE stream
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Send the sessionId immediately
    res.write(`data: ${JSON.stringify({ sessionId: session.id })}\n\n`);

    let fullAnswer = "";

    if (!context) {
      // Fallback if no docs
      fullAnswer = org.botGreeting;
      res.write(`data: ${JSON.stringify({ chunk: fullAnswer })}\n\n`);
    } else {
      // 7. Generate stream
      const stream = await generateAnswerStream(message, context, org);
      for await (const chunk of stream.stream) {
        const chunkText = chunk.text();
        fullAnswer += chunkText;
        res.write(`data: ${JSON.stringify({ chunk: chunkText })}\n\n`);
      }
    }

    // Send done signal
    res.write(`data: [DONE]\n\n`);
    res.end();

    // 8. Save assistant message and update stats
    await prisma.message.create({
      data: { sessionId: session.id, role: "ASSISTANT", content: fullAnswer },
    });
    await prisma.organization.update({
      where: { id: org.id },
      data: { chatCount: { increment: 1 } },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Chat failed" });
  }
}

export async function getChatHistory(req: Request, res: Response) {
  const sessions = await prisma.chatSession.findMany({
    where: { orgId: req.org.id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  return res.json(sessions);
}
