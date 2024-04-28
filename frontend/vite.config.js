import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(() => {
    return {
        plugins: [react()],
        base: process.env.NODE_ENV === "dev" ? "/" : "/graviola/",
    }
})
