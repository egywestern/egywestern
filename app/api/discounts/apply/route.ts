import { eq, sql } from "drizzle-orm";
import { getDb } from "../../../../db";
import { discountCodes } from "../../../../db/schema";

export async function POST(request: Request) {
  const body = (await request.json()) as { code?: string };
  const code = String(body.code || "").trim().toUpperCase();
  if (!code)
    return Response.json({ valid: false, error: "Code required" }, { status: 400 });
  const db = getDb();
  const [row] = await db
    .select()
    .from(discountCodes)
    .where(eq(discountCodes.code, code))
    .limit(1);
  if (!row || !row.active)
    return Response.json({ valid: false, error: "Invalid discount code" }, { status: 404 });
  await db
    .update(discountCodes)
    .set({ uses: sql`${discountCodes.uses} + 1` })
    .where(eq(discountCodes.id, row.id));
  return Response.json({
    valid: true,
    type: row.type,
    value: row.value ? Number(row.value) : null,
  });
}
