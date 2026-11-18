// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // TODO: replace with the production domain once confirmed (used for sitemap + canonical URLs).
  site: 'https://www.bluebridgedevelopment.com',
  // Static by default: every page is prerendered unless it opts out with
  // `export const prerender = false`. The Vercel adapter handles any opt-outs and Actions.
  output: 'static',
  adapter: vercel(),
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
