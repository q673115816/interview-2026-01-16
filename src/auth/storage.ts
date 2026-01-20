import { type SupportedStorage } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import migrations from "../../drizzle/migrations";
import { db } from "../db/client";
import { authKv } from "../db/schema";

// 初始化数据库表（简单的自动迁移逻辑）
// 注意：在实际生产中，建议在 _layout.tsx 使用 useMigrations 钩子来更稳健地处理
try {
  migrate(db, migrations);
} catch (e) {
  console.log("Migration error or already applied:", e);
}

/**
 * 基于 Drizzle ORM 的 Supabase 存储适配器
 * 使用 expo-sqlite 的同步 API 实现高性能存取
 */
export const SQLiteStorage: SupportedStorage = {
  getItem: (key: string) => {
    try {
      // Drizzle 在 expo-sqlite (openDatabaseSync) 上支持同步查询
      const result = db
        .select()
        .from(authKv)
        .where(eq(authKv.key, key))
        .get();

      return result?.value ?? null;
    } catch (error) {
      console.error("[SQLiteStorage] getItem error:", error);
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      db.insert(authKv)
        .values({ key, value })
        .onConflictDoUpdate({
          target: authKv.key,
          set: { value },
        })
        .run();
    } catch (error) {
      console.error("[SQLiteStorage] setItem error:", error);
    }
  },
  removeItem: (key: string) => {
    try {
      db.delete(authKv).where(eq(authKv.key, key)).run();
    } catch (error) {
      console.error("[SQLiteStorage] removeItem error:", error);
    }
  },
};
