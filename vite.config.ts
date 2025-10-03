import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { webExtension } from 'vite-plugin-web-extension'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    webExtension({
      manifest: './manifest.json',
      additionalInputs: ['src/sidebar/sidebar.html']
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        popup: 'src/popup/popup.html',
        options: 'src/options/options.html',
        content: 'src/content/content.ts',
        background: 'src/background/background.ts',
        sidebar: 'src/sidebar/sidebar.html'
      }
    }
  }
})

