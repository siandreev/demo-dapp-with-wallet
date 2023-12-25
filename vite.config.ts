import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import inject from "@rollup/plugin-inject";

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'docs',
    rollupOptions: {
      plugins: [inject({ Buffer: ['Buffer', 'Buffer'] })]
    },
  },
  // @ts-ignore
  base: process.env.GH_PAGES ? '/demo-dapp-with-wallet/' : './',
  server: {
    fs: {
      allow: ['../sdk', './'],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true
        })
      ]
    }
  }
})
