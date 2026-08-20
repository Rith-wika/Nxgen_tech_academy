import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: true, // Listen on all addresses
    port: 8080,
    strictPort: true, // Force port 8080
    open: true, // Open browser automatically
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 2000,
    // Modern-only baseline (native ES modules, no @vitejs/plugin-legacy in
    // use) - avoids esbuild downleveling syntax/adding polyfills for
    // browsers this site doesn't need to support.
    target: "es2020",
  },
}));
