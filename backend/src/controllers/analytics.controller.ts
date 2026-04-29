import { Request, Response } from "express";
import { getAnalyticsService } from "../services/analytics.service.js";


export const getAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const analytics = await getAnalyticsService(userId);
    res.json(analytics);
  } catch (error) {
    console.error("[Analytics Controller Error]", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};
