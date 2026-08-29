import { connectDb } from "../../../db";
import { DiscountCode, nextId } from "../../../db/schema";

export async function GET() {
  await connectDb();
  const rows = await DiscountCode.find({}, "-_id -__v").sort({ id: -1 }).lean();
  return Response.json({ discountCodes: rows });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const code = String(body.code || "").trim().toUpperCase();
  const type = String(body.type || "");
  if (!code || !["percent", "amount", "free_shipping"].includes(type))
    return Response.json({ error: "A code and a valid type are required" }, { status: 400 });
  await connectDb();
  const row = await DiscountCode.create({
    id: await nextId("discountCodes"), code, type,
    value: type === "free_shipping" ? null : Number(body.value || 0),
    active: body.active !== false,
  });
  return Response.json({ discountCode: row.toJSON() }, { status: 201 });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const id = Number(body.id);
  if (!id) return Response.json({ error: "Valid id required" }, { status: 400 });
  await connectDb();
  const row = await DiscountCode.findOneAndUpdate(
    { id }, { active: Boolean(body.active) }, { new: true },
  );
  return Response.json({ discountCode: row?.toJSON() ?? null });
}

export async function DELETE(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!id) return Response.json({ error: "Valid id required" }, { status: 400 });
  await connectDb();
  await DiscountCode.deleteOne({ id });
  return Response.json({ ok: true });
}
