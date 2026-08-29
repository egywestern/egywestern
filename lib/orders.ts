import { connectDb } from "../db";
import { nextId, Order, Product, ProductVariant } from "../db/schema";
import { sendNewOrderEmail } from "./orderEmail";

export class OutOfStockError extends Error {}

const exactText = (value: string) => new RegExp(
  `^${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
  "i",
);

type OrderResult = { order: Record<string, unknown> } | { error: string; status: number };

export async function createOrder(body: Record<string, unknown>): Promise<OrderResult> {
  const email = String(body.email || "").trim();
  const firstName = String(body.firstName || "").trim();
  const phone = String(body.phone || "").trim();
  const items = Array.isArray(body.items)
    ? (body.items as { id?: number; name?: string; color?: string; size?: string; qty?: number }[]) : [];
  if (!email || !firstName || !phone || !items.length)
    return { error: "Missing required order fields", status: 400 };

  const requestedByProduct = new Map<number, number>();
  const requestedByVariant = new Map<string, { productId: number; color: string; size: string; qty: number }>();
  for (const item of items) {
    const storefrontId = Number(item.id);
    const productId = storefrontId >= 100000 ? storefrontId % 100000 : storefrontId;
    const qty = Number(item.qty) || 0;
    if (productId <= 0 || qty <= 0) continue;
    requestedByProduct.set(productId, (requestedByProduct.get(productId) || 0) + qty);
    const color = String(item.color || "").trim();
    const size = String(item.size || "").trim();
    const key = `${productId}_${color.toLowerCase()}_${size.toLowerCase()}`;
    requestedByVariant.set(key, {
      productId, color, size, qty: (requestedByVariant.get(key)?.qty || 0) + qty,
    });
  }

  const db = await connectDb();
  const session = await db.startSession();
  try {
    let created: Record<string, unknown> | null = null;
    await session.withTransaction(async () => {
      const productIds = [...requestedByProduct.keys()];
      const productsWithVariants = new Set<number>(await ProductVariant.distinct(
        "productId", { productId: { $in: productIds } }, { session },
      ));
      for (const { productId, color, size, qty } of requestedByVariant.values()) {
        if (!productsWithVariants.has(productId)) continue;
        const variant = await ProductVariant.findOneAndUpdate(
          {
            productId,
            color: exactText(color),
            size: exactText(size),
            stock: { $gte: qty },
          },
          { $inc: { stock: -qty } },
          { new: true, session },
        );
        if (!variant) {
          const [current, product] = await Promise.all([
            ProductVariant.findOne({
              productId,
              color: exactText(color),
              size: exactText(size),
            }).session(session).lean(),
            Product.findOne({ id: productId }).session(session).lean(),
          ]);
          throw new OutOfStockError(current
            ? `Only ${current.stock} left of "${product?.name || "item"}" (${color} / ${size})`
            : "An item in your bag is no longer available");
        }
      }
      for (const [productId, qty] of requestedByProduct) {
        const filter = productsWithVariants.has(productId)
          ? { id: productId } : { id: productId, stock: { $gte: qty } };
        const product = await Product.findOneAndUpdate(
          filter, { $inc: { stock: -qty } }, { new: true, session },
        );
        if (!product && !productsWithVariants.has(productId)) {
          const current = await Product.findOne({ id: productId }).session(session).lean();
          throw new OutOfStockError(current
            ? `Only ${current.stock} left of "${current.name}"`
            : "An item in your bag is no longer available");
        }
      }
      const documents = await Order.create([{
        id: await nextId("orders", session), email, firstName,
        lastName: body.lastName ? String(body.lastName) : null, phone,
        governorate: body.governorate ? String(body.governorate) : null,
        area: body.area ? String(body.area) : null,
        address: body.address ? String(body.address) : null,
        notes: body.notes ? String(body.notes) : null,
        paymentMethod: String(body.paymentMethod || "cod"),
        country: String(body.country || "EGYPT"), items: JSON.stringify(items),
        subtotal: Number(body.subtotal || 0), discount: Number(body.discount || 0),
        delivery: Number(body.delivery || 0), total: Number(body.total || 0),
      }], { session });
      created = documents[0].toJSON() as Record<string, unknown>;
    });
    if (!created) throw new Error("Order transaction did not complete");
    try {
      await sendNewOrderEmail(created);
    } catch (emailError) {
      console.error("Order was saved, but its notification email failed:", emailError);
    }
    return { order: created };
  } catch (error) {
    if (error instanceof OutOfStockError) return { error: error.message, status: 409 };
    throw error;
  } finally {
    await session.endSession();
  }
}
