import { put } from "@vercel/blob";

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        { error: "Image required" },
        { status: 400 },
      );
    }

    if (
      !file.type.startsWith("image/") ||
      file.size > 5 * 1024 * 1024
    ) {
      return Response.json(
        { error: "JPG, PNG or WebP up to 5 MB only" },
        { status: 400 },
      );
    }

    const ext =
      file.name
        .split(".")
        .pop()
        ?.replace(/[^a-z0-9]/gi, "") || "jpg";

    const key = `uploads/${crypto.randomUUID()}.${ext}`;

    const blob = await put(key, file, {
      access: "public",
      token: process.env.IMAGES_READ_WRITE_TOKEN,
    });

    return Response.json(
      { url: blob.url },
      { status: 201 },
    );
  } catch (error) {
    console.error("Image upload failed:", error);

    return Response.json(
      { error: "Image upload failed" },
      { status: 500 },
    );
  }
}