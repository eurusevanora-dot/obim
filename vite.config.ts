// @lovable.dev/vite-tanstack-config incluye tanstackStart, viteReact, tailwindcss,
// tsConfigPaths, nitro (cloudflare) y el alias @ — no añadirlos manualmente.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { fileURLToPath } from "node:url";

const srcDir = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  nitro: {
    preset: "cloudflare_module",
    alias: { "@": srcDir },
  } as unknown as { preset: string },
  tanstackStart: {
    server: { entry: "server" },
  },
});
