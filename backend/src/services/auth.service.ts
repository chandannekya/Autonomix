import { User } from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { Request, Response } from "express";

export const authService = async (req: Request, res: Response) => {
  const { googleId, email, name, image } = req.body;
  try {
    const user = await prisma.user.upsert({
      where: { googleId },
      update: { name, image },
      create: { googleId, email, name, image },
    });

    return res.status(200).json({ data: user });
  } catch (error) {
    const err = error as Error;
    return res.status(500).json({ message: err.message });
  }
};
