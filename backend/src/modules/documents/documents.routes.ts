import { Router } from "express";
import multer from "multer";
import {
  uploadDocument,
  getDocuments,
  deleteDocument,
  uploadUrl,
} from "./documents.controller";
import { authMiddleware } from "../../middlewares/auth";

const storage = multer.memoryStorage(); // store in memory, upload to Cloudinary
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf" || file.originalname.toLowerCase().endsWith(".pdf")) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

const router = Router();

router.post("/", authMiddleware, upload.single("file"), uploadDocument);
router.post("/url", authMiddleware, uploadUrl);
router.get("/", authMiddleware, getDocuments);
router.delete("/:id", authMiddleware, deleteDocument);

export default router;
