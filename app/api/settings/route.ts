import { connectDb } from "../../../db";
import { SiteSettings } from "../../../db/schema";

export async function GET() {
  await connectDb();
  const row = await SiteSettings.findOne({ id: 1 });
  return Response.json(
    { settings: row?.toJSON() ?? null },
    { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } },
  );
}

const FIELDS = [
  "heroImage", "campaignImage", "storyImage", "aboutImage", "instagramUrl",
  "tiktokUrl", "facebookUrl", "whatsappNumber", "storeLocation", "marquee",
  "eyebrow", "headline", "sizeGuideNote",
] as const;

export async function PUT(request: Request) {
  try {
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
    if ("sizeGuide" in body && Array.isArray(body.sizeGuide)) {
    values.sizeGuide = body.sizeGuide
      .slice(0, 12)
      .map((row) => {
        const item = row && typeof row === "object"
          ? row as Record<string, unknown>
          : {};
        return {
          size: String(item.size ?? "").trim(),
          chest: String(item.chest ?? "").trim(),
          length: String(item.length ?? "").trim(),
          shoulder: String(item.shoulder ?? "").trim(),
        };
      })
      .filter((row) => row.size);
    } else {
      values.sizeGuide = existing?.sizeGuide ?? [];
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
    if (!row) throw new Error("MongoDB did not return the saved settings.");
    return Response.json(
      { settings: row.toJSON() },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate" } },
    );
  } catch (error) {
    console.error("Homepage settings save failed:", error);
    const message = error instanceof Error ? error.message : "Unknown database error";
    return Response.json({ error: message }, { status: 500 });
  }
}
