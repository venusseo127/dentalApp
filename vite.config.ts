import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// Properly get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist/public"),
      emptyOutDir: true,
      sourcemap: mode === "development",
      minify: mode === "production",
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
      watch: {
        // optional: increase watch options if needed
        usePolling: true,
        interval: 100,
      },
      strictPort: true,
      port: 3000,
    },
    // You can add environment specific options here
    ...(mode === "production" && {
      // Example: disable hmr, enable specific optimizations, etc
      server: {
        hmr: false,
      },
    }),
  };
});
