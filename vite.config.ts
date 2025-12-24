import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      strictPort: false, // Allow fallback to next available port if 3000 is busy
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      // Removed GEMINI_API_KEY injection for security - private keys should not be exposed to client bundle
      // Only VITE_ prefixed environment variables should be used in client-side code
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            animations: ['framer-motion'],
            icons: ['lucide-react'],
          }
        }
      }
    }
  };
});
