import { pgTable, serial, integer, text, numeric, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable(
  "orders",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id").notNull(),
    productName: text("product_name").notNull(),
    customerEmail: text("customer_email"),
    amountPaid: numeric("amount_paid", { precision: 10, scale: 2 }).notNull(),
    status: text("status").notNull().default("pending"),
    stripeSessionId: text("stripe_session_id"),
    downloadToken: text("download_token"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("orders_stripe_session_id_idx")
      .on(table.stripeSessionId)
      .where(sql`${table.stripeSessionId} IS NOT NULL`),
  ],
);

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
