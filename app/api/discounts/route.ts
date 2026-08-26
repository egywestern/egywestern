import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { discountCodes } from "../../../db/schema";

export async function GET() {
  const rows = await getDb()
    .select()
    .from(discountCodes)
    .orderBy(desc(discountCodes.id));
  return Response.json({ discountCodes: rows });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const code = String(body.code || "").trim().toUpperCase();
  const type = String(body.type || "");
  if (!code || !["percent", "amount", "free_shipping"].includes(type))
    return Response.json(
      { error: "A code and a valid type are required" },
      { status: 400 },
    );
  const db = getDb();
  await db.insert(discountCodes).values({
    code,
    type,
    value: type === "free_shipping" ? null : Number(body.value || 0).toFixed(2),
    active: body.active !== false,
  });
  const [row] = await db
    .select()
    .from(discountCodes)
    .where(eq(discountCodes.code, code))
    .limit(1);
  return Response.json({ discountCode: row }, { status: 201 });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const id = Number(body.id);
  if (!id)
    return Response.json({ error: "Valid id required" }, { status: 400 });
  const db = getDb();
  await db
    .update(discountCodes)
    .set({ active: Boolean(body.active) })
    .where(eq(discountCodes.id, id));
  const [row] = await db
    .select()
    .from(discountCodes)
    .where(eq(discountCodes.id, id))
    .limit(1);
  return Response.json({ discountCode: row });
}

export async function DELETE(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!id)
    return Response.json({ error: "Valid id required" }, { status: 400 });
  await getDb().delete(discountCodes).where(eq(discountCodes.id, id));
  return Response.json({ ok: true });
}
