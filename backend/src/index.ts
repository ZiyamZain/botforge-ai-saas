import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import { prisma } from "./config/db";
import authRoutes from "./modules/auth/auth.routes";
import documentRoutes from "./modules/documents/documents.routes";
import chatRoutes from "./modules/chat/chat.routes";

import organizationRoutes from "./modules/organization/organization.routes";

import path from "path";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/organization", organizationRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await prisma.$connect();
  console.log("✅ Database connected");
});
