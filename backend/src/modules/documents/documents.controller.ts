import { Request, Response } from "express";
import { prisma } from "../../config/db";
import { chunkText } from "../../utils/chunker";
import { getEmbedding } from "../../utils/embedder";
import { getIndex } from "../../config/pinecone";
import cloudinary from "../../config/cloudinary";
import axios from "axios";
import * as cheerio from "cheerio";

// Use require for CommonJS interop
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdf = require("pdf-parse-new");

export async function uploadDocument(req: Request, res: Response) {
  try {
    console.log("[upload] Request received");
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const org = req.org;
    const file = req.file;
    console.log("[upload] File:", file.originalname, "Size:", file.size, "Mime:", file.mimetype);
    console.log("[upload] Org:", org.id);
    console.log("[upload] Cloudinary config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY ? "set" : "missing",
      api_secret: process.env.CLOUDINARY_API_SECRET ? "set" : "missing",
    });

    // 1. Upload to Cloudinary directly from memory
    console.log("[upload] Starting Cloudinary upload...");
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: `chatbot-saas/${org.id}`, resource_type: "raw" },
          (error, result) => {
            if (error) { console.error("[upload] Cloudinary error:", error); reject(error); }
            else { console.log("[upload] Cloudinary success:", result?.secure_url); resolve(result); }
          },
        )
        .end(file.buffer);
    });

    // 2. Create document record in DB (status: PROCESSING)
    console.log("[upload] Creating DB record...");
    const document = await prisma.document.create({
      data: {
        orgId: org.id,
        fileName: file.originalname,
        fileUrl: uploadResult.secure_url,
        status: "PROCESSING",
      },
    });
    console.log("[upload] DB record created:", document.id);

    // 3. Process in background (don't await — respond immediately)
    processDocument(document.id, file.buffer, org).catch(async (err) => {
      console.error("Processing failed:", err);
      await prisma.document.update({
        where: { id: document.id },
        data: { status: "FAILED" },
      });
    });

    return res.status(201).json({
      message: "Upload started",
      documentId: document.id,
    });
  } catch (err: any) {
    console.error("[upload] Upload error:", err);
    return res.status(500).json({ error: "Upload failed: " + err.message });
  }
}

async function processDocument(documentId: string, fileBuffer: Buffer, org: any) {
  try {
    // 1. Extract text
    const data = await pdf(fileBuffer);
    const text = data.text;
    console.log(`[process] Extracted ${text.length} chars from PDF`);

    if (!text || text.trim() === "") {
      throw new Error("No readable text found in PDF");
    }

    // 2. Chunk text
    const chunks = chunkText(text, 1000, 200);
    console.log(`[process] Created ${chunks.length} chunks`);

    const index = getIndex();

    // 3. Embed & Upsert each chunk
    const vectors = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await getEmbedding(chunk, org);
      
      console.log(`[process] Chunk ${i+1} embedded: ${embedding.length} dimensions`);

      vectors.push({
        id: `${documentId}_chunk_${i}`,
        values: embedding,
        metadata: {
          orgId: org.id,
          documentId: documentId,
          text: chunk,
        },
      });
    }

    // Batch upsert (max 100 per request)
    const batchSize = 100;
    console.log(`[process] Total vectors to upsert: ${vectors.length}`);
    for (let i = 0; i < vectors.length; i += batchSize) {
      console.log(`[process] Upserting batch ${i/batchSize + 1}...`);
      await index.upsert({
        records: vectors.slice(i, i + batchSize)
      });
    }
    console.log("[process] Upsert complete.");

    // 4. Mark Ready
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "READY" },
    });
    console.log("[process] Document marked READY");
  } catch (err) {
    console.error("Error in processDocument:", err);
    throw err;
  }
}

export async function uploadUrl(req: Request, res: Response) {
  try {
    const { url } = req.body;
    if (!url || !url.startsWith("http")) {
      return res.status(400).json({ error: "Valid URL is required" });
    }

    const org = req.org;

    console.log(`[uploadUrl] Starting URL upload for: ${url}`);

    // Create DB record
    const document = await prisma.document.create({
      data: {
        orgId: org.id,
        fileName: url,
        fileUrl: url,
        status: "PROCESSING",
      },
    });

    // Process in background
    processUrlDocument(document.id, url, org).catch(async (err) => {
      console.error("URL processing failed:", err);
      await prisma.document.update({
        where: { id: document.id },
        data: { status: "FAILED" },
      });
    });

    return res.status(201).json({
      message: "Scraping started",
      documentId: document.id,
    });
  } catch (err: any) {
    console.error("[uploadUrl] Error:", err);
    return res.status(500).json({ error: "Failed to process URL: " + err.message });
  }
}

async function processUrlDocument(documentId: string, url: string, org: any) {
  try {
    // 1. Fetch HTML
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "BotForge-Scraper/1.0"
      }
    });

    // 2. Extract Text using Cheerio
    const $ = cheerio.load(response.data);
    $("script, style, noscript, nav, footer, iframe").remove(); // remove non-content tags
    
    // Extract raw text and clean up whitespace
    let text = $("body").text();
    text = text.replace(/\s+/g, " ").trim();

    console.log(`[processUrl] Scraped ${text.length} chars from ${url}`);

    if (!text || text.trim() === "") {
      throw new Error("No readable text found on webpage");
    }

    // 3. Chunk text
    const chunks = chunkText(text, 1000, 200);
    console.log(`[processUrl] Created ${chunks.length} chunks`);

    const index = getIndex();

    // 4. Embed & Upsert
    const vectors = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await getEmbedding(chunk, org);

      vectors.push({
        id: `${documentId}_chunk_${i}`,
        values: embedding,
        metadata: {
          orgId: org.id,
          documentId: documentId,
          text: chunk,
        },
      });
    }

    // Batch upsert (max 100 per request)
    const batchSize = 100;
    for (let i = 0; i < vectors.length; i += batchSize) {
      await index.upsert({
        records: vectors.slice(i, i + batchSize)
      });
    }

    // 5. Mark Ready
    await prisma.document.update({
      where: { id: documentId },
      data: { status: "READY" },
    });
    console.log("[processUrl] Document marked READY");
  } catch (err) {
    console.error("Error in processUrlDocument:", err);
    throw err;
  }
}

export async function getDocuments(req: Request, res: Response) {
  try {
    const docs = await prisma.document.findMany({
      where: { orgId: req.org.id },
      orderBy: { createdAt: "desc" },
    });
    return res.json(docs);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch documents" });
  }
}

export async function deleteDocument(req: Request, res: Response) {
  try {
    const id = req.params.id as string;

    const doc = await prisma.document.findFirst({
      where: { id, orgId: req.org.id },
    });

    if (!doc) return res.status(404).json({ error: "Document not found" });

    // Delete vectors from Pinecone by ID
    // Pinecone Serverless doesn't support metadata-filter deletes,
    // so we delete by the known chunk ID pattern
    const index = getIndex();
    const chunkIds: string[] = [];
    // Generate IDs for up to 500 potential chunks
    for (let i = 0; i < 500; i++) {
      chunkIds.push(`${id}_chunk_${i}`);
    }
    try {
      // @ts-ignore
      await index.deleteMany(chunkIds);
    } catch (pineconeErr) {
      // If delete fails (e.g. no vectors exist), continue to DB delete
      console.warn("Pinecone delete skipped:", (pineconeErr as any).message);
    }

    // Delete from DB
    await prisma.document.delete({ where: { id } });

    return res.json({ message: "Document deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Delete failed" });
  }
}
