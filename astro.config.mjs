// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// GitHub Pages de proyecto sirve el sitio bajo /<repo>/.
// SITE_BASE permite anular esto (p. ej. dominio propio -> SITE_BASE=/).
const base = process.env.SITE_BASE ?? '/ai-systems-daily';

export default defineConfig({
  site: 'https://pauqbrs.github.io',
  base,
  trailingSlash: 'ignore',
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
