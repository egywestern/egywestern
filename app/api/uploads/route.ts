import { env } from "cloudflare:workers";

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File))
    return Response.json({ error: "Image required" }, { status: 400 });
  if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024)
    return Response.json(
      { error: "JPG, PNG or WebP up to 5 MB only" },
      { status: 400 },
    );
  const ext =
    file.name
      .split(".")
      .pop()
      ?.replace(/[^a-z0-9]/gi, "") || "jpg";
  const key = `${crypto.randomUUID()}.${ext}`;
  await env.MEDIA.put(key, file.stream(), {
    httpMetadata: { contentType: file.type },
  });
  return Response.json(
    { url: `/api/uploads/${encodeURIComponent(key)}` },
    { status: 201 },
  );
}
