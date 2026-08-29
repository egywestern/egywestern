import mongoose, { type ClientSession, Schema } from "mongoose";

const cleanJson = {
  versionKey: false,
  transform: (_doc: unknown, value: Record<string, unknown>) => {
    delete value._id;
    return value;
  },
};

const counterSchema = new Schema(
  { _id: { type: String, required: true }, sequence: { type: Number, default: 0 } },
  { versionKey: false },
);

export const Counter =
  mongoose.models.Counter || mongoose.model("Counter", counterSchema);

export async function nextId(name: string, session?: ClientSession) {
  const counter = await Counter.findByIdAndUpdate(
    name,
    { $inc: { sequence: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true, session },
  );
  return counter.sequence as number;
}

const namedSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, unique: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false }, toJSON: cleanJson, suppressReservedKeysWarning: true },
);

export const Category =
  mongoose.models.Category || mongoose.model("Category", namedSchema);
export const Collection =
  mongoose.models.Collection || mongoose.model("Collection", namedSchema);

const productSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    collection: { type: String, required: true, default: "NEW DROPS" },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, default: null, min: 0 },
    stock: { type: Number, required: true, default: 0, min: 0 },
    image: { type: String, required: true },
    sizes: { type: String, default: "" },
    colors: { type: String, default: "" },
    description: { type: String, default: "" },
  },
  { timestamps: { createdAt: true, updatedAt: false }, toJSON: cleanJson, suppressReservedKeysWarning: true },
);

export const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

const variantSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    productId: { type: Number, required: true, index: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
  },
  { versionKey: false, toJSON: cleanJson },
);
variantSchema.index({ productId: 1, color: 1, size: 1 }, { unique: true });

export const ProductVariant =
  mongoose.models.ProductVariant || mongoose.model("ProductVariant", variantSchema);

const colorImageSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    productId: { type: Number, required: true, index: true },
    color: { type: String, required: true },
    image: { type: String, required: true },
  },
  { versionKey: false, toJSON: cleanJson },
);

export const ProductColorImage =
  mongoose.models.ProductColorImage ||
  mongoose.model("ProductColorImage", colorImageSchema);

const settingsSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, default: 1 },
    heroImage: { type: String, default: "" },
    campaignImage: { type: String, default: "" },
    storyImage: { type: String, default: "" },
    aboutImage: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    tiktokUrl: { type: String, default: "" },
    facebookUrl: { type: String, default: "" },
    whatsappNumber: { type: String, default: "" },
    storeLocation: { type: String, default: "" },
    contactEmail: { type: String, default: "" },
    ticker: { type: [String], default: [] },
    marquee: { type: String, default: "" },
    eyebrow: { type: String, default: "" },
    headline: { type: String, default: "" },
    deliveryFee: { type: Number, default: 0, min: 0 },
    freeDeliveryFrom: { type: Number, default: 0, min: 0 },
    sizeGuide: {
      type: [{
        _id: false,
        size: { type: String, default: "" },
        chest: { type: String, default: "" },
        length: { type: String, default: "" },
        shoulder: { type: String, default: "" },
      }],
      default: [],
    },
    sizeGuideNote: { type: String, default: "" },
  },
  { timestamps: { createdAt: false, updatedAt: true }, toJSON: cleanJson },
);

export const SiteSettings =
  mongoose.models.SiteSettings || mongoose.model("SiteSettings", settingsSchema);

const discountSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, required: true, enum: ["percent", "amount", "free_shipping"] },
    value: { type: Number, default: null, min: 0 },
    active: { type: Boolean, required: true, default: true },
    uses: { type: Number, required: true, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false }, toJSON: cleanJson },
);

export const DiscountCode =
  mongoose.models.DiscountCode || mongoose.model("DiscountCode", discountSchema);

const pendingPaymentSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    payload: { type: String, required: true },
    status: { type: String, required: true, default: "PENDING" },
    paymobOrderId: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false }, toJSON: cleanJson },
);

export const PendingPayment =
  mongoose.models.PendingPayment ||
  mongoose.model("PendingPayment", pendingPaymentSchema);

const orderSchema = new Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    email: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, default: null },
    phone: { type: String, required: true },
    governorate: { type: String, default: null },
    area: { type: String, default: null },
    address: { type: String, default: null },
    notes: { type: String, default: null },
    paymentMethod: { type: String, required: true },
    country: { type: String, required: true },
    items: { type: String, required: true },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, required: true, default: 0, min: 0 },
    delivery: { type: Number, required: true, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: { type: String, required: true, default: "PENDING" },
  },
  { timestamps: { createdAt: true, updatedAt: false }, toJSON: cleanJson },
);

export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
