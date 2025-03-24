// @ts-check
import { defineConfig } from "astro/config"

import react from "@astrojs/react"

import node from "@astrojs/node"

import icon from "astro-icon"

import tailwindcss from "@tailwindcss/vite"

// https://astro.build/config
export default defineConfig({
    output: "server",

    devToolbar: {
        enabled: false,
    },

    integrations: [
        react(),
        icon({
            include: {
                mdi: ["discord-solid", "github-solid"],
                uis: ["*"],
            },
        }),
    ],

    adapter: node({
        mode: "standalone",
    }),

    vite: {
        plugins: [tailwindcss()],
    },
})
