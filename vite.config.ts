import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: "./",
   build: {
    sourcemap: true,   // ✅ ADD THIS
    minify: false      // ✅ ADD THIS (temporary)
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
     proxy: {
      '/api': {
        target: 'https://finance-vfm-backend.onrender.com/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
