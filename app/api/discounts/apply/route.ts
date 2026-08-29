import { connectDb } from "../../../../db";
import { DiscountCode } from "../../../../db/schema";

export async function POST(request: Request) {
  const body = (await request.json()) as { code?: string };
  const code = String(body.code || "").trim().toUpperCase();
  if (!code)
    return Response.json({ valid: false, error: "Code required" }, { status: 400 });
  await connectDb();
  const row = await DiscountCode.findOneAndUpdate(
    { code, active: true }, { $inc: { uses: 1 } }, { new: true },
  ).lean();
  if (!row)
    return Response.json({ valid: false, error: "Invalid discount code" }, { status: 404 });
  return Response.json({
    valid: true, type: row.type, value: row.value == null ? null : Number(row.value),
  });
}
