import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/code-cinema/',
  server: {
    host: 'localhost',
    port: 5173,
  },
});
