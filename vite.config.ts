import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      strictPort: false, // Pake port laen kalo 3000 lagi dipake
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      // GEMINI_API_KEY dihapus demi keamanan - private key gak boleh bocor ke client
      // Cuma variabel dot-env yang depannya VITE_ yang boleh dipake di kode client
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      // Chunk size warning at 250KB (Core Web Vitals optimization)
      chunkSizeWarningLimit: 250,
      // Use esbuild (Vite default) with console/debugger removal
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            animations: ['framer-motion', 'gsap'],
            icons: ['lucide-react'],
            supabase: ['@supabase/supabase-js'],
            ui: ['clsx', 'tailwind-merge'],
          }
        }
      }
    }
  };
});
