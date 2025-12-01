import react from '@vitejs/plugin-react'
import path from 'node:path'
import url from 'node:url'
import { defineConfig } from 'vite'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  root: 'src',
  envDir: '..',
  publicDir: '../public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    minify: 'esbuild',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material', '@mui/x-date-pickers', '@emotion/react', '@emotion/styled'],
          'supertokens-vendor': ['supertokens-auth-react'],
          'utils-vendor': ['@tanstack/react-query', 'dayjs', 'zod', 'react-hook-form', '@hookform/resolvers']
        }
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true
  }
})
