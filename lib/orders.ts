import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";
import { getDb } from "../db";
import { orders, productVariants, products } from "../db/schema";

export class OutOfStockError extends Error {}

export async function createOrder(
  body: Record<string, unknown>,
): Promise<{ order: typeof orders.$inferSelect } | { error: string; status: number }> {
  const email = String(body.email || "").trim();
  const firstName = String(body.firstName || "").trim();
  const phone = String(body.phone || "").trim();
  const items = Array.isArray(body.items)
    ? (body.items as {
        id?: number;
        name?: string;
        color?: string;
        size?: string;
        qty?: number;
      }[])
    : [];
  if (!email || !firstName || !phone || !items.length)
    return { error: "Missing required order fields", status: 400 };
  const requestedByProduct = new Map<number, number>();
  const requestedByVariant = new Map<
    string,
    { productId: number; color: string; size: string; qty: number }
  >();
  for (const item of items) {
    const productId = Number(item.id) - 100000;
    const qty = Number(item.qty) || 0;
    if (productId <= 0 || qty <= 0) continue;
    requestedByProduct.set(
      productId,
      (requestedByProduct.get(productId) || 0) + qty,
    );
    const color = String(item.color || "");
    const size = String(item.size || "");
    const key = `${productId}_${color}_${size}`;
    const existing = requestedByVariant.get(key);
    requestedByVariant.set(key, {
      productId,
      color,
      size,
      qty: (existing?.qty || 0) + qty,
    });
  }
  const db = getDb();
  try {
    const order = await db.transaction(async (tx) => {
      const productsWithVariants = requestedByProduct.size
        ? new Set(
            (
              await tx
                .select({ productId: productVariants.productId })
                .from(productVariants)
                .where(
                  inArray(
                    productVariants.productId,
                    [...requestedByProduct.keys()],
                  ),
                )
            ).map((row) => row.productId),
          )
        : new Set<number>();
      for (const { productId, color, size, qty } of requestedByVariant.values()) {
        if (!productsWithVariants.has(productId)) continue;
        const result = await tx
          .update(productVariants)
          .set({ stock: sql`${productVariants.stock} - ${qty}` })
          .where(
            and(
              eq(productVariants.productId, productId),
              eq(productVariants.color, color),
              eq(productVariants.size, size),
              gte(productVariants.stock, qty),
            ),
          );
        if (result[0].affectedRows === 0) {
          const [row] = await tx
            .select({ stock: productVariants.stock, name: products.name })
            .from(productVariants)
            .innerJoin(products, eq(products.id, productVariants.productId))
            .where(
              and(
                eq(productVariants.productId, productId),
                eq(productVariants.color, color),
                eq(productVariants.size, size),
              ),
            )
            .limit(1);
          throw new OutOfStockError(
            row
              ? `Only ${row.stock} left of "${row.name}" (${color} / ${size})`
              : "An item in your bag is no longer available",
          );
        }
      }
      for (const [productId, qty] of requestedByProduct) {
        const result = await tx
          .update(products)
          .set({ stock: sql`${products.stock} - ${qty}` })
          .where(
            and(
              eq(products.id, productId),
              productsWithVariants.has(productId)
                ? undefined
                : gte(products.stock, qty),
            ),
          );
        if (
          !productsWithVariants.has(productId) &&
          result[0].affectedRows === 0
        ) {
          const [row] = await tx
            .select({ name: products.name, stock: products.stock })
            .from(products)
            .where(eq(products.id, productId))
            .limit(1);
          throw new OutOfStockError(
            row
              ? `Only ${row.stock} left of "${row.name}"`
              : "An item in your bag is no longer available",
          );
        }
      }
      await tx.insert(orders).values({
        email,
        firstName,
        lastName: body.lastName ? String(body.lastName) : null,
        phone,
        governorate: body.governorate ? String(body.governorate) : null,
        area: body.area ? String(body.area) : null,
        address: body.address ? String(body.address) : null,
        notes: body.notes ? String(body.notes) : null,
        paymentMethod: String(body.paymentMethod || "cod"),
        country: String(body.country || "EGYPT"),
        items: JSON.stringify(items),
        subtotal: Number(body.subtotal || 0).toFixed(2),
        discount: Number(body.discount || 0).toFixed(2),
        delivery: Number(body.delivery || 0).toFixed(2),
        total: Number(body.total || 0).toFixed(2),
      });
      const [inserted] = await tx
        .select()
        .from(orders)
        .orderBy(desc(orders.id))
        .limit(1);
      return inserted;
    });
    return { order };
  } catch (err) {
    if (err instanceof OutOfStockError)
      return { error: err.message, status: 409 };
    throw err;
  }
}
