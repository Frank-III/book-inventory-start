// import { drizzle } from 'drizzle-orm/libsql';
// import { createClient } from '@libsql/client';
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";

// const client = createClient({ url: process.env.DATABASE_URL!, authToken: process.env.DATABASE_AUTH_TOKEN });
const client = Database("./sqlite.db");
export const db = drizzle(client, { schema, logger: true });

console.log("DB initialized");
