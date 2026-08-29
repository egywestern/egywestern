import { connectDb } from "../../../db";
import { SiteSettings } from "../../../db/schema";

export async function GET() {
  await connectDb();
  const row = await SiteSettings.findOne({ id: 1 });
  return Response.json({ settings: row?.toJSON() ?? null });
}

const FIELDS = [
  "heroImage", "campaignImage", "storyImage", "aboutImage", "instagramUrl",
  "tiktokUrl", "facebookUrl", "whatsappNumber", "storeLocation",
] as const;

export async function PUT(request: Request) {
  const body = (await request.json()) as Record<string, string>;
  await connectDb();
  const existing = await SiteSettings.findOne({ id: 1 }).lean();
  const values = Object.fromEntries(FIELDS.map((field) => [
    field, field in body ? String(body[field] || "") : String(existing?.[field] || ""),
  ]));
  const row = await SiteSettings.findOneAndUpdate(
    { id: 1 }, { $set: values, $setOnInsert: { id: 1 } },
    { new: true, upsert: true, runValidators: true },
  );
  return Response.json({ settings: row.toJSON() });
}
