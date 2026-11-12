// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { satteri } from '@astrojs/markdown-satteri';
import { wikiLinks } from './src/lib/wikilinks.mjs';

// The canonical URL of the deployed site. Used for RSS, sitemap and
// <link rel="canonical">. Override at build time with SITE_URL=...
const site = process.env.SITE_URL ?? 'https://my-website-gilt-one-47.vercel.app';

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  markdown: {
    // Astro 7's native Markdown processor; [[wikilinks]] are our own plugin.
    processor: satteri({ mdastPlugins: [wikiLinks] }),
    shikiConfig: {
      themes: { light: 'everforest-light', dark: 'everforest-dark' },
      defaultColor: false,
      wrap: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
