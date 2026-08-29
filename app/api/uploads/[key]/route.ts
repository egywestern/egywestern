import mongoose from "mongoose";
import { connectDb } from "../../../../db";

export async function GET(
  _request: Request,
  context: { params: Promise<{ key: string }> },
) {
  const { key } = await context.params;
  if (!mongoose.isValidObjectId(key))
    return new Response("Not found", { status: 404 });

  await connectDb();
  const database = mongoose.connection.db;
  if (!database) return new Response("Database unavailable", { status: 503 });
  const bucket = new mongoose.mongo.GridFSBucket(database, { bucketName: "images" });
  const id = new mongoose.Types.ObjectId(key);
  const file = await database.collection("images.files").findOne({ _id: id });
  if (!file) return new Response("Not found", { status: 404 });

  const chunks: Buffer[] = [];
  const stream = bucket.openDownloadStream(id);
  try {
    await new Promise<void>((resolve, reject) => {
      stream.on("data", (chunk: Buffer) => chunks.push(chunk));
      stream.once("end", resolve);
      stream.once("error", reject);
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const body = Buffer.concat(chunks);
  const bytes = body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength) as ArrayBuffer;
  return new Response(bytes, {
    headers: {
      "content-type": String(file.metadata?.contentType || "application/octet-stream"),
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
