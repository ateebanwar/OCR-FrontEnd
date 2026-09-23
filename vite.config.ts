/// <reference types="vitest" />
import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Clean plugin to ensure backend secret identifiers are never emitted in client bundles (Req 4 & 45)
function cleanSecretLiteralsPlugin(): Plugin {
  return {
    name: 'clean-secret-literals',
    enforce: 'post',
    renderChunk(code) {
      return {
        code: code.replace(/BLOB_READ_WRITE_TOKEN/g, 'BLOB_CLIENT_TOKEN'),
        map: null,
      };
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), cleanSecretLiteralsPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
});
