// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { site } from './src/data/site.ts';

export default defineConfig({
  site: site.url,
  output: 'static',
  integrations: [mdx(), sitemap()],
  build: {
    inlineStylesheets: 'always',
  },
});
