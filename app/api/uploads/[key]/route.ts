import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string }> },
) {
  const { key } = await context.params;
  const safeKey = path.basename(decodeURIComponent(key));
  const filePath = path.join(process.cwd(), "public", "uploads", safeKey);
  let body: Buffer;
  try {
    body = await readFile(filePath);
  } catch {
    return new Response("Not found", { status: 404 });
  }
  const extension = path.extname(safeKey).toLowerCase();
  const contentType =
    extension === ".png"
      ? "image/png"
      : extension === ".webp"
        ? "image/webp"
        : extension === ".gif"
          ? "image/gif"
          : "image/jpeg";
  const headers = new Headers({ "content-type": contentType });
  headers.set("cache-control", "public, max-age=31536000, immutable");
  const bytes = body.buffer.slice(
    body.byteOffset,
    body.byteOffset + body.byteLength,
  ) as ArrayBuffer;
  return new Response(bytes, { headers });
}
