import react from "@vitejs/plugin-react";
import { dirname, resolve } from "path";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";
/// <reference types="vitest" />

const resolvePath = (aPath: string) =>
  resolve(dirname(fileURLToPath(import.meta.url)), aPath);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolvePath("index.html"),
        ["quick-edit"]: resolvePath("quick-edit/index.html"),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    exclude: ['**/e2e/**', '**/playwright-report/**', '**/test-results/**', '**/node_modules/**'],
  },
});
