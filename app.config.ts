import { defineConfig } from "@solidjs/start/config";
export default defineConfig({
  vite: {
    ssr: { external: ["drizzle-orm"] },
    resolve: {
      alias: {
        "~/": "./src/*",
        "@/": "./drizzle/*",
      },
    },
  },
  server: {
    // preset: "cloudflare_module",
    // rollupConfig: {
    //   external: ["__STATIC_CONTENT_MANIFEST", "node:async_hooks"],
    // },
  },
});
