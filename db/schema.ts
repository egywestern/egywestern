import {
  boolean,
  decimal,
  int,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
});

export const collections = mysqlTable("collections", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
});

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  collection: varchar("collection", { length: 255 }).notNull().default("NEW DROPS"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  salePrice: decimal("sale_price", { precision: 10, scale: 2 }),
  stock: int("stock").notNull().default(0),
  image: text("image").notNull(),
  sizes: text("sizes").notNull(),
  colors: text("colors").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
});

export const productVariants = mysqlTable("product_variants", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("product_id").notNull(),
  color: varchar("color", { length: 50 }).notNull(),
  size: varchar("size", { length: 20 }).notNull(),
  stock: int("stock").notNull().default(0),
});

export const productColorImages = mysqlTable("product_color_images", {
  id: int("id").autoincrement().primaryKey(),
  productId: int("product_id").notNull(),
  color: varchar("color", { length: 50 }).notNull(),
  image: text("image").notNull(),
});

export const siteSettings = mysqlTable("site_settings", {
  id: int("id").primaryKey().default(1),
  heroImage: text("hero_image").notNull(),
  campaignImage: text("campaign_image").notNull(),
  storyImage: text("story_image").notNull(),
  aboutImage: text("about_image").notNull(),
  instagramUrl: varchar("instagram_url", { length: 255 }).notNull().default(""),
  tiktokUrl: varchar("tiktok_url", { length: 255 }).notNull().default(""),
  facebookUrl: varchar("facebook_url", { length: 255 }).notNull().default(""),
  whatsappNumber: varchar("whatsapp_number", { length: 50 }).notNull().default(""),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

export const discountCodes = mysqlTable("discount_codes", {
  id: int("id").autoincrement().primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  type: varchar("type", { length: 20 }).notNull(),
  value: decimal("value", { precision: 10, scale: 2 }),
  active: boolean("active").notNull().default(true),
  uses: int("uses").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const pendingPayments = mysqlTable("pending_payments", {
  id: int("id").autoincrement().primaryKey(),
  payload: text("payload").notNull(),
  status: varchar("status", { length: 20 }).notNull().default("PENDING"),
  paymobOrderId: varchar("paymob_order_id", { length: 50 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 255 }).notNull(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }),
  phone: varchar("phone", { length: 50 }).notNull(),
  governorate: varchar("governorate", { length: 100 }),
  area: varchar("area", { length: 255 }),
  address: text("address"),
  notes: text("notes"),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  items: text("items").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).notNull().default("0"),
  delivery: decimal("delivery", { precision: 10, scale: 2 }).notNull().default("0"),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("PENDING"),
  createdAt: timestamp("created_at")
    .notNull()
    .defaultNow(),
});
