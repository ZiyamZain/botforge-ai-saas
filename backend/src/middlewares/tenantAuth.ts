import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/db";

export async function tenantAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey) return res.status(401).json({ error: "API key required" });

  const org = await prisma.organization.findUnique({ where: { apiKey } });
  if (!org) return res.status(401).json({ error: "Invalid API key" });

  req.org = org;
  next();
}
