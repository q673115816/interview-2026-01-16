import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";

// 打开 SQLite 数据库（同步模式）
const expoDb = openDatabaseSync("db.db");

// 初始化 Drizzle ORM
export const db = drizzle(expoDb);
