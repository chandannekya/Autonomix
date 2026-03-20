import { prisma } from "../config/prisma.js";
import { Request, Response } from "express";

export const getAgentRunHistory = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      success: false,
      message: "Agent ID is required",
    });
  }

  try {
    const history = await prisma.agentRun.findMany({
      where: { agentId: id },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return res.status(200).json({
      success: true,
      message: "History retrieved successfully",
      data: history,
    });
  } catch (error) {
    console.error("Error fetching agent history:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
