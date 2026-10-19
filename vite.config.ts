import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Served from https://abigailsadom1903.github.io/Abigail-digital-portfolio/
  // Must match the GitHub repository name exactly (case-sensitive).
  base: '/Abigail-digital-portfolio/',
})
