/**
 * Halaman kategori menu (/menu/[slug]). Item, harga, dan jumlah diambil dari
 * categories di menu.ts, tidak disalin; angka di teks dihitung otomatis.
 */
import { categories, type MenuImage, type MenuItem } from './menu';
import { site, isPlaceholder } from './site';
import { formatRupiah } from '../lib/format';
import sopBuahKuahAlpukatImg from '../assets/images/sop-buah-kuah-alpukat.png';
import saladBuahImg from '../assets/images/salad-buah.png';
import jusAlpukatImg from '../assets/images/jus-alpukat.png';
import jusManggaYakultImg from '../assets/images/jus-mangga-yakult.png';

export type CategorySlug = 'sop-buah' | 'salad-buah' | 'jus-buah' | 'jus-yakult';

export interface CategoryPage {
  slug: CategorySlug;
  /** "Sop Buah": breadcrumb, kartu, footer. */
  name: string;
  /** "Sop Buah di Sumberpucung" */
  h1: string;
  /** "Pilihan Sop Buah" */
  ribbonTitle: string;
  intro: string;
  /** "4 pilihan kuah", "27 pilihan jus" */
  infoLabel: (count: number) => string;
  /** Foto kepala halaman. */
  image: MenuImage;
  /** 3 foto "Isi … Kami". */
  detailPhotos: MenuImage[];
  /** "Isi Sop Buah Kami" */
  detailTitle: string;
  detailText: string;
  /** Caption di bawah foto "Isi … Kami" (opsional). */
  detailCaption?: string;
  items: () => MenuItem[];
  /** Untuk jus-buah: Jus Original & Jus Mix, masing-masing dengan pitanya sendiri. */
  groups?: { title: string; items: MenuItem[] }[];
  faq: { q: string; a: string }[];
  /** <title> */
  title: string;
  /** Meta description */
  description: string;
}

function categoryItems(id: string): MenuItem[] {
  const category = categories.find((c) => c.id === id);
  if (!category) throw new Error(`Kategori tidak ditemukan: ${id}`);
  return category.items;
}

const lowest = (items: MenuItem[]) => Math.min(...items.map((item) => item.price));
const lowestText = (items: MenuItem[]) => formatRupiah(lowest(items));

const sopBuahItems = () => categoryItems('sop-salad-buah').filter((item) => item.name.startsWith('Sop Buah'));
const saladBuahItems = () => categoryItems('sop-salad-buah').filter((item) => item.name === 'Salad Buah');
const jusOriginalItems = categoryItems('jus-original');
const jusMixItems = categoryItems('jus-mix');
const jusBuahItems = () => [...jusOriginalItems, ...jusMixItems];
const jusYakultItems = () => categoryItems('jus-yakult-susu-uht');

/** Jawaban jam buka diisi otomatis dari site.ts. */
const hoursAnswer = isPlaceholder(site.openingHoursSummary) ? '[Jawaban]' : `Kami buka ${site.openingHoursSummary}.`;

/** FAQ yang sama untuk semua kategori. Jawaban "[Jawaban]" tidak ditampilkan. */
const faq = [
  // TODO: [Jawaban]
  { q: 'Apakah bisa pesan antar?', a: '[Jawaban]' },
  // TODO: [Jawaban]
  { q: 'Bisa pesan dalam jumlah banyak?', a: '[Jawaban]' },
  { q: 'Jam berapa Jus Tugu buka?', a: hoursAnswer },
  // TODO: [Jawaban]
  { q: 'Bisa minta kurangi gula atau tanpa es?', a: '[Jawaban]' },
];

// TODO: ganti dengan foto dekat asli
const closeUps = (image: MenuImage, subject: string): MenuImage[] => [
  { src: image.src, alt: `Potongan buah pada ${subject}` },
  { src: image.src, alt: `Kuah dan isi ${subject} dari dekat` },
  { src: image.src, alt: `${subject[0].toUpperCase()}${subject.slice(1)} siap diambil` },
];

const DETAIL_TEXT_PLACEHOLDER = '[Daftar buah yang dipakai dan cara penyajian]';

function page(input: Omit<CategoryPage, 'title' | 'description'>): CategoryPage {
  return {
    ...input,
    title: `${input.h1} – Mulai ${lowestText(input.items())} | ${site.name}`,
    description: input.intro,
  };
}

