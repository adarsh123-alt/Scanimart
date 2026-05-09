import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  base: './', // 👈 important for Render static hosting
  preview: {
    port: 10000,
    host: '0.0.0.0',
  },
});
