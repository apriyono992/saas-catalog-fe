import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.VITE_DEV_API_TARGET || 'http://localhost:3000'

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      proxy: {
        // /store and /cms are also used as frontend shell-switch paths (see shell-resolver.ts),
        // so browser page navigations (Accept: text/html) bypass the proxy and let Vite serve
        // the SPA instead — only actual API calls from the app get forwarded to the backend.
        '/store': {
          target: apiTarget,
          bypass(req) {
            if (req.headers.accept?.includes('html')) return '/index.html'
          },
        },
        '/cms': {
          target: apiTarget,
          bypass(req) {
            if (req.headers.accept?.includes('html')) return '/index.html'
          },
        },
        '/health': apiTarget,
        '/uploads': apiTarget,
      },
    },
  }
})
