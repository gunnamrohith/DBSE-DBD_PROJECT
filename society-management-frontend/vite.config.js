import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  root: 'frontend',
  envDir: '..',
  plugins: [react()],
  build: { outDir: '../dist', emptyOutDir: true },
})
