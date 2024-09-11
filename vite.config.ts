import react from '@vitejs/plugin-react';
import pages from 'vite-plugin-pages';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

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
    origin: 'http://localhost:5173',
  },
  build: {
    manifest: true,
    rollupOptions: {
      input: 'src/client/index.tsx',
    },
  },
});
