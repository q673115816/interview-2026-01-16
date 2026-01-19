import { type SupportedStorage } from "@supabase/supabase-js";
import { eq } from "drizzle-orm";
import { db } from "../db/client";
import { authKv } from "../db/schema";
import migrations from "../../drizzle/migrations";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";

// 初始化数据库表（简单的自动迁移逻辑）
// 注意：在实际生产中，建议在 _layout.tsx 使用 useMigrations 钩子来更稳健地处理
try {
  migrate(db, migrations);
} catch (e) {
  console.log("Migration error or already applied:", e);
}

/**
 * 基于 Drizzle ORM 的 Supabase 存储适配器
 */
export const DrizzleStorage: SupportedStorage = {
  getItem: (key: string) => {
    try {
      // Drizzle 的查询目前通常是异步的或者基于 Promise
      // 但 Supabase storage adapter 允许返回 Promise<string | null>
      // 如果必须同步，expo-sqlite + drizzle 也可以支持同步查询（取决于具体配置），
      // 但标准用法推荐异步。Supabase client 会 await getItem。
      
      // 注意：这里为了适配 Supabase 的接口，我们需要用同步方式或者确信 Supabase 支持 await
      // Supabase JS client 的 getItem 是支持返回 Promise 的。
      
      // 使用 expo-sqlite 的同步特性配合 drizzle 可能需要特定配置
      // 这里我们先用最稳妥的方式：直接查询
      
      // 由于 Drizzle 在 expo-sqlite 上默认是同步的 (with openDatabaseSync)，
      // 我们可以直接 select。
      const result = db
        .select()
        .from(authKv)
        .where(eq(authKv.key, key))
        .get(); // .get() 在 expo-sqlite driver 下通常是同步的

      return result?.value ?? null;
    } catch (error) {
      console.error("[DrizzleStorage] getItem error:", error);
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
      console.error("[DrizzleStorage] setItem error:", error);
    }
  },
  removeItem: (key: string) => {
    try {
      db.delete(authKv).where(eq(authKv.key, key)).run();
    } catch (error) {
      console.error("[DrizzleStorage] removeItem error:", error);
    }
  },
};
