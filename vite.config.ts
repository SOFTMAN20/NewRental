 import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize for performance
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Optimized chunking strategy for better code splitting
        manualChunks: (id) => {
          // Keep React and React-DOM together in the main vendor chunk
          // to avoid loading order issues
          if (id.includes('node_modules')) {
            // Group React ecosystem together
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || id.includes('@radix-ui')) {
              return 'vendor';
            }
            // Supabase
            if (id.includes('@supabase')) {
              return 'supabase-vendor';
            }
            // React Query
            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor';
            }
            // Lucide icons
            if (id.includes('lucide-react')) {
              return 'icons-vendor';
            }
            // i18next
            if (id.includes('i18next')) {
              return 'i18n-vendor';
            }
            // Framer Motion
            if (id.includes('framer-motion')) {
              return 'motion-vendor';
            }
            // Other dependencies
            return 'vendor';
          }
        },
      },
    },
    // Increase chunk size warning limit to 1000KB (1MB)
    chunkSizeWarningLimit: 1000,
  },
  // Enable compression
  esbuild: {
    drop: mode === 'production' ? ['console', 'debugger'] : [],
  },
}));
