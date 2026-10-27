/**
 * Menu Jus Tugu — satu-satunya sumber harga dan nama menu.
 * Halaman, JSON-LD, keranjang, dan pesan WhatsApp semuanya membaca file ini.
 * Harga ditulis sebagai angka (7000), bukan teks.
 */
import type { ImageMetadata } from 'astro';
import sopBuahKuahAlpukatImg from '../assets/images/sop-buah-kuah-alpukat.png';
import saladBuahImg from '../assets/images/salad-buah.png';
import jusAlpukatImg from '../assets/images/jus-alpukat.png';
import jusManggaYakultImg from '../assets/images/jus-mangga-yakult.png';
import jusBuahNagaImg from '../assets/images/jus-buah-naga.png';

export interface MenuImage {
  src: ImageMetadata;
  alt: string;
}

export interface MenuItem {
  slug: string;
  /** Nama seperti tertulis di daftar menu. */
  name: string;
  /** Nama lengkap untuk kartu, keranjang, dan pesan WhatsApp. */
  orderName: string;
  description: string;
  price: number;
  bestSeller?: boolean;
  /** Label di atas foto kartu, mis. "Terlaris". */
  badge?: string;
  image?: MenuImage;
}

export interface Category {
  id: string;
  name: string;
  items: MenuItem[];
}

interface ItemInput {
  name: string;
  price: number;
  description?: string;
  bestSeller?: boolean;
  badge?: string;
  image?: MenuImage;
}

