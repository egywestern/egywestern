import { connectDb } from "../../../db";
import { Order } from "../../../db/schema";
import { createOrder } from "../../../lib/orders";
import { sendOrderCancelledEmail } from "../../../lib/orderEmail";

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
  const order = await Order.findOneAndUpdate({ id }, { status }, { new: false }).lean();
  if (!order) return Response.json({ error: "Order not found" }, { status: 404 });
  let emailSent = false;
  let emailError = "";
  if (status === "CANCELLED" && order.status !== "CANCELLED") {
    try {
      await sendOrderCancelledEmail(order as unknown as Record<string, unknown>);
      emailSent = true;
    } catch (error) {
      console.error("Order cancelled, but customer email failed:", error);
      emailError = error instanceof Error ? error.message : "Unknown email error";
    }
  } else if (status === "CANCELLED") {
    emailError = "This order was already cancelled, so no duplicate email was sent.";
  }
  return Response.json({ ok: true, emailSent, emailError });
}
