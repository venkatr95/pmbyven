import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: [
        "src/components/**/*.{ts,tsx}",
        "src/lib/**/*.{ts,tsx}",
        "src/store/**/*.{ts,tsx}",
      ],
      exclude: [
        "src/generated/**",
        "src/test/**",
        "**/*.d.ts",
        "**/node_modules/**",
        "**/*.test.*",
        "**/*.spec.*",
        "src/lib/db.ts",
        "src/lib/actions/**",
        "src/lib/posts.ts",
        "src/components/admin/post-editor.tsx",
        "src/components/layout/**",
        "src/components/providers.tsx",
      ],
      thresholds: {
        lines: 50,
        functions: 45,
        branches: 35,
        statements: 50,
      },
    },
    css: false,
    mockReset: true,
    restoreMocks: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(dirname, "./src"),
    },
  },
});
