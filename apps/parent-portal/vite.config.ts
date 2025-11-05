import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
  },
  resolve: {
    alias: {
      '@aivo/ui': '../../packages/ui/src/index.ts',
      '@aivo/types': '../../packages/types/src/index.ts',
      '@aivo/utils': '../../packages/utils/src/index.ts',
      '@aivo/auth': '../../packages/auth/dist/index.js',
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