export const categoryPages: CategoryPage[] = [
  page({
    slug: 'sop-buah',
    name: 'Sop Buah',
    h1: 'Sop Buah di Sumberpucung',
    ribbonTitle: 'Pilihan Sop Buah',
    intro: `Sop buah Jus Tugu berisi potongan buah segar dengan pilihan kuah alpukat, mangga, sirsak, atau melon. Harga mulai ${lowestText(sopBuahItems())}, bisa dipesan langsung lewat WhatsApp.`,
    infoLabel: (count) => `${count} pilihan kuah · Mulai ${lowestText(sopBuahItems())}`,
    image: { src: sopBuahKuahAlpukatImg, alt: 'Sop buah kuah alpukat Jus Tugu dalam gelas plastik' },
    detailPhotos: closeUps({ src: sopBuahKuahAlpukatImg, alt: '' }, 'sop buah'),
    detailTitle: 'Isi Sop Buah Kami',
    // TODO: [Daftar buah yang dipakai dan cara penyajian]
    detailText: DETAIL_TEXT_PLACEHOLDER,
    detailCaption: 'Foto: potongan buah, kuah alpukat, dan sop buah siap diambil.',
    items: sopBuahItems,
    faq,
  }),
  page({
    slug: 'salad-buah',
    name: 'Salad Buah',
    h1: 'Salad Buah di Sumberpucung',
    ribbonTitle: 'Pilihan Salad Buah',
    // TODO: cek pemilik
    intro: `Salad buah Jus Tugu berisi potongan buah segar dengan saus salad dan keju parut di atasnya. Harga ${lowestText(saladBuahItems())}, bisa dipesan langsung lewat WhatsApp.`,
    infoLabel: (count) => `${count} pilihan · ${lowestText(saladBuahItems())}`,
    image: { src: saladBuahImg, alt: 'Salad buah Jus Tugu dengan saus salad dan parutan keju dalam gelas plastik' },
    detailPhotos: closeUps({ src: saladBuahImg, alt: '' }, 'salad buah'),
    detailTitle: 'Isi Salad Buah Kami',
    // TODO: [Daftar buah yang dipakai dan cara penyajian]
    detailText: DETAIL_TEXT_PLACEHOLDER,
    items: saladBuahItems,
    faq,
  }),
  page({
    slug: 'jus-buah',
    name: 'Jus Buah',
    h1: 'Jus Buah di Sumberpucung',
    ribbonTitle: 'Pilihan Jus Buah',
    // TODO: cek pemilik
    intro: `Jus buah segar Jus Tugu dari ${jusOriginalItems.length} pilihan buah dan ${jusMixItems.length} pilihan jus campur. Harga mulai ${lowestText(jusBuahItems())}, bisa dipesan langsung lewat WhatsApp.`,
    infoLabel: (count) => `${count} pilihan jus · Mulai ${lowestText(jusBuahItems())}`,
    image: { src: jusAlpukatImg, alt: 'Jus alpukat Jus Tugu yang kental dalam gelas plastik' },
    detailPhotos: closeUps({ src: jusAlpukatImg, alt: '' }, 'jus buah'),
    detailTitle: 'Isi Jus Buah Kami',
    // TODO: [Daftar buah yang dipakai dan cara penyajian]
    detailText: DETAIL_TEXT_PLACEHOLDER,
    items: jusBuahItems,
    groups: [
      { title: 'Jus Original', items: jusOriginalItems },
      { title: 'Jus Mix', items: jusMixItems },
    ],
    faq,
  }),
  page({
    slug: 'jus-yakult',
    name: 'Jus Yakult',
    h1: 'Jus Yakult di Sumberpucung',
    ribbonTitle: 'Pilihan Jus Yakult + Susu UHT',
    // TODO: cek pemilik
    intro: `Jus buah dicampur Yakult dan susu UHT, tersedia ${jusYakultItems().length} pilihan rasa. Harga mulai ${lowestText(jusYakultItems())}, bisa dipesan langsung lewat WhatsApp.`,
    infoLabel: (count) => `${count} pilihan rasa · Mulai ${lowestText(jusYakultItems())}`,
    image: { src: jusManggaYakultImg, alt: 'Jus mangga dengan Yakult dan susu UHT Jus Tugu dalam gelas plastik' },
    detailPhotos: closeUps({ src: jusManggaYakultImg, alt: '' }, 'jus yakult'),
    detailTitle: 'Isi Jus Yakult Kami',
    // TODO: [Daftar buah yang dipakai dan cara penyajian]
    detailText: DETAIL_TEXT_PLACEHOLDER,
    items: jusYakultItems,
    faq,
  }),
];

/** Harga termurah untuk kartu "Mulai Rp…". */
export function startingPrice(categoryPage: CategoryPage): string {
  return lowestText(categoryPage.items());
}

/** Teks harga untuk artikel: "Rp13.000" bila satu harga, "Mulai Rp10.000" bila beberapa. */
export function priceLabel(slug: CategorySlug): string {
  const target = categoryPages.find((p) => p.slug === slug)!;
  const prices = new Set(target.items().map((item) => item.price));
  return prices.size > 1 ? `Mulai ${startingPrice(target)}` : startingPrice(target);
}

export function categoryPageUrl(slug: CategorySlug): string {
  return `/menu/${slug}`;
}

/** Link "Lihat detail" pada pita Menu Lengkap (id kategori di menu.ts → halaman). Minuman Lain tanpa link. */
const ribbonLinks: Record<string, CategorySlug> = {
  'sop-salad-buah': 'sop-buah',
  'jus-yakult-susu-uht': 'jus-yakult',
  'jus-original': 'jus-buah',
  'jus-mix': 'jus-buah',
};

export function categoryLinkFor(categoryId: string): { href: string; name: string } | undefined {
  const slug = ribbonLinks[categoryId];
  const target = categoryPages.find((p) => p.slug === slug);
  return target ? { href: categoryPageUrl(target.slug), name: target.name } : undefined;
}
