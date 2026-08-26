import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

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
  const uploadDirectory = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(
    path.join(uploadDirectory, key),
    Buffer.from(await file.arrayBuffer()),
  );
  return Response.json(
    { url: `/api/uploads/${encodeURIComponent(key)}` },
    { status: 201 },
  );
}
