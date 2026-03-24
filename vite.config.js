import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'static/assets',
    rollupOptions: {
      input: {
        main: './index.html'
      },
      output: {
        // 為 JS 文件添加哈希
        entryFileNames: 'static/assets/js/[name].[hash].js',
        // 為代碼分割的 chunk 添加哈希
        chunkFileNames: 'static/assets/js/[name].[hash].js',
        // 為其他資源（CSS、圖片等）添加哈希
        assetFileNames: (assetInfo) => {
          // 根據文件類型分類到不同目錄
          if (assetInfo.name.endsWith('.css')) {
            return 'static/assets/css/[name].[hash][extname]';
          }
          // 圖片、字體等其他資源
          return 'static/assets/[name].[hash][extname]';
        }
      }
    },
    // 使用 esbuild 壓縮(更快)
    minify: 'esbuild',
    // 保持原始檔案結構
    copyPublicDir: true
  },
  server: {
    port: 3002,
    open: true
  }
});
