import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [react(), nodePolyfills({
            include: ['util']
        })],
        base: process.env.NODE_ENV === "dev" ? "/" : "/graviola/"
    }
})
