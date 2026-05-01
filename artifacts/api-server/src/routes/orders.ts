import { Router, type IRouter } from "express";
import { eq, desc, ilike } from "drizzle-orm";
import { addMinutes } from "date-fns";
import { db, ordersTable } from "@workspace/db";
import { GetDownloadLinkParams } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

router.get("/orders", async (_req, res): Promise<void> => {
  const rows = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
  const orders = rows.map((o) => ({
    ...o,
    amountPaid: parseFloat(o.amountPaid),
  }));
  res.json(orders);
});

router.get("/orders/by-session/:sessionId", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.sessionId)
    ? req.params.sessionId[0]
    : req.params.sessionId;

  if (!raw) {
    res.status(400).json({ error: "Session ID required" });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.stripeSessionId, raw));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json({ ...order, amountPaid: parseFloat(order.amountPaid) });
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

  const expiresAt = addMinutes(new Date(), 60);
  const downloadUrl = `${baseUrl}/api/download/${order.downloadToken}?expires=${expiresAt.getTime()}`;

  logger.info({ orderId: order.id }, "Download link generated");

  res.json({
    url: downloadUrl,
    expiresAt: expiresAt.toISOString(),
    productName: order.productName,
  });
});

router.post("/orders/lookup-by-email", async (req, res): Promise<void> => {
  const { email } = req.body as { email?: string };

  if (!email || typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "Valid email address required" });
    return;
  }

  const baseUrl = process.env.REPLIT_DOMAINS
    ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
    : "http://localhost:80";

  const rows = await db
    .select()
    .from(ordersTable)
    .where(ilike(ordersTable.customerEmail, email.trim()))
    .orderBy(desc(ordersTable.createdAt));

  const orders = rows
    .filter((o) => o.status === "completed" && o.downloadToken)
    .map((o) => {
      const expiresAt = addMinutes(new Date(), 60);
      const downloadUrl = `${baseUrl}/api/download/${o.downloadToken}?expires=${expiresAt.getTime()}`;
      return {
        id: o.id,
        productName: o.productName,
        amountPaid: parseFloat(o.amountPaid),
        status: o.status,
        createdAt: o.createdAt,
        downloadUrl,
        expiresAt: expiresAt.toISOString(),
      };
    });

  logger.info({ email, count: orders.length }, "Order lookup by email");
  res.json({ orders });
});

export default router;
