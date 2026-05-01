import { Router, type IRouter } from "express";
import { eq, desc } from "drizzle-orm";
import { addMinutes } from "date-fns";
import { db, ordersTable } from "@workspace/db";
import { GetDownloadLinkParams } from "@workspace/api-zod";

function addMinutesFallback(date: Date, minutes: number): Date {
  try {
    return addMinutes(date, minutes);
  } catch {
    return new Date(date.getTime() + minutes * 60 * 1000);
  }
}

const router: IRouter = Router();

router.get("/orders", async (_req, res): Promise<void> => {
  const rows = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
  const orders = rows.map((o) => ({
    ...o,
    amountPaid: parseFloat(o.amountPaid),
  }));
  res.json(orders);
});

router.get("/orders/:id/download", async (req, res): Promise<void> => {
  const params = GetDownloadLinkParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, params.data.id));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  if (order.status !== "completed") {
    res.status(403).json({ error: "Order not completed" });
    return;
  }

  const baseUrl = process.env.REPLIT_DOMAINS
    ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
    : "http://localhost:80";

  const expiresAt = addMinutesFallback(new Date(), 60);
  const downloadUrl = `${baseUrl}/api/download/${order.downloadToken}?expires=${expiresAt.getTime()}`;

  res.json({
    url: downloadUrl,
    expiresAt: expiresAt.toISOString(),
    productName: order.productName,
  });
});

export default router;
