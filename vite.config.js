import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',  // Usar 'dist' para compatibilidade com Netlify
    assetsDir: 'assets',
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',  // Escutar em todos os endereços de rede
    port: 5173,        // Porta padrão
    strictPort: false, // Tentar outra porta se 5173 estiver ocupada
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      }
    }
  }
})