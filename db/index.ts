import mysql from "mysql2/promise";
import { drizzle, type MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "./schema";

let db: MySql2Database<typeof schema> | undefined;

export function getDb() {
  if (db) return db;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured.");
  const pool = mysql.createPool({ uri: url, timezone: "Z" });
  pool.on("connection", (connection) => {
    connection.query("SET time_zone = '+00:00'");
  });
  db = drizzle(pool, { schema, mode: "default" });
  return db;
}
