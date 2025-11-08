import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176,
    host: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI libraries
          'ui-libs': ['framer-motion', 'lucide-react'],
          
          // Data visualization (only recharts is direct dependency)
          'charts': ['recharts'],
          
          // State management
          'state': ['@tanstack/react-query'],
          
          // AIVO packages - core
          'aivo-core': ['@aivo/types', '@aivo/utils', '@aivo/ui'],
          
          // AIVO packages - state & errors
          'aivo-state': ['@aivo/state', '@aivo/error-handling'],
          
          // AIVO packages - PWA & performance
          'aivo-pwa': ['@aivo/pwa', '@aivo/performance'],
          
          // AIVO packages - animations
          'aivo-animations': ['@aivo/animations'],
          
          // AIVO packages - collaboration (large - WebRTC, Yjs, Socket.io)
          'aivo-collaboration': ['@aivo/collaboration'],
          
          // AIVO packages - accessibility
          'aivo-accessibility': ['@aivo/accessibility'],
          
          // AIVO packages - visualizations (D3.js heavy)
          'aivo-visualizations': ['@aivo/visualizations'],
          
          // AIVO packages - editor (Lexical heavy)
          'aivo-editor': ['@aivo/editor'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
