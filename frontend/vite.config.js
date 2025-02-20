import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // base: "/smart-source-task/frontend",
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': 'https://smart-source-task.onrender.com'
    },   
    host: true,
    allowedHosts:"smart-source-task-1.onrender.com"
  }
})
