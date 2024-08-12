import type { Config } from 'drizzle-kit';

// export default {
//   schema: "./src/api/schema.ts",
//   out: "./drizzle/migrations/",
// 	dialect: "sqlite",
// 	driver: "turso",
// 	dbCredentials: {
//     url: process.env.DATABASE_URL!,
//     authToken: process.env.DATABASE_AUTH_TOKEN,
// 	},
// } satisfies Config;

export default {
  schema: "./src/api/schema.ts",
  out: "./drizzle/migrations/",
	dialect: "sqlite",
  dbCredentials: {
    url: "./drizzle/sqlite.db",
  }
} satisfies Config;
