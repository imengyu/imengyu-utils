import { defineConfig } from 'vite';
import babel from 'vite-plugin-babel';
import path from 'path';
import dts from 'vite-plugin-dts';

// 微信小程序专用构建配置，输出 ES5 + CommonJS
// 入口为 src/index.mp.ts，移除了依赖 window/document 的模块
export default defineConfig({
  plugins: [
    babel({
      enforce: 'post',
      include: /\.[jt]sx?$/,
      babelConfig: {
        babelrc: false,
        configFile: false,
        presets: [
          ['@babel/preset-env', {
            targets: { ie: '11' },
            modules: false,
            useBuiltIns: false,
          }]
        ],
        plugins: [
          ['@babel/plugin-transform-runtime', {
            corejs: false,
            regenerator: true,
          }]
        ]
      }
    }),
    dts()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  build: {
    target: 'esnext',
    lib: {
      entry: path.resolve(__dirname, 'src/index.mp.ts'),
      formats: ['cjs'],
      name: 'imengyu-utils',
      fileName: () => `index.js`,
    },
    rollupOptions: {
      external: ['vue', '@imengyu/js-request-transform', /^@babel\/runtime\//],
      output: {
        generatedCode: 'es5',
      },
    },
    outDir: 'dist/mp',
    emptyOutDir: true,
    minify: false,
    sourcemap: false
  }
});
