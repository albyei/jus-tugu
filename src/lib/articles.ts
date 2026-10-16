/**
 * Bantuan untuk koleksi artikel: daftar terbit, waktu baca, dan slug kategori filter.
 */
import { getCollection, type CollectionEntry } from 'astro:content';

export type Article = CollectionEntry<'artikel'>;
export type ArticleCategory = Article['data']['category'];

/** Artikel non-draft, terbaru lebih dulu. */
export async function getPublishedArticles(): Promise<Article[]> {
  const entries = await getCollection('artikel', ({ data }) => !data.draft);
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Kira-kira 200 kata per menit; import/export dan tag MDX tidak dihitung. */
export function readingMinutes(body = ''): number {
  const text = body
    .replace(/^(import|export) .*$/gm, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_`|[\]()-]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** "Tips Buah" → "tips-buah" (nilai ?kategori= dan data-category). */
export function categorySlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, '-');
}

export function articleUrl(article: Article): string {
  return `/artikel/${article.id}`;
}