interface CategoryRules {
  orderName: (name: string) => string;
  description: (name: string) => string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function build(items: ItemInput[], rules: CategoryRules): MenuItem[] {
  return items.map(({ name, price, description, bestSeller, badge, image }) => {
    const orderName = rules.orderName(name);
    return {
      slug: slugify(orderName),
      name,
      orderName,
      description: description ?? rules.description(name),
      price,
      ...(bestSeller ? { bestSeller } : {}),
      ...(badge ? { badge } : {}),
      ...(image ? { image } : {}),
    };
  });
}

const same = (name: string) => name;
const lower = (name: string) => name.toLowerCase();
/** "Wortel + Apel + Tomat" → "wortel dan apel dan tomat" (sesuai desain). */
const joinMix = (name: string) => name.split('+').map((part) => lower(part.trim())).join(' dan ');

export const categories: Category[] = [
  {
    id: 'sop-salad-buah',
    name: 'Sop & Salad Buah',
    items: build(
      [
        {
          name: 'Salad Buah',
          price: 13000,
          description: 'Potongan buah segar dengan saus salad dan keju.',
          bestSeller: true,
          image: { src: saladBuahImg, alt: 'Salad buah Jus Tugu dengan saus salad dan parutan keju dalam gelas plastik' },
        },
        {
          name: 'Sop Buah Kuah Alpukat',
          price: 13000,
          description: 'Potongan buah dengan kuah alpukat kental.',
          bestSeller: true,
          badge: 'Terlaris',
          image: { src: sopBuahKuahAlpukatImg, alt: 'Sop buah kuah alpukat Jus Tugu dalam gelas plastik' },
        },
        { name: 'Sop Buah Kuah Mangga', price: 10000, description: 'Potongan buah dengan kuah mangga.' },
        { name: 'Sop Buah Kuah Sirsak', price: 10000, description: 'Potongan buah dengan kuah sirsak.' },
        { name: 'Sop Buah Kuah Melon', price: 10000, description: 'Potongan buah dengan kuah melon.' },
      ],
      { orderName: same, description: same },
    ),
  },
  {
    id: 'jus-yakult-susu-uht',
    name: 'Jus Yakult + Susu UHT',
    items: build(
      [
        { name: 'Strawberry', price: 13000 },
        { name: 'Leci', price: 13000 },
        {
          name: 'Mangga',
          price: 12000,
          bestSeller: true,
          image: { src: jusManggaYakultImg, alt: 'Jus mangga dengan Yakult dan susu UHT Jus Tugu dalam gelas plastik' },
        },
        { name: 'Sirsak', price: 12000 },
        { name: 'Melon', price: 12000 },
        { name: 'Nanas', price: 12000 },
        { name: 'Tomat', price: 12000 },
        { name: 'Wortel', price: 12000 },
        { name: 'Jambu', price: 12000 },
        { name: 'Jeruk', price: 12000 },
        { name: 'Lemon', price: 12000 },
        { name: 'Alpukat', price: 15000 },
      ],
      {
        orderName: (name) => `${name} + Yakult + Susu UHT`,
        description: (name) => `Jus ${lower(name)} dengan Yakult dan susu UHT.`,
      },
    ),
  },
  {
    id: 'jus-original',
    name: 'Jus Original',
    items: build(
      [
        {
          name: 'Alpukat',
          price: 12000,
          bestSeller: true,
          image: { src: jusAlpukatImg, alt: 'Jus alpukat Jus Tugu yang kental dalam gelas plastik' },
        },
        {
          name: 'Buah Naga',
          price: 10000,
          bestSeller: true,
          image: { src: jusBuahNagaImg, alt: 'Jus buah naga Jus Tugu berwarna merah muda dalam gelas plastik' },
        },
        { name: 'Strawberry', price: 9000 },
        { name: 'Leci', price: 10000 },
        { name: 'Mangga', price: 8000 },
        { name: 'Tomat', price: 7000 },
        { name: 'Wortel', price: 7000 },
        { name: 'Apel', price: 7000 },
        { name: 'Sirsak', price: 7000 },
        { name: 'Semangka', price: 7000 },
        { name: 'Melon', price: 7000 },
        { name: 'Blewah', price: 7000 },
        { name: 'Nanas', price: 7000 },
        { name: 'Tape Ketan Hitam', price: 7000 },
        { name: 'Lemon', price: 7000 },
        { name: 'Jambu', price: 7000 },
        { name: 'Jeruk', price: 6000 },
      ],
      {
        orderName: (name) => `Jus ${name}`,
        description: (name) => `Jus ${lower(name)} segar tanpa campuran.`,
      },
    ),
  },
  {
    id: 'jus-mix',
    name: 'Jus Mix',
    items: build(
      [
        { name: 'Sirsak + Strawberry', price: 12000 },
        { name: 'Wortel + Apel + Tomat', price: 10000 },
        { name: 'Leci + Tomat', price: 12000 },
        { name: 'Jambu + Buah Naga', price: 12000 },
        { name: 'Nanas + Wortel', price: 9000 },
        { name: 'Wortel + Apel', price: 9000 },
        { name: 'Wortel + Tomat', price: 9000 },
        { name: 'Apel + Tomat', price: 9000 },
        { name: 'Apel + Lemon', price: 9000 },
        { name: 'Nanas + Lemon', price: 9000 },
      ],
      {
        orderName: (name) => `Jus ${name}`,
        description: (name) => `Campuran jus ${joinMix(name)}.`,
      },
    ),
  },
  {
    id: 'minuman-lain',
    name: 'Minuman Lain',
    items: build(
      [
        { name: 'Cappuccino', price: 7000 },
        { name: 'Chocolate', price: 7000 },
        { name: 'Choco Oreo', price: 7000 },
        { name: 'Green Tea', price: 7000 },
      ],
      { orderName: same, description: (name) => `${name} dingin, cocok teman jus.` },
    ),
  },
];

export const allItems: MenuItem[] = categories.flatMap((category) => category.items);

/** Urutan kartu "Paling Sering Dipesan", sesuai desain. */
const bestSellerOrder = ['sop-buah-kuah-alpukat', 'salad-buah', 'jus-alpukat', 'mangga-yakult-susu-uht', 'jus-buah-naga'];

export const bestSellers: MenuItem[] = allItems
  .filter((item) => item.bestSeller)
  .sort((a, b) => bestSellerOrder.indexOf(a.slug) - bestSellerOrder.indexOf(b.slug));

export const totalItems = allItems.length;
export const minPrice = Math.min(...allItems.map((item) => item.price));
export const maxPrice = Math.max(...allItems.map((item) => item.price));

export { formatRupiah } from '../lib/format';
