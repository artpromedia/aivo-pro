import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
  },
  resolve: {
    alias: {
      '@aivo/ui': '../../packages/ui/src/index.ts',
      '@aivo/types': '../../packages/types/src/index.ts',
      '@aivo/utils': '../../packages/utils/src/index.ts',
      '@aivo/auth': '../../packages/auth/src/index.ts',
    },
  },
})