import { desc, eq, inArray } from "drizzle-orm";
import { getDb } from "../../../db";
import { productColorImages, productVariants, products } from "../../../db/schema";

export async function GET() {
  const db = getDb();
  const rows = await db.select().from(products).orderBy(desc(products.id));
  const ids = rows.map((row) => row.id);
  const variantRows = ids.length
    ? await db
        .select()
        .from(productVariants)
        .where(inArray(productVariants.productId, ids))
    : [];
  const colorImageRows = ids.length
    ? await db
        .select()
        .from(productColorImages)
        .where(inArray(productColorImages.productId, ids))
    : [];
  const variantsByProduct = new Map<number, typeof variantRows>();
  for (const variant of variantRows) {
    const list = variantsByProduct.get(variant.productId) || [];
    list.push(variant);
    variantsByProduct.set(variant.productId, list);
  }
  const colorImagesByProduct = new Map<number, typeof colorImageRows>();
  for (const row of colorImageRows) {
    const list = colorImagesByProduct.get(row.productId) || [];
    list.push(row);
    colorImagesByProduct.set(row.productId, list);
  }
  return Response.json({
    products: rows.map((row) => ({
      ...row,
      variants: variantsByProduct.get(row.id) || [],
      colorImages: colorImagesByProduct.get(row.id) || [],
    })),
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  if (!String(body.name || "").trim())
    return Response.json(
      { error: "Product name is required" },
      { status: 400 },
    );
  const variants = Array.isArray(body.variants)
    ? (body.variants as { color: string; size: string; stock: number }[])
    : [];
  const colorImages = Array.isArray(body.colorImages)
    ? (body.colorImages as { color: string; image: string }[]).filter(
        (c) => c.color && c.image,
      )
    : [];
  const stock = variants.length
    ? variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0)
    : Number(body.stock);
  const db = getDb();
  const product = await db.transaction(async (tx) => {
    await tx.insert(products).values({
      name: String(body.name),
      category: String(body.category),
      collection: String(body.collection || "NEW DROPS"),
      price: Number(body.price).toFixed(2),
      salePrice: body.salePrice ? Number(body.salePrice).toFixed(2) : null,
      stock,
      image: String(body.image || ""),
      sizes: String(body.sizes || ""),
      colors: String(body.colors || ""),
      description: String(body.description || ""),
    });
    const [inserted] = await tx
      .select()
      .from(products)
      .orderBy(desc(products.id))
      .limit(1);
    if (variants.length) {
      await tx.insert(productVariants).values(
        variants.map((v) => ({
          productId: inserted.id,
          color: String(v.color),
          size: String(v.size),
          stock: Number(v.stock) || 0,
        })),
      );
    }
    if (colorImages.length) {
      await tx.insert(productColorImages).values(
        colorImages.map((c) => ({
          productId: inserted.id,
          color: String(c.color),
          image: String(c.image),
        })),
      );
    }
    return inserted;
  });
  return Response.json({ product }, { status: 201 });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as Record<string, string | number | null>;
  const id = Number(body.id);
  if (!id)
    return Response.json({ error: "Valid id required" }, { status: 400 });
  await getDb()
    .update(products)
    .set({
      name: String(body.name),
      category: String(body.category),
      price: Number(body.price).toFixed(2),
      salePrice: body.salePrice ? Number(body.salePrice).toFixed(2) : null,
      stock: Number(body.stock),
      colors: String(body.colors || ""),
    })
    .where(eq(products.id, id));
  const [product] = await getDb()
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return Response.json({ product });
}

export async function DELETE(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!id)
    return Response.json({ error: "Valid id required" }, { status: 400 });
  const db = getDb();
  await db.delete(productVariants).where(eq(productVariants.productId, id));
  await db.delete(productColorImages).where(eq(productColorImages.productId, id));
  await db.delete(products).where(eq(products.id, id));
  return Response.json({ ok: true });
}
