import mongoose from "mongoose";
import { connectDb } from "../../../db";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File))
      return Response.json({ error: "Image required" }, { status: 400 });
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024)
      return Response.json(
        { error: "JPG, PNG or WebP up to 5 MB only" },
        { status: 400 },
      );

    await connectDb();
    const database = mongoose.connection.db;
    if (!database) throw new Error("MongoDB connection is unavailable");
    const bucket = new mongoose.mongo.GridFSBucket(database, { bucketName: "images" });
    const upload = bucket.openUploadStream(file.name || "image", {
      metadata: { contentType: file.type },
    });
    const buffer = Buffer.from(await file.arrayBuffer());
    await new Promise<void>((resolve, reject) => {
      upload.once("finish", () => resolve());
      upload.once("error", reject);
      upload.end(buffer);
    });

    return Response.json(
      { url: `/api/uploads/${upload.id.toString()}` },
      { status: 201 },
    );
  } catch (error) {
    console.error("Image upload failed:", error);
    return Response.json(
      { error: "Image upload failed. Check the MongoDB Atlas connection." },
      { status: 500 },
    );
  }
}
