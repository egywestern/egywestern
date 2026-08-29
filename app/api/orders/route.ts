import { connectDb } from "../../../db";
import { Order } from "../../../db/schema";
import { createOrder } from "../../../lib/orders";

const STATUSES = ["PENDING", "CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"];

export async function GET() {
  await connectDb();
  const rows = await Order.find({}, "-_id -__v").sort({ id: -1 }).lean();
  return Response.json({ orders: rows });
}

export async function POST(request: Request) {
  const result = await createOrder((await request.json()) as Record<string, unknown>);
  if ("error" in result)
    return Response.json({ error: result.error }, { status: result.status });
  return Response.json({ order: result.order }, { status: 201 });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as { id?: number; status?: string };
  const id = Number(body.id);
  const status = String(body.status || "").trim().toUpperCase();
  if (!id || !STATUSES.includes(status))
    return Response.json({ error: "Valid id and status required" }, { status: 400 });
  await connectDb();
  await Order.updateOne({ id }, { status });
  return Response.json({ ok: true });
}
