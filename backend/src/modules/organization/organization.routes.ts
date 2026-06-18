import { Router } from "express";
import {
  saveApiKey,
  removeApiKey,
  saveCustomization,
  getSettings,
  getWidgetSettings,
} from "./organization.controller";
import { authMiddleware } from "../../middlewares/auth";

import { tenantAuth } from "../../middlewares/tenantAuth";

const router = Router();


router.get("/settings", authMiddleware, getSettings);
router.put("/settings/api-key", authMiddleware, saveApiKey);
router.delete("/settings/api-key", authMiddleware, removeApiKey);
router.put("/settings/customize", authMiddleware, saveCustomization);
router.get("/widget-settings", tenantAuth, getWidgetSettings);

export default router;
