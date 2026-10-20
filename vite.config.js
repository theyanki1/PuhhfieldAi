import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { createAlibabaMiddleware } from './server/alibabaMiddleware.js'
import { createOpenAIMiddleware } from './server/openaiMiddleware.js'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the app from /PuhhfieldAi/ (set by the deploy workflow)
  base: process.env.BASE_PATH || '/',
  plugins: [
    tailwindcss(),
    react(),
    {
      name: 'alibaba-modelstudio-proxy',
      configureServer(server) {
        server.middlewares.use(createAlibabaMiddleware());
      }
    },
    {
      name: 'openai-proxy',
      configureServer(server) {
        server.middlewares.use(createOpenAIMiddleware());
      }
    }
  ],
  server: {
    port: 5173,
    host: true
  }
})


