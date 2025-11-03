import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5179,
  },
  resolve: {
    alias: {
      '@aivo/ui': '../../packages/ui/src',
      '@aivo/types': '../../packages/types/src',
      '@aivo/utils': '../../packages/utils/src',
    },
  },
})