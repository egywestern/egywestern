import { SiteSettings } from "../db/schema";

const escapeHtml = (value: unknown) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

export async function sendNewOrderEmail(order: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;
  const settings = await SiteSettings.findOne({ id: 1 }).select("contactEmail").lean();
  const to = String(settings?.contactEmail ?? "").trim();
  if (!apiKey || !to) {
    console.warn("Order email skipped: RESEND_API_KEY or Support Email is missing.");
    return;
  }
  const items = JSON.parse(String(order.items || "[]")) as Array<Record<string, unknown>>;
  const itemRows = items.map((item) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(item.name)}</td>
      <td style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(item.color)}</td>
      <td style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(item.size)}</td>
      <td style="padding:8px;border-bottom:1px solid #ddd">${escapeHtml(item.qty)}</td>
      <td style="padding:8px;border-bottom:1px solid #ddd">${Number(item.price || 0).toLocaleString("en-US")} EGP</td>
    </tr>`).join("");
  const customerName = `${String(order.firstName || "")} ${String(order.lastName || "")}`.trim();
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "WESTERN Orders <onboarding@resend.dev>",
      to: [to],
      reply_to: String(order.email || ""),
      subject: `New WESTERN order #${order.id} — ${Number(order.total || 0).toLocaleString("en-US")} EGP`,
      html: `
        <h1>New order #${escapeHtml(order.id)}</h1>
        <h2>Customer</h2>
        <p><strong>Name:</strong> ${escapeHtml(customerName)}<br>
        <strong>Email:</strong> ${escapeHtml(order.email)}<br>
        <strong>Phone:</strong> ${escapeHtml(order.phone)}</p>
        <h2>Delivery</h2>
        <p>${escapeHtml(order.governorate)}, ${escapeHtml(order.area)}<br>
        ${escapeHtml(order.address)}<br>
        <strong>Notes:</strong> ${escapeHtml(order.notes || "None")}</p>
        <h2>Products</h2>
        <table style="border-collapse:collapse;width:100%">
          <thead><tr><th>Product</th><th>Color</th><th>Size</th><th>Qty</th><th>Price</th></tr></thead>
          <tbody>${itemRows}</tbody>
        </table>
        <h2>Total: ${Number(order.total || 0).toLocaleString("en-US")} EGP</h2>
        <p>Subtotal: ${Number(order.subtotal || 0).toLocaleString("en-US")} EGP<br>
        Discount: ${Number(order.discount || 0).toLocaleString("en-US")} EGP<br>
        Delivery: ${Number(order.delivery || 0).toLocaleString("en-US")} EGP<br>
        Payment: ${escapeHtml(order.paymentMethod)}</p>`,
    }),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Order email provider rejected the message: ${error}`);
  }
}

export async function sendOrderCancelledEmail(order: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;
  const customerEmail = String(order.email ?? "").trim();
  if (!apiKey || !customerEmail)
    throw new Error("RESEND_API_KEY or the customer email is missing.");
  const items = JSON.parse(String(order.items || "[]")) as Array<Record<string, unknown>>;
  const itemList = items.map((item) =>
    `<li>${escapeHtml(item.name)} — ${escapeHtml(item.color)} / ${escapeHtml(item.size)} — QTY ${escapeHtml(item.qty)}</li>`,
  ).join("");
  const customerName = `${String(order.firstName || "")} ${String(order.lastName || "")}`.trim();
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "WESTERN Orders <onboarding@resend.dev>",
      to: [customerEmail],
      subject: `Your WESTERN order #${order.id} was cancelled`,
      html: `
        <h1>ORDER CANCELLED</h1>
        <p>Hello ${escapeHtml(customerName || "Customer")},</p>
        <p>Your WESTERN order <strong>#${escapeHtml(order.id)}</strong> has been cancelled.</p>
        <ul>${itemList}</ul>
        <p><strong>Order total:</strong> ${Number(order.total || 0).toLocaleString("en-US")} EGP</p>
        <p>If you have any questions, reply to this email and our team will help you.</p>`,
    }),
  });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Cancellation email was rejected: ${error}`);
  }
}
