import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// React SPA. Netlify Functions live in netlify/functions and are served by
// `netlify dev` on the same origin under /.netlify/functions/* (or /api/* via redirect).
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: Number(process.env.PORT) || 5173,
  },
});
