import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in the environment variables.");
}

// Supabase의 경우 서버리스 환경에서 connection pooling을 위해 포트 6543을 사용하거나,
// ENOTFOUND 발생 시 호스트명을 다시 확인해야 합니다.
const connectionString = process.env.DATABASE_URL;

const queryClient = postgres(connectionString, {
  prepare: false,
});

export const db = drizzle(queryClient, { schema });
