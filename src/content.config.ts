/**
 * Koleksi artikel (src/content/artikel/*.mdx). Artikel dengan draft: true
 * tidak masuk ke daftar, rute, maupun sitemap.
 */
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const artikel = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/artikel' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Judul pendek untuk breadcrumb (opsional). */
      shortTitle: z.string().optional(),
      /** Ringkasan 2 baris untuk kartu dan meta description. */
      description: z.string(),
      category: z.enum(['Menu', 'Tips Buah']),
      date: z.coerce.date(),
      author: z.string(),
      cover: image().optional(),
      coverAlt: z.string().optional(),
      coverCaption: z.string().optional(),
      /** Slug MenuItem dari menu.ts, mis. ['salad-buah', 'sop-buah-kuah-alpukat']. */
      relatedMenu: z.array(z.string()).default([]),
      sources: z.array(z.object({ label: z.string(), url: z.url().optional() })).default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { artikel };
