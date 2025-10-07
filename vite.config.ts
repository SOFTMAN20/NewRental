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
          // React core
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react-vendor';
          }
          // React Router
          if (id.includes('node_modules/react-router')) {
            return 'router-vendor';
          }
          // Radix UI components - split into smaller chunks
          if (id.includes('@radix-ui')) {
            return 'radix-vendor';
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
          if (id.includes('i18next') || id.includes('react-i18next')) {
            return 'i18n-vendor';
          }
          // Framer Motion
          if (id.includes('framer-motion')) {
            return 'motion-vendor';
          }
          // Other large dependencies
          if (id.includes('node_modules')) {
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
