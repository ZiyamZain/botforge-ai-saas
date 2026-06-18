import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/db";
import { registerSchema, loginSchema } from "./auth.schema";

export async function register(req: Request, res: Response) {
  try {
    // Validate input
    console.log('hey')
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const { name, email, password } = parsed.data;

    // Check if email already exists
    const existing = await prisma.organization.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log(hashedPassword)

    // Create organization
    const org = await prisma.organization.create({
      data: { name, email, password: hashedPassword },
      select: {
        id: true,
        name: true,
        email: true,
        apiKey: true,
        plan: true,
        createdAt: true,
      },
    });

    // Generate JWT
    const token = jwt.sign({ orgId: org.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.status(201).json({ token, org });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    // Validate input
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.issues[0].message });
    }

    const { email, password } = parsed.data;

    // Find organization
    const org = await prisma.organization.findUnique({ where: { email } });
    if (!org) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, org.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign({ orgId: org.id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    return res.json({
      token,
      org: {
        id: org.id,
        name: org.name,
        email: org.email,
        apiKey: org.apiKey,
        plan: org.plan,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function getMe(req: Request, res: Response) {
  return res.json({
    id: req.org.id,
    name: req.org.name,
    email: req.org.email,
    apiKey: req.org.apiKey,
    plan: req.org.plan,
    hasOwnKey: req.org.hasOwnKey,
    botName: req.org.botName,
    botColor: req.org.botColor,
    botGreeting: req.org.botGreeting,
  });
}
