import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
  },
  resolve: {
    alias: {
      '@aivo/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@aivo/types': path.resolve(__dirname, '../../packages/types/src'),
      '@aivo/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@aivo/auth': path.resolve(__dirname, '../../packages/auth/src'),
    },
  },
  optimizeDeps: {
    include: ['lucide-react', 'framer-motion'],
  },
})