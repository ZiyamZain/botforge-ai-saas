import { Request, Response } from "express";
import { prisma } from "../../config/db";
import { encrypt } from "../../utils/crypto";

export async function saveApiKey(req: Request, res: Response) {
  const { geminiApiKey } = req.body;

  if (!geminiApiKey || !geminiApiKey.startsWith("AIza")) {
    return res.status(400).json({ error: "Invalid Gemini API key format" });
  }

  const encrypted = encrypt(geminiApiKey);

  await prisma.organization.update({
    where: { id: req.org!.id },
    data: { geminiApiKey: encrypted, hasOwnKey: true },
  });

  return res.json({ message: "API key saved successfully" });
}

export async function removeApiKey(req: Request, res: Response) {
  await prisma.organization.update({
    where: { id: req.org!.id },
    data: { geminiApiKey: null, hasOwnKey: false },
  });

  return res.json({ message: "API key removed" });
}

export async function saveCustomization(req: Request, res: Response) {
  const { botName, botColor, botGreeting, botInstructions } = req.body;

  if (!botName || !botColor || !botGreeting) {
    return res.status(400).json({ error: "Name, color, and greeting are required" });
  }

  await prisma.organization.update({
    where: { id: req.org!.id },
    data: { botName, botColor, botGreeting, botInstructions },
  });

  return res.json({ message: "Customization saved" });
}

export async function getSettings(req: Request, res: Response) {
  const org = await prisma.organization.findUnique({
    where: { id: req.org!.id },
    select: {
      name: true,
      email: true,
      apiKey: true,
      plan: true,
      hasOwnKey: true,
      botName: true,
      botColor: true,
      botGreeting: true,
      botInstructions: true,
      chatCount: true,
      createdAt: true,
    },
  });

  return res.json(org);
}
export async function getWidgetSettings(req: Request, res: Response) {
  const org = await prisma.organization.findUnique({
    where: { id: req.org!.id },
    select: { botName: true, botColor: true, botGreeting: true },
  });
  return res.json(org);
}