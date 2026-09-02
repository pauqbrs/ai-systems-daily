// @ts-check
import { defineConfig } from 'astro/config';

// GitHub Pages de proyecto: https://pauqbrs.github.io/pauqbrs-ai-systems-daily
// OJO: `base` tiene que coincidir con el nombre del repo. Si renombras el repo
// a `ai-systems-daily`, cambia también esta línea o el CSS dejará de cargar.
export default defineConfig({
  site: 'https://pauqbrs.github.io',
  base: '/pauqbrs-ai-systems-daily',
  trailingSlash: 'ignore',
  markdown: {
    shikiConfig: { theme: 'github-dark' },
  },
});
