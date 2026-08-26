import { eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { productColorImages, productVariants, products } from "../../../../../db/schema";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const productId = Number(id);
  const db = getDb();
  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, productId));
  const colorImages = await db
    .select()
    .from(productColorImages)
    .where(eq(productColorImages.productId, productId));
  return Response.json({ variants, colorImages });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const productId = Number(id);
  if (!productId)
    return Response.json({ error: "Valid product id required" }, { status: 400 });
  const body = (await request.json()) as {
    variants?: { color: string; size: string; stock: number }[];
    colorImages?: { color: string; image: string }[];
  };
  const variants = Array.isArray(body.variants) ? body.variants : [];
  const colorImages = (
    Array.isArray(body.colorImages) ? body.colorImages : []
  ).filter((c) => c.color && c.image);
  const stock = variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
  const db = getDb();
  await db.transaction(async (tx) => {
    await tx
      .delete(productVariants)
      .where(eq(productVariants.productId, productId));
    if (variants.length) {
      await tx.insert(productVariants).values(
        variants.map((v) => ({
          productId,
          color: String(v.color),
          size: String(v.size),
          stock: Number(v.stock) || 0,
        })),
      );
    }
    await tx
      .delete(productColorImages)
      .where(eq(productColorImages.productId, productId));
    if (colorImages.length) {
      await tx.insert(productColorImages).values(
        colorImages.map((c) => ({
          productId,
          color: String(c.color),
          image: String(c.image),
        })),
      );
    }
    await tx.update(products).set({ stock }).where(eq(products.id, productId));
  });
  const variantRows = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, productId));
  const colorImageRows = await db
    .select()
    .from(productColorImages)
    .where(eq(productColorImages.productId, productId));
  return Response.json({ variants: variantRows, colorImages: colorImageRows, stock });
}
