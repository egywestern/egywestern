import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { products } from "../../../db/schema";

export async function GET() {
  const rows = await getDb().select().from(products).orderBy(desc(products.id));
  return Response.json({ products: rows });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, string | number>;
  if (!String(body.name || "").trim())
    return Response.json(
      { error: "Product name is required" },
      { status: 400 },
    );
  const db = getDb();
  await db.insert(products).values({
    name: String(body.name),
    category: String(body.category),
    collection: String(body.collection || "NEW DROPS"),
    price: Number(body.price),
    salePrice: body.salePrice ? Number(body.salePrice) : null,
    stock: Number(body.stock),
    image: String(body.image || ""),
    sizes: String(body.sizes || ""),
    colors: String(body.colors || ""),
    description: String(body.description || ""),
  });
  const [product] = await db
    .select()
    .from(products)
    .orderBy(desc(products.id))
    .limit(1);
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
      price: Number(body.price),
      salePrice: body.salePrice ? Number(body.salePrice) : null,
      stock: Number(body.stock),
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
  await getDb().delete(products).where(eq(products.id, id));
  return Response.json({ ok: true });
}
