import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/weather-web-app/', // GitHub Pages のリポジトリ名
  plugins: [
    react(),
    tailwindcss(),
  ],
})
