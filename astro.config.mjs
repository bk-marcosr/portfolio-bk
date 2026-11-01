// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Deploy targets:
 * - Vercel (recommended): defaults below, served at the domain root.
 * - GitHub Pages: the workflow sets SITE_URL=https://bk-marcosr.github.io and BASE_PATH=/portfolio-bk.
 */
const site = process.env.SITE_URL ?? 'https://bk-marcosr.github.io';
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
