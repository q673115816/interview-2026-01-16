import { type SupportedStorage } from "@supabase/supabase-js";
import * as SQLite from "expo-sqlite";

// 使用同步 API 打开数据库，确保在应用启动时立即可用
// 注意：expo-sqlite 的 openDatabaseSync 会自动处理数据库文件的创建
const db = SQLite.openDatabaseSync("auth.db");

// 初始化键值对表
db.execSync(`
  CREATE TABLE IF NOT EXISTS auth_kv (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

/**
 * 基于 SQLite 的 Supabase 存储适配器
 * 使用 expo-sqlite 的同步 API 实现高性能存取
 */
export const SQLiteStorage: SupportedStorage = {
  getItem: (key: string) => {
    try {
      const result = db.getFirstSync<{ value: string }>(
        "SELECT value FROM auth_kv WHERE key = ?",
        [key]
      );
      return result?.value ?? null;
    } catch (error) {
      console.error("[SQLiteStorage] getItem error:", error);
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      db.runSync(
        "INSERT OR REPLACE INTO auth_kv (key, value) VALUES (?, ?)",
        [key, value]
      );
    } catch (error) {
      console.error("[SQLiteStorage] setItem error:", error);
    }
  },
  removeItem: (key: string) => {
    try {
      db.runSync("DELETE FROM auth_kv WHERE key = ?", [key]);
    } catch (error) {
      console.error("[SQLiteStorage] removeItem error:", error);
    }
  },
};
