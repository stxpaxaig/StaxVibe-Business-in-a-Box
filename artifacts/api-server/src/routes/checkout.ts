import { Router, type IRouter } from "express";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { db, productsTable, ordersTable } from "@workspace/db";
import { CreateCheckoutSessionBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2025-04-30.basil" });
}

router.post("/checkout/create-session", async (req, res): Promise<void> => {
  const parsed = CreateCheckoutSessionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, parsed.data.productId));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const stripe = getStripe();

  if (!stripe) {
    // Demo mode: simulate a checkout session without Stripe
    const downloadToken = randomBytes(32).toString("hex");
    const [order] = await db
      .insert(ordersTable)
      .values({
        productId: product.id,
        productName: product.name,
        customerEmail: parsed.data.customerEmail ?? null,
        amountPaid: product.price,
        status: "completed",
        stripeSessionId: `demo_${Date.now()}`,
        downloadToken,
      })
      .returning();

    const baseUrl = process.env.REPLIT_DOMAINS
      ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
      : "http://localhost:80";

    res.json({
      sessionId: `demo_${order.id}`,
      url: `${baseUrl}/checkout/success?order=${order.id}&token=${downloadToken}`,
    });
    return;
  }

  const baseUrl = process.env.REPLIT_DOMAINS
    ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
    : "http://localhost:80";

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: Math.round(parseFloat(product.price) * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: parsed.data.customerEmail ?? undefined,
    success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/checkout/cancel`,
    metadata: {
      productId: String(product.id),
      productName: product.name,
    },
  });

  logger.info({ sessionId: session.id, productId: product.id }, "Checkout session created");

  res.json({ sessionId: session.id, url: session.url ?? "" });
});

router.post("/webhook/stripe", async (req, res): Promise<void> => {
  const stripe = getStripe();
  if (!stripe) {
    res.json({ received: true });
    return;
  }

  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body as Buffer, sig, webhookSecret);
    } else {
      event = JSON.parse(req.body as string) as Stripe.Event;
    }
  } catch (err) {
    logger.error({ err }, "Webhook signature verification failed");
    res.status(400).json({ error: "Webhook error" });
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const productId = Number(session.metadata?.productId ?? 0);
    const productName = session.metadata?.productName ?? "";
    const amountPaid = String((session.amount_total ?? 0) / 100);
    const downloadToken = randomBytes(32).toString("hex");

    await db.insert(ordersTable).values({
      productId,
      productName,
      customerEmail: session.customer_email ?? null,
      amountPaid,
      status: "completed",
      stripeSessionId: session.id,
      downloadToken,
    });

    logger.info({ sessionId: session.id }, "Order created from webhook");
  }

  res.json({ received: true });
});

export default router;
