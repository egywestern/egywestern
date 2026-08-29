import { connectDb } from "../../../../../db";
import { nextId, Product, ProductColorImage, ProductVariant } from "../../../../../db/schema";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const productId = Number((await context.params).id);
  await connectDb();
  const [variants, colorImages] = await Promise.all([
    ProductVariant.find({ productId }, "-_id -__v").lean(),
    ProductColorImage.find({ productId }, "-_id -__v").lean(),
  ]);
  return Response.json({ variants, colorImages });
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const productId = Number((await context.params).id);
  if (!productId)
    return Response.json({ error: "Valid product id required" }, { status: 400 });
  const body = (await request.json()) as {
    variants?: { color: string; size: string; stock: number }[];
    colorImages?: { color: string; image: string }[];
  };
  const variants = Array.isArray(body.variants) ? body.variants : [];
  const colorImages = (Array.isArray(body.colorImages) ? body.colorImages : [])
    .filter((item) => item.color && item.image);
  const stock = variants.reduce((sum, variant) => sum + (Number(variant.stock) || 0), 0);
  const colors = [...new Set(variants.map((variant) => String(variant.color).trim()).filter(Boolean))];
  const sizes = [...new Set(variants.map((variant) => String(variant.size).trim()).filter(Boolean))];
  await connectDb();
  await Promise.all([
    ProductVariant.deleteMany({ productId }),
    ProductColorImage.deleteMany({ productId }),
  ]);
  await Promise.all([
    variants.length
      ? ProductVariant.insertMany(await Promise.all(variants.map(async (variant) => ({
          id: await nextId("productVariants"), productId,
          color: String(variant.color), size: String(variant.size), stock: Number(variant.stock) || 0,
        })))) : Promise.resolve(),
    colorImages.length
      ? ProductColorImage.insertMany(await Promise.all(colorImages.map(async (item) => ({
          id: await nextId("productColorImages"), productId,
          color: String(item.color), image: String(item.image),
        })))) : Promise.resolve(),
    Product.updateOne(
      { id: productId },
      { stock, colors: colors.join(","), sizes: sizes.join(",") },
    ),
  ]);
  const [variantRows, colorImageRows] = await Promise.all([
    ProductVariant.find({ productId }, "-_id -__v").lean(),
    ProductColorImage.find({ productId }, "-_id -__v").lean(),
  ]);
  return Response.json({ variants: variantRows, colorImages: colorImageRows, stock });
}
