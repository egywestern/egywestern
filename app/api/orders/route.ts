import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { orders } from "../../../db/schema";
import { createOrder } from "../../../lib/orders";

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

export async function GET() {
  const rows = await getDb().select().from(orders).orderBy(desc(orders.id));
  return Response.json({ orders: rows });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const result = await createOrder(body);
  if ("error" in result)
    return Response.json({ error: result.error }, { status: result.status });
  return Response.json({ order: result.order }, { status: 201 });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as { id?: number; status?: string };
  const id = Number(body.id);
  const status = String(body.status || "").trim().toUpperCase();
  if (!id || !STATUSES.includes(status))
    return Response.json(
      { error: "Valid id and status required" },
      { status: 400 },
    );
  await getDb().update(orders).set({ status }).where(eq(orders.id, id));
  return Response.json({ ok: true });
}
