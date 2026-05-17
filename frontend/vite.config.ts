/**
 * Vite dev/build config.
 * `/api/*` requests are proxied to the local backend (default :8787) so the
 * browser can call them with same-origin fetches and the OpenAI key never
 * leaves the server.
 */
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
});
