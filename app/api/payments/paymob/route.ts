import { connectDb } from "../../../../db";
import { nextId, PendingPayment } from "../../../../db/schema";
import { countryCode } from "../../../../lib/paymob";

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const email = String(body.email || "").trim();
  const firstName = String(body.firstName || "").trim();
  const phone = String(body.phone || "").trim();
  const total = Number(body.total || 0);
  if (!email || !firstName || !phone || total <= 0)
    return Response.json(
      { error: "Missing required order fields" },
      { status: 400 },
    );

  const apiKey = process.env.PAYMOB_API_KEY;
  const integrationId = process.env.PAYMOB_INTEGRATION_ID;
  const iframeId = process.env.PAYMOB_IFRAME_ID;
  if (!apiKey || !integrationId || !iframeId)
    return Response.json(
      { error: "Payment provider is not configured" },
      { status: 500 },
    );

  await connectDb();
  const pending = await PendingPayment.create({
    id: await nextId("pendingPayments"),
    payload: JSON.stringify(body),
    status: "PENDING",
  });
  const amountCents = Math.round(total * 100);
  const merchantOrderId = `WESTERN-${pending.id}`;

  try {
    const authResponse = await fetch(
      "https://accept.paymob.com/api/auth/tokens",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ api_key: apiKey }),
      },
    );
    const authData = await authResponse.json();
    const authToken = authData.token;
    if (!authToken) throw new Error("Paymob auth failed");

    const orderResponse = await fetch(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          auth_token: authToken,
          delivery_needed: false,
          amount_cents: amountCents,
          currency: "EGP",
          merchant_order_id: merchantOrderId,
          items: [],
        }),
      },
    );
    const orderData = await orderResponse.json();
    const paymobOrderId = orderData.id;
    if (!paymobOrderId) throw new Error("Paymob order registration failed");

    await PendingPayment.updateOne(
      { id: pending.id }, { paymobOrderId: String(paymobOrderId) },
    );

    const [first, ...rest] = firstName.split(" ");
    const lastName = String(body.lastName || rest.join(" ") || "NA");
    const billingData = {
      apartment: "NA",
      email,
      floor: "NA",
      first_name: first || "NA",
      street: String(body.address || "NA"),
      building: "NA",
      phone_number: phone,
      shipping_method: "NA",
      postal_code: "NA",
      city: String(body.area || body.governorate || "NA"),
      country: countryCode(String(body.country || "EGYPT")),
      last_name: lastName,
      state: "NA",
    };

    const paymentKeyResponse = await fetch(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          auth_token: authToken,
          amount_cents: amountCents,
          expiration: 3600,
          order_id: paymobOrderId,
          billing_data: billingData,
          currency: "EGP",
          integration_id: Number(integrationId),
        }),
      },
    );
    const paymentKeyData = await paymentKeyResponse.json();
    const paymentToken = paymentKeyData.token;
    if (!paymentToken) throw new Error("Paymob payment key request failed");

    return Response.json({
      iframeUrl: `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}`,
    });
  } catch {
    await PendingPayment.updateOne({ id: pending.id }, { status: "FAILED" });
    return Response.json(
      { error: "Could not start card payment. Please try again." },
      { status: 502 },
    );
  }
}
