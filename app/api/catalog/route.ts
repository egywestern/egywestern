import { connectDb } from "../../../db";
import { Category, Collection, nextId } from "../../../db/schema";

const modelFor = (type: string | null | undefined) =>
  type === "category" ? Category : type === "collection" ? Collection : null;

export async function GET() {
  await connectDb();
  const [categories, collections] = await Promise.all([
    Category.find({}, "-_id -__v").sort({ name: 1 }).lean(),
    Collection.find({}, "-_id -__v").sort({ name: 1 }).lean(),
  ]);
  return Response.json({ categories, collections });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { type?: string; name?: string };
  const name = body.name?.trim().toUpperCase();
  const Model = modelFor(body.type);
  if (!name || !Model)
    return Response.json({ error: "Valid type and name required" }, { status: 400 });
  await connectDb();
  const item = await Model.create({ id: await nextId(`${body.type}s`), name });
  return Response.json({ item: item.toJSON() }, { status: 201 });
}

export async function PUT(request: Request) {
  const body = (await request.json()) as { type?: string; id?: number; name?: string };
  const id = Number(body.id);
  const name = body.name?.trim().toUpperCase();
  const Model = modelFor(body.type);
  if (!id || !name || !Model)
    return Response.json({ error: "Valid type, id and name required" }, { status: 400 });
  await connectDb();
  const item = await Model.findOneAndUpdate({ id }, { name }, { new: true });
  return Response.json({ item: item?.toJSON() ?? null });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = Number(url.searchParams.get("id"));
  const Model = modelFor(url.searchParams.get("type"));
  if (!id || !Model)
    return Response.json({ error: "Valid id and type required" }, { status: 400 });
  await connectDb();
  await Model.deleteOne({ id });
  return Response.json({ ok: true });
}
