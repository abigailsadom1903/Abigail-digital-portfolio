import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // URL path the site is served from. Netlify and local dev serve it at the root ("/").
  // The GitHub Pages workflow sets BASE_PATH=/Abigail-digital-portfolio/ (the repository name).
  base: process.env.BASE_PATH || '/',
})
