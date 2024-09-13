import react from '@vitejs/plugin-react';
import pages from 'vite-plugin-pages';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  plugins: [
    react(),
    pages({
      dirs: 'src/client/pages',
      exclude: ['**/*.module.scss.d.ts'],
      importMode: 'async',
    }),
    tsconfigPaths(),
  ],
  server: {
    host: '0.0.0.0',
    origin: process.env.FRONTEND_URL,
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: 'src/client/index.tsx',
    },
  },
});
