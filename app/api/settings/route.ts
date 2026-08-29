import { connectDb } from "../../../db";
import { SiteSettings } from "../../../db/schema";

export async function GET() {
  await connectDb();
  const row = await SiteSettings.findOne({ id: 1 });
  return Response.json({ settings: row?.toJSON() ?? null });
}

const FIELDS = [
  "heroImage", "campaignImage", "storyImage", "aboutImage", "instagramUrl",
  "tiktokUrl", "facebookUrl", "whatsappNumber", "storeLocation", "marquee",
  "eyebrow", "headline",
] as const;

export async function PUT(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  await connectDb();
  const existing = await SiteSettings.findOne({ id: 1 }).lean();
  const values: Record<string, unknown> = Object.fromEntries(
    FIELDS.map((field) => [
      field,
      field in body ? String(body[field] ?? "") : String(existing?.[field] ?? ""),
    ]),
  );
  if ("ticker" in body) {
    values.ticker = Array.isArray(body.ticker)
      ? body.ticker.slice(0, 3).map((message) => String(message))
      : [];
  } else {
    values.ticker = existing?.ticker ?? [];
  }
  for (const field of ["deliveryFee", "freeDeliveryFrom"] as const) {
    const incoming = Number(body[field]);
    values[field] = field in body && Number.isFinite(incoming) && incoming >= 0
      ? incoming
      : Number(existing?.[field] ?? 0);
  }
  const row = await SiteSettings.findOneAndUpdate(
    { id: 1 }, { $set: values, $setOnInsert: { id: 1 } },
    { new: true, upsert: true, runValidators: true },
  );
  return Response.json({ settings: row.toJSON() });
}
