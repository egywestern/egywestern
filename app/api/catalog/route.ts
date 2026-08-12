import { asc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { categories, collections } from "../../../db/schema";

export async function GET() {
  const db = getDb();
  return Response.json({
    categories: await db
      .select()
      .from(categories)
      .orderBy(asc(categories.name)),
    collections: await db
      .select()
      .from(collections)
      .orderBy(asc(collections.name)),
  });
}
export async function POST(request: Request) {
  const body = (await request.json()) as { type?: string; name?: string };
  const name = body.name?.trim().toUpperCase();
  if (!name || !["category", "collection"].includes(body.type || ""))
    return Response.json(
      { error: "Valid type and name required" },
      { status: 400 },
    );
  const table = body.type === "category" ? categories : collections;
  const db = getDb();
  await db.insert(table).values({ name });
  const [item] = await db
    .select()
    .from(table)
    .orderBy(asc(table.id))
    .then((rows) => rows.slice(-1));
  return Response.json({ item }, { status: 201 });
}
export async function DELETE(request: Request) {
  const url = new URL(request.url),
    id = Number(url.searchParams.get("id")),
    type = url.searchParams.get("type");
  if (!id || !["category", "collection"].includes(type || ""))
    return Response.json(
      { error: "Valid id and type required" },
      { status: 400 },
    );
  if (type === "category")
    await getDb().delete(categories).where(eq(categories.id, id));
  else await getDb().delete(collections).where(eq(collections.id, id));
  return Response.json({ ok: true });
}
