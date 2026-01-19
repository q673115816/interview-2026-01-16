import { sqliteTable, text } from "drizzle-orm/sqlite-core";

// 定义 Auth 键值对表（用于替代原先手写的 SQL 表）
export const authKv = sqliteTable("auth_kv", {
  key: text("key").primaryKey(),
  value: text("value"),
});
