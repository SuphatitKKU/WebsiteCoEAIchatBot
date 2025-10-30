import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log('🔍 Mode:', mode)
  console.log('🔍 Base URL:', env.VITE_BASE_URL)
  
  return {
    plugins: [react(), tailwindcss()],
    base: env.VITE_BASE_URL || '/'
  }
})