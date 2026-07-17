import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import vitePrerender from 'vite-plugin-prerender'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vitePrerender({
      staticDir: path.join(__dirname, 'dist'),
      routes: ['/'],
      minify: {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        keepClosingSlash: true,
        decodeEntities: true,
        sortAttributes: true,
      },
    }),
  ],
})
