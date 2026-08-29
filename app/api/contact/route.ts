import { connectDb } from "../../../db";
import { SiteSettings } from "../../../db/schema";

const escapeHtml = (value: string) => value
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const fullName = String(body.fullName ?? "").trim();
    const email = String(body.email ?? "").trim();
    const subject = String(body.subject ?? "").trim();
    const message = String(body.message ?? "").trim();
    if (!fullName || !email || !subject || !message)
      return Response.json({ error: "Please complete all required fields." }, { status: 400 });
    if (!/^\S+@\S+\.\S+$/.test(email))
      return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
    if (fullName.length > 120 || subject.length > 120 || message.length > 5000)
      return Response.json({ error: "Your message is too long." }, { status: 400 });

    await connectDb();
    const settings = await SiteSettings.findOne({ id: 1 }).select("contactEmail").lean();
    const contactEmail = String(settings?.contactEmail ?? "").trim();
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL || "WESTERN Contact <onboarding@resend.dev>";
    if (!contactEmail)
      return Response.json({ error: "The store contact email is not configured yet." }, { status: 503 });
    if (!apiKey)
      return Response.json({ error: "Email delivery is not configured yet." }, { status: 503 });

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [contactEmail],
        reply_to: email,
        subject: `[WESTERN CONTACT] ${subject}`,
        html: `<h2>New contact message</h2><p><strong>Name:</strong> ${escapeHtml(fullName)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Subject:</strong> ${escapeHtml(subject)}</p><p>${escapeHtml(message).replaceAll("\n", "<br>")}</p>`,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("Contact email provider error:", data);
      return Response.json({ error: "Email delivery failed. Please try again." }, { status: 502 });
    }
    return Response.json({ sent: true });
  } catch (error) {
    console.error("Contact form failed:", error);
    return Response.json({ error: "Message could not be sent." }, { status: 500 });
  }
}
