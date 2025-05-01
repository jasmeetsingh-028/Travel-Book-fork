import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Travel Book',
        short_name: 'TravelBook',
        description: 'Document and share your travel experiences',
        theme_color: '#05B6D3',
        background_color: '#ffffff',
        icons: [
          {
            src: 'src/assets/images/logo.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'src/assets/images/logo.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
})
