import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// base: './' برای کار درست روی هر زیرمسیری که GitHub Pages اپ رو سرو می‌کنه
// دو ورودی جدا: index.html (مینی‌اپ) و admin/index.html (پنل ادمین) —
// هیچ‌کدوم از روتینگ مبتنی بر # استفاده نمی‌کنن تا با initData تلگرام تصادم نکنن.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html'),
      },
    },
  },
})
