import { Router } from "express";
import { chat, getChatHistory } from "./chat.controller";
import { tenantAuth } from "../../middlewares/tenantAuth";
import { authMiddleware } from "../../middlewares/auth";

const router = Router();

// Widget uses apiKey (tenantAuth), dashboard uses JWT (authMiddleware)
router.post("/", tenantAuth, chat);
router.get("/history", authMiddleware, getChatHistory);

export default router;
