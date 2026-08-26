import { eq } from "drizzle-orm";
import { getDb } from "../../../../../db";
import { pendingPayments } from "../../../../../db/schema";
import { createOrder } from "../../../../../lib/orders";
import { verifyPaymobHmac } from "../../../../../lib/paymob";

export async function POST(request: Request) {
  const secret = process.env.PAYMOB_HMAC_SECRET;
  if (!secret) return Response.json({ ok: true });

  const url = new URL(request.url);
  const receivedHmac = url.searchParams.get("hmac") || "";
  const body = (await request.json()) as { obj?: Record<string, unknown> };
  const transaction = body.obj;
  if (!transaction) return Response.json({ ok: true });

  if (!verifyPaymobHmac(transaction, receivedHmac, secret)) {
    return Response.json({ ok: true });
  }

  const merchantOrderId = String(
    (transaction.order as Record<string, unknown> | undefined)
      ?.merchant_order_id || "",
  );
  const match = merchantOrderId.match(/^WESTERN-(\d+)$/);
  if (!match) return Response.json({ ok: true });
  const pendingId = Number(match[1]);

  const db = getDb();
  const [pending] = await db
    .select()
    .from(pendingPayments)
    .where(eq(pendingPayments.id, pendingId))
    .limit(1);
  if (!pending || pending.status === "PAID") return Response.json({ ok: true });

  const success = transaction.success === true || transaction.success === "true";
  const pendingFlag = transaction.pending === true || transaction.pending === "true";

  if (!success || pendingFlag) {
    await db
      .update(pendingPayments)
      .set({ status: "FAILED" })
      .where(eq(pendingPayments.id, pendingId));
    return Response.json({ ok: true });
  }

  const payload = JSON.parse(pending.payload);
  const result = await createOrder(payload);
  await db
    .update(pendingPayments)
    .set({
      status: "error" in result
        ? result.status === 409
          ? "PAID_NO_STOCK"
          : "FAILED"
        : "PAID",
    })
    .where(eq(pendingPayments.id, pendingId));

  return Response.json({ ok: true });
}
