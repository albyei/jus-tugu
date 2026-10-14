// Membuat favicon PNG, apple-touch-icon, ikon manifest, dan og-image.jpg.
// Jalankan ulang setelah mengganti favicon.svg atau foto hero: npm run assets
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';

const svg = await readFile('public/favicon.svg');
await sharp(svg, { density: 384 }).resize(48, 48).png().toFile('public/favicon.png');
await sharp(svg, { density: 384 }).resize(180, 180).png().toFile('public/apple-touch-icon.png');
await sharp(svg, { density: 768 }).resize(512, 512).png().toFile('public/icon-512.png');
await sharp('src/assets/images/hero.png')
  .resize(1200, 630, { fit: 'cover', position: 'centre' })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile('public/og-image.jpg');
console.log('Aset publik dibuat.');
