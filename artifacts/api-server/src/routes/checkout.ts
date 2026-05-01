import { Router, type IRouter } from "express";
import Stripe from "stripe";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { db, productsTable, ordersTable } from "@workspace/db";
import { CreateCheckoutSessionBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";
import { sendOrderConfirmationEmail } from "../lib/email";

const router: IRouter = Router();

function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2025-04-30.basil" });
}

function getBaseUrl(): string {
  return process.env.REPLIT_DOMAINS
    ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
    : "http://localhost:80";
}

async function fulfillOrder(opts: {
  productId: number;
  productName: string;
  customerEmail: string | null;
  amountPaid: string;
  stripeSessionId: string;
}): Promise<{ orderId: number; downloadToken: string }> {
  const downloadToken = randomBytes(32).toString("hex");

  const [order] = await db
    .insert(ordersTable)
    .values({
      productId: opts.productId,
      productName: opts.productName,
      customerEmail: opts.customerEmail,
      amountPaid: opts.amountPaid,
      status: "completed",
      stripeSessionId: opts.stripeSessionId,
      downloadToken,
    })
    .returning();

  if (opts.customerEmail) {
    const baseUrl = getBaseUrl();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const downloadUrl = `${baseUrl}/download/${order.id}`;

    await sendOrderConfirmationEmail({
      to: opts.customerEmail,
      productName: opts.productName,
      downloadUrl,
      expiresAt,
      orderId: order.id,
    });
  }

  return { orderId: order.id, downloadToken };
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
  const baseUrl = getBaseUrl();

  if (!stripe) {
    // Demo mode — simulate instant payment completion
    const { orderId, downloadToken } = await fulfillOrder({
      productId: product.id,
      productName: product.name,
      customerEmail: parsed.data.customerEmail ?? null,
      amountPaid: product.price,
      stripeSessionId: `demo_${Date.now()}`,
    });

    res.json({
      sessionId: `demo_${orderId}`,
      url: `${baseUrl}/checkout/success?order=${orderId}&token=${downloadToken}`,
    });
    return;
  }

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
      event = JSON.parse((req.body as Buffer).toString()) as Stripe.Event;
    }
  } catch (err) {
    logger.error({ err }, "Webhook signature verification failed");
    res.status(400).json({ error: "Webhook error" });
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Avoid duplicate fulfillment
    const existing = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.stripeSessionId, session.id));

    if (existing.length > 0) {
      res.json({ received: true });
      return;
    }

    const productId = Number(session.metadata?.productId ?? 0);
    const productName = session.metadata?.productName ?? "";
    const amountPaid = String((session.amount_total ?? 0) / 100);

    await fulfillOrder({
      productId,
      productName,
      customerEmail: session.customer_email ?? null,
      amountPaid,
      stripeSessionId: session.id,
    });

    logger.info({ sessionId: session.id }, "Order fulfilled via webhook");
  }

  res.json({ received: true });
});

export default router;
