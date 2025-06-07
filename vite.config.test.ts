import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// E2Eテスト専用のVite設定
export default defineConfig({
  base: process.env.BASE_URL || '/international-school-english/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: parseInt(process.env.VITE_TEST_PORT || '4173'),
    strictPort: true, // テスト環境では厳密にポートを指定
    open: false, // ブラウザを自動で開かない
    hmr: false, // ホットモジュールリロードを無効化
  },
  preview: {
    port: parseInt(process.env.VITE_TEST_PORT || '4173'),
    strictPort: true,
    open: false,
  },
  build: {
    target: 'es2020',
    outDir: 'dist-test', // テスト用の別ディレクトリ
    assetsDir: 'assets',
    sourcemap: false, // テスト環境ではソースマップ不要
  },
  // テスト環境用の最適化
  optimizeDeps: {
    force: true, // 依存関係を強制的に最適化
  },
});
