import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, productsTable } from "@workspace/db";
import {
  ListProductsQueryParams,
  CreateProductBody,
  GetProductParams,
  UpdateProductParams,
  UpdateProductBody,
  DeleteProductParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  let query = db.select().from(productsTable).$dynamic();

  if (parsed.data.category) {
    query = query.where(eq(productsTable.category, parsed.data.category));
  }

  const rows = await query.execute();
  const products = rows.map((p) => ({
    ...p,
    price: parseFloat(p.price),
    featured: p.featured ?? false,
  }));
  res.json(products);
});

router.get("/products/featured", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.featured, true))
    .limit(8);
  const products = rows.map((p) => ({
    ...p,
    price: parseFloat(p.price),
    featured: p.featured ?? false,
  }));
  res.json(products);
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, params.data.id));

  if (!row) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json({ ...row, price: parseFloat(row.price), featured: row.featured ?? false });
});

router.post("/products", async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .insert(productsTable)
    .values({
      name: parsed.data.name,
      description: parsed.data.description,
      price: String(parsed.data.price),
      category: parsed.data.category,
      imageUrl: parsed.data.imageUrl ?? null,
      fileUrl: parsed.data.fileUrl ?? null,
      featured: parsed.data.featured ?? false,
      badge: parsed.data.badge ?? null,
    })
    .returning();

  res.status(201).json({ ...row, price: parseFloat(row.price), featured: row.featured ?? false });
});

router.patch("/products/:id", async (req, res): Promise<void> => {
  const params = UpdateProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updateData: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) updateData.name = parsed.data.name;
  if (parsed.data.description !== undefined) updateData.description = parsed.data.description;
  if (parsed.data.price !== undefined) updateData.price = String(parsed.data.price);
  if (parsed.data.category !== undefined) updateData.category = parsed.data.category;
  if (parsed.data.imageUrl !== undefined) updateData.imageUrl = parsed.data.imageUrl;
  if (parsed.data.fileUrl !== undefined) updateData.fileUrl = parsed.data.fileUrl;
  if (parsed.data.featured !== undefined) updateData.featured = parsed.data.featured;
  if (parsed.data.badge !== undefined) updateData.badge = parsed.data.badge;

  const [row] = await db
    .update(productsTable)
    .set(updateData)
    .where(eq(productsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json({ ...row, price: parseFloat(row.price), featured: row.featured ?? false });
});

router.delete("/products/:id", async (req, res): Promise<void> => {
  const params = DeleteProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db
    .delete(productsTable)
    .where(eq(productsTable.id, params.data.id))
    .returning();

  if (!row) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
