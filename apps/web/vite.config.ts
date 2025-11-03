import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      '@aivo/ui': '../../packages/ui/src',
      '@aivo/types': '../../packages/types/src',
      '@aivo/utils': '../../packages/utils/src',
    },
  },
})