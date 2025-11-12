import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
  },
  resolve: {
    alias: {
      '@aivo/ui': path.resolve(__dirname, '../../packages/ui/src/index.ts'),
      '@aivo/types': path.resolve(__dirname, '../../packages/types/src/index.ts'),
      '@aivo/utils': path.resolve(__dirname, '../../packages/utils/src/index.ts'),
      '@aivo/auth': path.resolve(__dirname, '../../packages/auth/dist/index.mjs'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-query': ['@tanstack/react-query'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
})