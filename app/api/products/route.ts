import { connectDb } from "../../../db";
import { nextId, Product, ProductColorImage, ProductVariant } from "../../../db/schema";

export async function GET() {
  await connectDb();
  const rows = await Product.find({}, "-_id -__v").sort({ id: -1 }).lean();
  const ids = rows.map((row) => row.id);
  const [variantRows, colorImageRows] = await Promise.all([
    ProductVariant.find({ productId: { $in: ids } }, "-_id -__v").lean(),
    ProductColorImage.find({ productId: { $in: ids } }, "-_id -__v").lean(),
  ]);
  return Response.json({
    products: rows.map((row) => ({
      ...row,
      variants: variantRows.filter((item) => item.productId === row.id),
      colorImages: colorImageRows.filter((item) => item.productId === row.id),
    })),
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  if (!String(body.name || "").trim())
    return Response.json({ error: "Product name is required" }, { status: 400 });
  const variants = Array.isArray(body.variants)
    ? (body.variants as { color: string; size: string; stock: number }[]) : [];
  const colorImages = Array.isArray(body.colorImages)
    ? (body.colorImages as { color: string; image: string }[]).filter((c) => c.color && c.image) : [];
  const stock = variants.length
    ? variants.reduce((sum, variant) => sum + (Number(variant.stock) || 0), 0)
    : Number(body.stock) || 0;
  try {
    await connectDb();
    const id = await nextId("products");
    const product = await Product.create({
      id, name: String(body.name), category: String(body.category),
      collection: String(body.collection || "NEW DROPS"), price: Number(body.price),
      salePrice: body.salePrice ? Number(body.salePrice) : null, stock,
      image: String(body.image || ""), sizes: String(body.sizes || ""),
      colors: String(body.colors || ""), description: String(body.description || ""),
    });
    await Promise.all([
      variants.length
        ? ProductVariant.insertMany(await Promise.all(variants.map(async (variant) => ({
            id: await nextId("productVariants"), productId: id,
            color: String(variant.color), size: String(variant.size), stock: Number(variant.stock) || 0,
          })))) : Promise.resolve(),
      colorImages.length
        ? ProductColorImage.insertMany(await Promise.all(colorImages.map(async (item) => ({
            id: await nextId("productColorImages"), productId: id,
            color: String(item.color), image: String(item.image),
          })))) : Promise.resolve(),
    ]);
    return Response.json({ product: product.toJSON() }, { status: 201 });
  } catch (error) {
    console.error("Product creation failed:", error);
    const message = error instanceof Error && error.name === "ValidationError"
      ? error.message
      : "Product could not be saved to MongoDB Atlas.";
    return Response.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const body = (await request.json()) as Record<string, string | number | null>;
  const id = Number(body.id);
  if (!id) return Response.json({ error: "Valid id required" }, { status: 400 });
  await connectDb();
  const product = await Product.findOneAndUpdate(
    { id },
    {
      name: String(body.name), category: String(body.category), price: Number(body.price),
      salePrice: body.salePrice ? Number(body.salePrice) : null,
      stock: Number(body.stock), colors: String(body.colors || ""),
    },
    { new: true, runValidators: true },
  );
  return Response.json({ product: product?.toJSON() ?? null });
}

export async function DELETE(request: Request) {
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!id) return Response.json({ error: "Valid id required" }, { status: 400 });
  try {
    await connectDb();
    const product = await Product.findOne({ id }).select("id").lean();
    if (!product)
      return Response.json({ error: "Product not found" }, { status: 404 });
    await Promise.all([
      ProductVariant.deleteMany({ productId: id }),
      ProductColorImage.deleteMany({ productId: id }),
      Product.deleteOne({ id }),
    ]);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Product deletion failed:", error);
    return Response.json(
      { error: "Database is unavailable. Check the MongoDB Atlas connection." },
      { status: 503 },
    );
  }
}
