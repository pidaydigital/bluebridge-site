// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import keystatic from '@keystatic/astro';
import tailwindcss from '@tailwindcss/vite';

// Keystatic's editor (/keystatic) runs locally during `astro dev`. For editing on the live site,
// set PUBLIC_KEYSTATIC_STORAGE=github in Vercel (see KEYSTATIC.md); otherwise production builds leave the
// editor out entirely, so the public site stays fully static with no React.
const isDev = process.argv.includes('dev');
const withKeystatic = isDev || process.env.PUBLIC_KEYSTATIC_STORAGE === 'github';

export default defineConfig({
  // TODO: replace with the production domain once confirmed (used for sitemap + canonical URLs).
  site: 'https://www.bluebridgedevelopment.com',
  // Static by default: every page is prerendered unless it opts out with
  // `export const prerender = false`. The Vercel adapter handles any opt-outs, Actions and Keystatic.
  output: 'static',
  adapter: vercel(),
  integrations: [
    // Internal pages are excluded from the sitemap.
    sitemap({ filter: (page) => !/\/(styleguide|sitemap|keystatic)(\/|$)/.test(new URL(page).pathname) }),
    ...(withKeystatic ? [react(), keystatic()] : []),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
