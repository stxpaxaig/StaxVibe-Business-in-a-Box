import { Router, type IRouter } from "express";
import { db, productsTable } from "@workspace/db";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Financial Infographic Packs": "RSI, MACD, VWAP-focused infographic bundles for traders",
  "AI Prompt Libraries": "Master prompt collections for generating finance content at scale",
  "Faceless Video Assets": "B-roll, overlays, and motion graphics for crypto & stock content",
  "Notion Trading Dashboards": "Premium Notion templates for tracking trades and portfolio",
};

router.get("/categories", async (_req, res): Promise<void> => {
  const rows = await db
    .select({ category: productsTable.category, count: sql<number>`cast(count(*) as int)` })
    .from(productsTable)
    .groupBy(productsTable.category);

  const categories = rows.map((r) => ({
    name: r.category,
    count: r.count,
    description: CATEGORY_DESCRIPTIONS[r.category] ?? `${r.category} products`,
  }));

  res.json(categories);
});

export default router;
