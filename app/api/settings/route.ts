import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { siteSettings } from "../../../db/schema";

export async function GET() {
  const [row] = await getDb()
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, 1))
    .limit(1);
  return Response.json({ settings: row ?? null });
}

const FIELDS = [
  "heroImage",
  "campaignImage",
  "storyImage",
  "aboutImage",
  "instagramUrl",
  "tiktokUrl",
  "facebookUrl",
  "whatsappNumber",
] as const;

export async function PUT(request: Request) {
  const body = (await request.json()) as Record<string, string>;
  const db = getDb();
  const [existing] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, 1))
    .limit(1);
  const values = Object.fromEntries(
    FIELDS.map((field) => [
      field,
      field in body ? String(body[field] || "") : existing?.[field] || "",
    ]),
  ) as Record<(typeof FIELDS)[number], string>;
  await db
    .insert(siteSettings)
    .values({ id: 1, ...values })
    .onDuplicateKeyUpdate({ set: values });
  const [row] = await db
    .select()
    .from(siteSettings)
    .where(eq(siteSettings.id, 1))
    .limit(1);
  return Response.json({ settings: row });
}
