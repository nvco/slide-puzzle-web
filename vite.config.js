import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // GitHub Pages deployment configuration
  base: '/slide-puzzle-web/',
  resolve: {
    alias: {
      '@': '/src'
    }
  }
}) 