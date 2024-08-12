import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

console.log(process.env.DB);
export const db = drizzle(process.env.DB, { schema, logger: true });

console.log("DB initialized");
