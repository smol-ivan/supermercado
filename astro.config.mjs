// @ts-check
import { defineConfig } from 'astro/config'

import tailwindcss from '@tailwindcss/vite'

import db from '@astrojs/db';

import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',

  vite: {
    plugins: [tailwindcss()]
  },

  integrations: [db()],
  adapter: vercel(),
})