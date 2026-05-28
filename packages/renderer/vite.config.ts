import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ReleaseAnnouncements',
      fileName: (format) => `release-announcements.${format}.js`,
      formats: ['es', 'umd'],
    },
    rollupOptions: {
      external: ['vue', 'pinia'],
      output: {
        globals: { vue: 'Vue', pinia: 'Pinia' },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@release-hub/shared': resolve(__dirname, '../shared/src/types.ts'),
    },
  },
})
