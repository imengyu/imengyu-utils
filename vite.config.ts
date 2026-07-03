/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({ exclude: ['**/__tests__/**'] })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  test: {
    globals: true,
    environment: 'node',
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'umd'],
      name: 'imengyu-utils',
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['vue', '@imengyu/js-request-transform'],
      output: {
        globals: {
          vue: 'Vue',
          '@imengyu/js-request-transform': 'JsRequestTransform'
        }
      }
    },
    sourcemap: false
  }
});