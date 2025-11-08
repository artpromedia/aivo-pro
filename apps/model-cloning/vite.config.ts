import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react() as any],
  server: {
    port: 5182,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@aivo/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
      '@aivo/types': path.resolve(__dirname, '../../packages/types/src/index.ts'),
      '@aivo/utils': path.resolve(__dirname, '../../packages/utils/src/index.ts'),
    },
  },
})
