import { Router, type IRouter } from "express";
import { desc, sql } from "drizzle-orm";
import { db, ordersTable } from "@workspace/db";
import { adminLimiter } from "../lib/rate-limit";

const router: IRouter = Router();
router.use("/admin", adminLimiter);

router.get("/admin/stats", async (_req, res): Promise<void> => {
  const totalResult = await db
    .select({
      totalRevenue: sql<number>`coalesce(sum(cast(amount_paid as numeric)), 0)`,
      totalOrders: sql<number>`cast(count(*) as int)`,
      avgOrderValue: sql<number>`coalesce(avg(cast(amount_paid as numeric)), 0)`,
    })
    .from(ordersTable)
    .where(sql`status = 'completed'`);

  const totalProducts = await db
    .select({ count: sql<number>`cast(count(*) as int)` })
    .from(sql`products`);

  const topProductsRaw = await db
    .select({
      productId: ordersTable.productId,
      productName: ordersTable.productName,
      revenue: sql<number>`cast(sum(cast(amount_paid as numeric)) as float)`,
      orders: sql<number>`cast(count(*) as int)`,
    })
    .from(ordersTable)
    .where(sql`status = 'completed'`)
    .groupBy(ordersTable.productId, ordersTable.productName)
    .orderBy(desc(sql`sum(cast(amount_paid as numeric))`))
    .limit(5);

  const stats = totalResult[0];

  res.json({
    totalRevenue: Number(stats?.totalRevenue ?? 0),
    totalOrders: Number(stats?.totalOrders ?? 0),
    totalProducts: Number(totalProducts[0]?.count ?? 0),
    avgOrderValue: Number(stats?.avgOrderValue ?? 0),
    topProducts: topProductsRaw.map((p) => ({
      id: p.productId,
      name: p.productName,
      revenue: Number(p.revenue),
      orders: Number(p.orders),
    })),
  });
});

router.get("/admin/revenue-chart", async (_req, res): Promise<void> => {
  const rows = await db
    .select({
      date: sql<string>`to_char(date_trunc('day', created_at), 'YYYY-MM-DD')`,
      revenue: sql<number>`cast(sum(cast(amount_paid as numeric)) as float)`,
      orders: sql<number>`cast(count(*) as int)`,
    })
    .from(ordersTable)
    .where(sql`status = 'completed' and created_at >= now() - interval '30 days'`)
    .groupBy(sql`date_trunc('day', created_at)`)
    .orderBy(sql`date_trunc('day', created_at)`);

  res.json(
    rows.map((r) => ({
      date: r.date,
      revenue: Number(r.revenue),
      orders: Number(r.orders),
    }))
  );
});

export default router;
