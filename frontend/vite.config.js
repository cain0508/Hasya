import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      // Same path prefix as the production Vercel Edge Function
      // (api/gradio-proxy/[...path].js), so gradioClient.js never needs
      // to branch on environment — dev and prod both hit
      // /api/gradio-proxy/..., just handled by different mechanisms
      // (Vite's proxy here, a serverless function in production).
      '/api/gradio-proxy': {
        target: 'https://cain0508-hasya-scoring.hf.space',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/gradio-proxy/, ''),
        secure: true,
      },
    },
  },
})
