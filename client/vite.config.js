// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Default Vite port
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your Express.js backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'), // Ensure /api prefix is retained
      },
      '/uploads': {
        target: 'http://localhost:5000', // For serving static uploaded images
        changeOrigin: true,
      },
    },
  },
})