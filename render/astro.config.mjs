// @ts-check
import { defineConfig } from "astro/config"

import tailwind from "@astrojs/tailwind";

import react from "@astrojs/react";

import node from "@astrojs/node";

import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  output: "hybrid",
  integrations: [tailwind(), react(), icon({
    include: {
      mdi: ['discord-solid', 'github-solid'],
      uis: ['*'],
    }
  })],

  adapter: node({
    mode: "standalone",
  }),
})