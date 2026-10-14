# Jus Tugu — Website

Situs statis untuk Jus Tugu (jus buah, sop buah, salad buah) di Desa Senggreng, Kec. Sumberpucung, Kab. Malang.
Dibuat dengan [Astro](https://astro.build) tanpa backend: pesanan dikirim lewat WhatsApp, masukan disimpan ke Google Sheets.

Desain asli: `untitled.pen` (Pen.dev) — sumber kebenaran untuk warna, huruf, jarak, dan komponen.

## Menjalankan

Butuh Node.js 22 atau lebih baru.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # cek tipe (astro check) lalu build ke folder dist/
npm run preview   # lihat hasil build
```

`npm run assets` membuat ulang `favicon.png`, `apple-touch-icon.png`, `icon-512.png`, dan `og-image.jpg`
dari `public/favicon.svg` dan foto hero. Jalankan setelah mengganti salah satunya.

## Mengubah data

Semua teks usaha, harga, dan menu diambil dari dua file. Halaman, data SEO (JSON-LD), keranjang,
dan pesan WhatsApp otomatis ikut berubah.

### `src/data/site.ts` — data usaha

Isi semua nilai bertanda `TODO` (cari teks `TODO:` di file):

| Placeholder | Isi dengan |
| --- | --- |
| `[SITE_URL]` | Domain situs, mis. `https://justugu.com` (juga ganti di `public/robots.txt`) |
| `[WA_NUMBER]` | Nomor WhatsApp format 62, mis. `6281234567890` |
| `[FULL_ADDRESS]` | Nama jalan / dusun / RT RW |
| `[LANDMARK]` | Patokan, mis. "Depan balai desa" |
| `[POSTAL_CODE]` | Kode pos |
| `[COORDINATES]` | `geo: { lat: -8.12345, lng: 112.4567 }` dari Google Maps |
| `[OPENING_HOURS]` | Jam buka per hari (`opens: '08:00', closes: '21:00'`, atau `null` jika tutup) dan ringkasan untuk hero (`openingHoursSummary`) |
| `[INSTAGRAM_URL]`, `[FACEBOOK_URL]`, `[GOFOOD_URL]` | Tautan lengkap |
| `[APPS_SCRIPT_URL]` | URL Web App Google Apps Script (lihat di bawah) |

Selama placeholder belum diisi, nilainya tidak dimasukkan ke JSON-LD, sehingga validator tidak
menandai data palsu.

### `src/data/menu.ts` — menu dan harga

- Harga ditulis sebagai angka: `price: 7000`. Tampilannya otomatis menjadi "Rp7.000".
- Menambah menu: tambahkan baris `{ name: 'Durian', price: 15000 }` ke kategori yang sesuai.
  Deskripsi dan nama pesanan (mis. "Jus Durian") dibuat otomatis sesuai pola kategori;
  isi `description` sendiri bila perlu.
- `bestSeller: true` menampilkan menu di "Paling Sering Dipesan" (perlu `image`).
  Urutan kartu diatur di `bestSellerOrder`. `badge: 'Terlaris'` menampilkan label kuning.
- Jumlah menu ("47 pilihan menu"), harga termurah, dan rentang harga dihitung otomatis.

### Testimoni

Edit `src/data/testimonials.ts`.

### Foto

Foto ada di `src/assets/images/`. Ganti file dengan nama yang sama (format JPG/PNG, minimal lebar 1200px).
Astro otomatis membuat versi AVIF/WebP yang kecil. Teks alternatif (alt) ada di `menu.ts`.

## Form Kritik & Saran → Google Sheets

1. Buat Google Spreadsheet baru (mis. "Masukan Jus Tugu").
2. Menu **Extensions → Apps Script**. Hapus isi editor, lalu tempel isi `google-apps-script/Code.gs`. Simpan.
3. Klik **Deploy → New deployment**, pilih tipe **Web app**:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Klik **Deploy**, izinkan akses (Authorize access), lalu salin **Web app URL**
   (berakhiran `/exec`).
5. Tempel URL itu di `src/data/site.ts` → `appsScriptUrl`, lalu build ulang.

Sheet "Masukan" dengan kolom Waktu, Nama, Rating, Pesan dibuat otomatis pada kiriman pertama.
Setelah mengubah `Code.gs`, buat versi baru lewat **Deploy → Manage deployments → Edit → New version**
agar URL tetap sama.

Perlindungan: field honeypot tersembunyi untuk bot, batas 1000 karakter, jeda minimal 30 detik antar kiriman,
dan teks yang diawali `=`, `+`, `-`, `@` diberi tanda kutip agar tidak dijalankan sebagai rumus.

## Deploy

Hasil `npm run build` ada di `dist/` dan bisa diunggah ke hosting statis mana pun
(Netlify, Cloudflare Pages, Vercel, GitHub Pages):

- Build command: `npm run build`
- Output directory: `dist`

Setelah online:

1. Pastikan `site.url` dan `public/robots.txt` memakai domain asli.
2. Uji di [Rich Results Test](https://search.google.com/test/rich-results) dan
   [Schema Markup Validator](https://validator.schema.org/).
3. Daftarkan `https://domainanda/sitemap-index.xml` di Google Search Console.
4. Lengkapi Google Business Profile dengan alamat dan jam buka yang sama.

## Struktur

```
src/
  data/          site.ts, menu.ts, testimonials.ts (sumber data)
  styles/        tokens.css (design tokens dari Pen.dev), global.css
  layouts/       BaseLayout.astro (head, SEO, JSON-LD, font)
  components/    satu komponen per section / elemen UI
  scripts/       cart.ts, whatsapp.ts, feedback.ts
  pages/         index.astro
google-apps-script/Code.gs
scripts/generate-assets.mjs
```
