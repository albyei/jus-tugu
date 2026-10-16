# Prompt: Implementasi Desain v2 Jus Tugu ke Kode

> Salin seluruh isi file ini sebagai prompt untuk agen coding (Claude Code atau sejenisnya)
> yang bekerja di folder proyek `juice-tugu`.

---

## 0. Peran, konteks, dan aturan main

Kamu adalah front-end engineer yang melanjutkan website **Jus Tugu** (Astro 7, situs statis, tanpa backend;
pesanan dikirim lewat WhatsApp). Desain halaman utama **sudah diimplementasikan** di kode. Tugasmu sekarang
adalah menerapkan **desain v2**: font baru, favicon baru, pembaruan kecil di halaman utama, dan
**tiga template halaman baru** (kategori menu, daftar artikel, detail artikel).

**Sumber kebenaran desain:** `untitled.pen` (Pen.dev). Frame yang relevan (ID node dalam kurung):

| Frame | ID | Posisi kanvas |
|---|---|---|
| Mobile – Beranda: Header, Menu Lengkap & Footer (diperbarui) | `xvd8L` | x 3340, y 0 |
| Mobile – Kategori Sop Buah | `v0bAR` | x 3830, y 0 |
| Mobile – Kategori Sop Buah: FAQ Terbuka, 2 Item di Keranjang | `g3jdzN` | x 4320, y 0 |
| Mobile – Daftar Artikel | `hqHRs` | x 4810, y 0 |
| Mobile – Daftar Artikel: Filter Tanpa Hasil | `iVTke` | x 5300, y 0 |
| Mobile – Detail Artikel | `T9YM8` | x 5790, y 0 |
| Mobile – Detail Artikel: Daftar Isi Terbuka | `qet6M` | x 6280, y 0 |
| Desktop – Kategori Sop Buah | `a8ZDx` | x 1940, y 10000 |
| Desktop – Daftar Artikel | `THhcM` | x 3480, y 10000 |
| Desktop – Detail Artikel | `UvNbh` | x 5020, y 10000 |
| Components – Konten & Artikel (komponen baru) | `U6yH8G` | x 0, y −2200 |
| Design System → "07 Komponen Konten & Artikel" | `h1ugEE` | di dalam `gQHnQ` |
| Uji Font v2 → kolom "C · Outfit" (acuan font) | `MLKlq` | di dalam `osWeL` |
| Favicon → "H · Pasir" (acuan favicon) | `PHqIJ` | di dalam `l09tdp` |

Frame `PRATINJAU Figtree …`, `Uji Font – Bricolage vs Figtree`, dan pilihan favicon lain **hanya eksperimen,
abaikan**. Catatan: variabel font di file `.pen` masih Bricolage/Plus Jakarta Sans. **Spesifikasi font
di prompt ini (Outfit) yang berlaku.**

### Aturan wajib
1. **Ikuti pola kode yang sudah ada.** Pakai token dari `src/styles/tokens.css` (`var(--space-4)`,
   `var(--color-accent)`, dll.), komponen `Icon.astro` (ikon Phosphor lewat sprite), `Button.astro`,
   `MenuItem.astro`, `QtyControl.astro`, `OrderBar.astro`, `OrderSheet.astro`, `OrderSummary.astro`,
   `QtyStepperTemplate.astro`, dan `src/scripts/cart.ts` (atribut `data-*` yang sudah ada). Style per komponen
   memakai `<style>` scoped seperti komponen lain. Komentar kode dalam bahasa Indonesia.
2. **Jangan menambah warna baru.** Semua warna sudah ada di `tokens.css`. Hex yang muncul di prompt ini
   hanya untuk referensi; di CSS selalu pakai token.
3. **Data hanya dari satu sumber.** Harga, nama menu, dan jumlah item dibaca dari `src/data/menu.ts`; data usaha dari
   `src/data/site.ts`. Jangan menulis harga secara manual di halaman.
4. **Jangan menyentuh** perubahan yang belum di-commit milik pemilik di `src/data/site.ts` dan `public/robots.txt`,
   kecuali untuk hal yang disebut eksplisit di prompt ini.
5. **Teks placeholder** berbentuk `[...]` (mis. `[Jawaban]`). Tangani dengan `isPlaceholder()` dari `site.ts`:
   blok yang isinya masih placeholder **tidak dirender** (lihat §9).
6. Bahasa UI: Indonesia, sapaan "Anda". Tanpa emoji. Tanpa popup, banner newsletter, atau tombol melayang baru.
7. Setelah setiap tahap jalankan `npm run build` (berisi `astro check`) dan pastikan lulus tanpa error.

### Breakpoint (sama seperti kode sekarang)
- Mobile: < 768px (desain 390px, gutter 16px)
- Tablet: 768–1023px (gutter 32px, layout mobile yang melebar)
- Desktop: ≥ 1024px (desain 1440px, konten 1200px, gutter 120px, header 72px)

---

## 1. Tipografi: ganti ke **Outfit** (satu keluarga untuk judul dan isi)

Acuan visual: kolom "C · Outfit" di frame Uji Font v2. Gayanya meniru buymeacoffee.com: satu font, judul
tebal-sedang dengan jarak huruf rapat, isi besar dan lega.

### 1.1 Paket & pemuatan
- Tambah dependency `@fontsource-variable/outfit` (satu file variabel 100–900, subset latin).
- Hapus `@fontsource/bricolage-grotesque` dan `@fontsource/plus-jakarta-sans` dari `package.json`
  beserta semua import-nya.
- Di `src/layouts/BaseLayout.astro`: ganti 5 import font lama dengan `import '@fontsource-variable/outfit';`,
  lalu ganti `preload` agar menunjuk file woff2 latin dari paket Outfit Variable
  (periksa nama file sebenarnya di `node_modules/@fontsource-variable/outfit/files/`, biasanya
  `outfit-latin-wght-normal.woff2`).

### 1.2 Token (`src/styles/tokens.css`)
```css
--font-heading: 'Outfit Variable', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
--font-body:    'Outfit Variable', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;

--weight-heading: 600;   /* BARU: H1, H2, H3, pita kategori, judul panel/sheet */
--weight-brand: 700;     /* BARU: logo "Jus Tugu", nama usaha di footer, total harga */

--tracking-display: -0.025em;  /* sebelumnya -0.02em */
--tracking-h2: -0.02em;        /* sebelumnya -0.015em */
--leading-tight: 1.05;         /* tetap; dipakai H1 */
```
Ukuran huruf (`--text-*`) **tidak berubah**.

### 1.3 Pemetaan ketebalan
Saat ini ada sekitar 12 pemakaian `--weight-extrabold` bersama `--font-heading` (cari dengan
`grep -rn "weight-extrabold" src`). Ganti sesuai tabel:

| Peran | Font | Ketebalan | Jarak huruf | Jarak baris |
|---|---|---|---|---|
| Display / H1 (34→58px) | Outfit | 600 (`--weight-heading`) | −0.025em | 1.05 |
| H2 / judul section (28→40px) | Outfit | 600 | −0.02em | 1.1 |
| H3, pita kategori (20px), judul panel (22px), judul bottom sheet (24px), judul sukses | Outfit | 600 | tetap | tetap |
| Logo "Jus Tugu", nama usaha di footer (28px), total harga (24px) | Outfit | 700 (`--weight-brand`) | tetap | tetap |
| Isi paragraf, deskripsi | Outfit | 400 | – | 1.5 |
| Nama menu (17px), harga (16px) | Outfit | 700 | – | tetap |
| Label tombol (16px) | Outfit | **700** (sebelumnya 600) | – | – |
| Label chip, label form, caption | Outfit | 500/600 seperti sekarang | – | – |

Setelah diganti, periksa bahwa harga tetap memakai `font-variant-numeric: tabular-nums` dan tidak ada teks
yang terpotong (Outfit sedikit lebih sempit dari Plus Jakarta Sans).

---

## 2. Favicon: **tugu, latar pasir**

Ganti seluruh isi `public/favicon.svg` dengan:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#FCEBD3"/>
  <path d="M32 5 L37 13 H27 Z" fill="#222222"/>
  <path d="M27 15.5 H37 L39.5 43 H24.5 Z" fill="#222222"/>
  <rect x="20.5" y="44.5" width="23" height="5" rx="1" fill="#222222"/>
  <rect x="15" y="51" width="34" height="7" rx="2" fill="#222222"/>
</svg>
```
(File yang sama juga ada di `untitled-assets/favicon/h-tugu-pasir.svg`.)

Lalu buat ulang **hanya** `public/favicon.png` (48px), `public/apple-touch-icon.png` (180px), dan
`public/icon-512.png` dengan logika yang sama seperti `scripts/generate-assets.mjs`. **Jangan** membuat ulang
`og-image.jpg`. `site.webmanifest` dan `themeColor` (`#FFDD00`) **tidak diubah**.

---

## 3. Pembaruan halaman utama

### 3.1 Header (`src/components/Header.astro`)
- Link navigasi ditulis absolut agar berfungsi dari halaman mana pun: `/#menu`, `/#lokasi`, `/#saran`.
- Tambah link **"Artikel"** → `/artikel` (urutan: Menu, Lokasi, Saran, Artikel).
- Komponen menerima prop `current?: 'menu' | 'artikel'`. Link aktif diberi `aria-current="page"` dan di
  desktop tampil dengan `font-weight: 700` plus garis bawah `2px solid var(--color-ink)` di tepi bawah link
  (tinggi link tetap 48px). Halaman kategori → `current="menu"`, halaman artikel → `current="artikel"`.
- **Menu mobile (panel saat tombol ☰ dibuka)**, acuan frame `xvd8L`:
  - Ikon tombol berganti dari `list` ke `x` saat terbuka.
  - Panel: latar `--color-bg`, padding `4px 16px 24px`, garis bawah 1px `--color-border`, gap 16px.
  - Label di panel mobile lebih panjang dari desktop: **Menu**, **Lokasi & Jam Buka**, **Kritik & Saran**,
    **Artikel**. Setiap baris tingginya 56px, teks 17px/600, garis bawah 1px, ikon `caret-right` 20px
    `--color-text-muted` di kanan.
  - Di bawah daftar: tombol outline lebar penuh "Chat WhatsApp" (ikon WhatsApp hijau), sama dengan tombol
    outline yang sudah ada, menuju `greetingLink`.
  - Perilaku buka/tutup (Escape, klik di luar, klik link) memakai script yang sudah ada.

### 3.2 Pita kategori di Menu Lengkap (`src/components/MenuSection.astro`)
- Struktur pita diubah agar link tidak berada di dalam `<h2>`:
  `<div class="ribbon"><h2>{nama}</h2><div class="ribbon__end"><span class="ribbon__count">5 menu</span><a>Lihat detail →</a></div></div>`.
- Link **"Lihat detail"**: 14px/600, warna `--color-on-ink`, bergaris bawah, diikuti ikon `arrow-right`
  16px (weight bold), jarak 4px. Area klik setinggi 48px. `aria-label="Lihat detail {nama halaman kategori}"`.
- `ribbon__end`: flex, gap 16px. **Di bawah 1024px, `ribbon__count` disembunyikan** (supaya
  "Jus Yakult + Susu UHT" + link muat di 358px). Di desktop jumlah menu tetap tampil.
- Pemetaan link (lihat §4.1): Sop & Salad Buah → `/menu/sop-buah`; Jus Yakult + Susu UHT →
  `/menu/jus-yakult`; Jus Original → `/menu/jus-buah`; Jus Mix → `/menu/jus-buah`;
  Minuman Lain → **tanpa link**.

### 3.3 Footer (`src/components/Footer.astro`)
Tambahkan blok tautan dengan dua kolom:
- **Menu**: Sop Buah (`/menu/sop-buah`), Salad Buah (`/menu/salad-buah`), Jus Buah (`/menu/jus-buah`),
  Jus Yakult (`/menu/jus-yakult`)
- **Info**: Artikel (`/artikel`), Lokasi & Jam Buka (`/#lokasi`), Kritik & Saran (`/#saran`)

Gaya: judul kolom 14px/700 `--color-text-muted`, letter-spacing 0.3px. Setiap link 16px `--color-text`
dengan tinggi baris 40px (area klik), jarak antarbaris 2px.
- **Mobile:** blok tautan berada **setelah Kontak, sebelum ikon sosial**; dua kolom sama lebar, gap 16px.
- **Desktop:** baris atas footer menjadi `Brand (sisa lebar) | Menu (150px) | Info (150px) | Kontak (280px,
  sebelumnya 380px) | Sosial`, gap 48px (sebelumnya 64px).

---

## 4. Data baru

### 4.1 `src/data/categoryPages.ts` (baru)
Konfigurasi halaman kategori. Item diambil dari `categories` di `menu.ts`, tidak disalin.
```ts
export interface CategoryPage {
  slug: 'sop-buah' | 'salad-buah' | 'jus-buah' | 'jus-yakult';
  name: string;            // "Sop Buah": breadcrumb, kartu, footer
  h1: string;              // "Sop Buah di Sumberpucung"
  ribbonTitle: string;     // "Pilihan Sop Buah"
  intro: string;
  infoLabel: (count: number) => string;  // "4 pilihan kuah", "27 pilihan jus"
  image: MenuImage;        // foto header
  detailPhotos: MenuImage[];  // 3 foto "Isi … Kami"
  detailTitle: string;     // "Isi Sop Buah Kami"
  detailText: string;      // placeholder "[Daftar buah yang dipakai dan cara penyajian]"
  items: () => MenuItem[]; // filter dari categories
  groups?: { title: string; items: MenuItem[] }[]; // untuk jus-buah: Jus Original & Jus Mix
  faq: { q: string; a: string }[];
  title: string;           // <title>
  description: string;     // meta description
}
```
Isi untuk 4 halaman:

| slug | Item | H1 | Pengantar | Info | Foto header |
|---|---|---|---|---|---|
| `sop-buah` | 4 item kategori `sop-salad-buah` yang namanya diawali "Sop Buah" | Sop Buah di Sumberpucung | "Sop buah Jus Tugu berisi potongan buah segar dengan pilihan kuah alpukat, mangga, sirsak, atau melon. Harga mulai Rp10.000, bisa dipesan langsung lewat WhatsApp." | "4 pilihan kuah · Mulai Rp10.000" | `sop-buah-kuah-alpukat.png` |
| `salad-buah` | item "Salad Buah" | Salad Buah di Sumberpucung | "Salad buah Jus Tugu berisi potongan buah segar dengan saus salad dan keju parut di atasnya. Harga Rp13.000, bisa dipesan langsung lewat WhatsApp." | "1 pilihan · Rp13.000" | `salad-buah.png` |
| `jus-buah` | kategori `jus-original` + `jus-mix` (dua grup, masing-masing dengan pitanya sendiri) | Jus Buah di Sumberpucung | "Jus buah segar Jus Tugu dari {n} pilihan buah dan {m} pilihan jus campur. Harga mulai Rp6.000, bisa dipesan langsung lewat WhatsApp." | "{total} pilihan jus · Mulai Rp6.000" | `jus-alpukat.png` |
| `jus-yakult` | kategori `jus-yakult-susu-uht` | Jus Yakult di Sumberpucung | "Jus buah dicampur Yakult dan susu UHT, tersedia {n} pilihan rasa. Harga mulai Rp12.000, bisa dipesan langsung lewat WhatsApp." | "{n} pilihan rasa · Mulai Rp12.000" | `jus-mangga-yakult.png` |

Semua angka (jumlah, "Mulai RpX") **dihitung** dari data (harga minimum item, format `formatRupiah`).
Pengantar untuk salad, jus buah, dan jus yakult adalah **draf**: tandai dengan komentar `// TODO: cek pemilik`.

FAQ (sama untuk semua kategori, jawaban masih placeholder):
1. "Apakah bisa pesan antar?" → `[Jawaban]`
2. "Bisa pesan dalam jumlah banyak?" → `[Jawaban]`
3. "Jam berapa Jus Tugu buka?" → **isi otomatis** dari `site.openingHoursSummary` (mis. "Kami buka setiap hari 12.00–21.00.")
4. "Bisa minta kurangi gula atau tanpa es?" → `[Jawaban]`

`detailPhotos` sementara memakai foto header yang sama, dengan tiga potongan berbeda lewat
`object-position` dan `transform: scale()` di CSS (lihat §6.4). Beri komentar
`// TODO: ganti dengan foto dekat asli`.

`<title>`: `"{h1} – Mulai Rp{min} | Jus Tugu"`. Description = pengantar.

### 4.2 Artikel: Astro Content Collection
- Tambah integrasi `@astrojs/mdx`. Artikel ditulis sebagai `.mdx` di `src/content/artikel/`.
- Skema (`src/content.config.ts`) menggunakan `zod`:
  ```ts
  title: string; description: string;      // description = ringkasan 2 baris untuk kartu
  category: 'Menu' | 'Tips Buah';
  date: Date; author: string;               // "[Nama Pemilik]"
  cover: image(); coverAlt: string; coverCaption: string;
  relatedMenu: string[];                    // slug MenuItem, mis. ['salad-buah','sop-buah-kuah-alpukat']
  sources: { label: string; url?: string }[];
  draft: boolean (default false);
  ```
- Waktu baca dihitung otomatis: `Math.max(1, Math.round(jumlahKata / 200))` → "4 menit baca".
- Format tanggal Indonesia singkat: `12 Okt 2026` (Jan, Feb, Mar, Apr, Mei, Jun, Jul, Agu, Sep, Okt, Nov, Des).
  Buat helper `formatTanggal()` di `src/lib/format.ts`.
- Artikel dengan `draft: true` tidak masuk ke daftar, rute, maupun sitemap.

**Empat artikel awal:**

| # | Judul | Kategori | Tanggal | Ringkasan (kartu) | Cover | draft |
|---|---|---|---|---|---|---|
| 1 | Beda Salad Buah dan Sop Buah, Mana yang Cocok untuk Anda? | Menu | 2026-10-12 | Sama-sama potongan buah, beda saus dan rasanya. | `salad-buah.png` | **false** |
| 2 | Jus Tape Ketan Hitam: Seperti Apa Rasanya? | Menu | 2026-10-05 | Manis, sedikit asam, dan wangi khas tape. | belum ada foto | true |
| 3 | Pilihan Jus Yakult dan Susu UHT di Jus Tugu | Menu | 2026-09-28 | Rasa buah yang dicampur Yakult atau susu UHT. | `jus-mangga-yakult.png` | true |
| 4 | Manfaat Jus Alpukat dan Cara Memilih Alpukat yang Matang | Tips Buah | 2026-09-20 | Ciri alpukat yang pas untuk dijus. | `jus-alpukat.png` | true |

Artikel 2–4 cukup berisi frontmatter dan satu paragraf `[Isi artikel]`. Desain kartu dengan foto kosong
(kotak `--color-border` + ikon `image` `--color-icon-muted` di tengah) dipakai bila `cover` tidak ada,
jadi buat `cover` opsional.

**Isi lengkap artikel 1** (`beda-salad-buah-dan-sop-buah.mdx`), urut persis:
1. Paragraf pembuka: "Salad buah dan sop buah sama-sama berbahan potongan buah segar, tetapi cara penyajian dan rasanya berbeda. Berikut perbedaannya, supaya Anda tahu mana yang lebih cocok."
2. `## Salad Buah`: "Potongan buah disajikan dengan saus kental, biasanya campuran mayones, susu, dan keju parut di atasnya. Teksturnya creamy dan rasanya manis gurih."
3. `## Sop Buah`: "Potongan buah disajikan dalam kuah dingin. Di Jus Tugu, kuahnya bisa dipilih: alpukat, mangga, sirsak, atau melon. Lebih segar dan cocok diminum saat cuaca panas."
4. `## Perbandingan singkat` + `<ComparisonTable>`:

   |  | Salad Buah | Sop Buah |
   |---|---|---|
   | Penyajian | Saus kental, keju parut di atas | Kuah dingin, pilih rasa kuah |
   | Tekstur | Creamy | Segar, berkuah |
   | Rasa | Manis gurih | Manis segar |
   | Harga di Jus Tugu | Rp13.000 | Mulai Rp10.000 |

   (Harga di baris terakhir diambil dari `menu.ts`, bukan diketik manual.)
5. `## Mana yang cocok untuk Anda?`: "Keduanya sama segarnya. Pilihannya tergantung selera dan suasana."
   - `### Pilih salad buah jika Anda` + daftar: "Suka rasa manis gurih dan tekstur creamy" · "Ingin camilan yang lebih mengenyangkan" · "Menyukai keju"
   - `### Pilih sop buah jika Anda` + daftar: "Mencari minuman yang segar saat cuaca panas" · "Ingin memilih rasa kuah sendiri" · "Lebih suka rasa manis yang ringan"
   - `<TipBox>[Tips singkat dari pemilik]</TipBox>`
   - `<Figure src={sopBuahKuahAlpukat} caption="Sop buah kuah alpukat dengan potongan buah naga, pepaya, dan melon." />`
- Frontmatter: `author: '[Nama Pemilik]'`, `coverCaption: 'Salad buah Jus Tugu dengan keju parut di atasnya.'`,
  `relatedMenu: ['salad-buah', 'sop-buah-kuah-alpukat']`,
  `sources: [{ label: '[Nama sumber 1], [judul halaman], [tahun]' }, { label: '[Nama sumber 2], [judul halaman], [tahun]' }]`.

---

## 5. Komponen baru (`src/components/`)

Semua ukuran dalam px desain. "Heading" = `var(--font-heading)` + `var(--weight-heading)`.

| Komponen | Spesifikasi |
|---|---|
| **Breadcrumb.astro** | `<nav aria-label="Breadcrumb"><ol>` horizontal, gap 6, padding 12px 0, rata tengah vertikal. Tautan: 14px/500 `--color-text-muted`, bergaris bawah. Pemisah "/": 14px `--color-icon-muted`, `aria-hidden`. Item terakhir: 14px/600 `--color-text`, `aria-current="page"`, bukan link. Di mobile item terakhir boleh dipotong elipsis (1 baris). Props: `items: {label, href?}[]`. Juga mengeluarkan JSON-LD `BreadcrumbList`. |
| **FaqAccordion.astro** | `<details>`/`<summary>` per item (berfungsi tanpa JS). Item: garis bawah 1px; daftar diberi garis atas 1px. Summary: flex, gap 12, padding 16px 0, min-height 56; teks 17px/700 lh 1.4; ikon `caret-down` 22px (bold) `--color-text` di kanan, diputar 180° saat `[open]`. Jawaban: padding `0 34px 18px 0`, 16px `--color-text-muted` lh 1.5. Item dengan jawaban placeholder tidak dirender. Mengeluarkan JSON-LD `FAQPage` untuk item yang terjawab. |
| **ArticleCard.astro** | Prop `variant: 'horizontal' \| 'vertical'`. Seluruh kartu adalah satu `<a>` ke artikel. **Horizontal (mobile):** flex, gap 14, padding 16px 0, garis bawah 1px (kecuali item terakhir); foto 104×104 radius 12 (`--radius-lg`), object-fit cover; teks kolom gap 4: kategori 13px/700 `--color-accent` letter-spacing 0.3px · judul 17px/700 lh 1.35 · ringkasan 16px `--color-text-muted` lh 1.5, **maks. 2 baris** (`line-clamp`) · meta "12 Okt 2026 · 4 menit baca" 14px muted. **Vertical (desktop):** kolom gap 16; foto lebar penuh tinggi 232 radius 14; teks gap 8: kategori · judul Heading 22px lh 1.2 · ringkasan 16px muted · meta 14px. Tanpa bayangan, tanpa kotak. Foto kosong: kotak `--color-border` + ikon `image` 28px (horizontal) atau 36px (vertical) `--color-icon-muted`. |
| **TipBox.astro** | Kolom gap 6, padding 18px 20px, latar `--color-bg-subtle`, `border-left: 4px solid var(--color-rating)`, radius `0 10px 10px 0`. Label "Tips" 16px/700; isi 18px lh 1.7. Disembunyikan jika isinya placeholder. Pakai `<aside>`. |
| **ComparisonTable.astro** | Pembungkus `div` dengan `overflow-x: auto`, `tabindex="0"`, `role="region"`, `aria-label="Tabel perbandingan, geser ke samping"`. Tabel `min-width: 560px` (mobile), di desktop lebar penuh 680; latar `--color-surface`, garis 1px, radius 12, overflow hidden. Baris kepala latar `--color-bg-subtle`. Garis bawah 1px antarbaris (baris terakhir tanpa garis). Sel: padding 12px 14px, 16px lh 1.5, rata atas. Kolom label 150px, 700; sel kepala 700. Di bawah tabel (mobile/tablet saja): "Geser tabel ke samping" 14px muted + ikon `arrow-right` 16px, gap 4. |
| **Figure.astro** | `<figure>` gap 8; gambar radius 12, tinggi 220 (mobile) / 400 (desktop), object-fit cover; `<figcaption>` 14px muted. |
| **RelatedMenu.astro** | Kotak: latar `--color-surface`, garis 1px, radius 14, padding 20px 16px 6px, gap 4. Judul "Menu di Artikel Ini" Heading 22px lh 1.2. Isi: daftar `MenuItem` (komponen yang sudah ada, dengan tombol +) dari slug `relatedMenu`; item terakhir tanpa garis bawah. Tombol + terhubung ke keranjang yang sama. |
| **OrderCta.astro** | Kotak: latar `--color-bg-subtle`, garis 1px, radius 14, padding 24, gap 12. Judul "Mau coba?" Heading 28px lh 1.1, letter-spacing −0.4px. Teks "Pesan langsung lewat WhatsApp, kami siapkan pesanan Anda." 17px. Tombol **primary kuning** lebar otomatis dengan ikon WhatsApp: "Chat WhatsApp" → `greetingLink` (diberi jarak atas 4px). |
| **TableOfContents.astro** | Dibuat dari daftar H2 artikel (`headings` depth 2) ditambah "Sumber" bila ada. Kotak: latar `--color-surface`, garis 1px, radius 12. Kepala (`<summary>`): tinggi 56, padding 0 16, gap 8: "Daftar Isi" 17px/700 + "· {n} bagian" 14px muted + ikon `caret-down` 22px di kanan (diputar saat terbuka). Isi: padding 6px 16px 10px, garis atas 1px; setiap item adalah link anchor, flex gap 12, padding 10px 0 10px 12px, `border-left: 2px solid var(--color-border)`; nomor 16px/600 muted; teks 16px lh 1.5. **Item aktif:** garis kiri `--color-ink`, teks 700, nomor `--color-text`. **Mobile:** `<details>` tertutup secara default. **Desktop:** selalu terbuka (summary tidak bisa diklik/ikon disembunyikan), lebar 260, `position: sticky; top: calc(var(--header-height) + 24px)`; item aktif mengikuti scroll lewat `IntersectionObserver` (progressive enhancement). |
| **CategoryCard.astro** | `<a>` ke halaman kategori. Kolom gap 10; foto radius 12, tinggi 150 (mobile, kartu lebar 200) / 260 (desktop); baris bawah: kiri = nama 17px/700 lh 1.4 + "Mulai Rp13.000" 16px muted; kanan = ikon `arrow-right` 22px `--color-text`. |
| **OrderSteps.astro** | Tiga langkah: "Pilih menu dan tekan + Tambah" · "Tekan Kirim Pesanan" · "Pesanan dikirim ke WhatsApp kami dan segera disiapkan". Satu langkah: flex gap 14, rata atas; lingkaran 40×40 latar `--color-ink` dengan angka Heading 20px `--color-on-ink`; teks 17px/600 lh 1.4 (padding atas 7px). `<ol>`. **Mobile:** bertumpuk gap 20. **Desktop:** 3 kolom sama lebar gap 32; setiap kolom diberi garis atas 1px dan padding atas 24. |
| **EmptyState.astro** | Kolom rata tengah, gap 12, padding 40px 24px, garis 1px, radius 14. Teks "Belum ada artikel di kategori ini." 17px/600 rata tengah; link/tombol teks "Lihat semua artikel" 16px/600 `--color-accent` bergaris bawah (mengembalikan filter ke "Semua"). |
| **ShareButtons.astro** | Label "Bagikan artikel ini" 14px/700. Dua tombol outline (komponen `Button` varian outline): "Bagikan ke WhatsApp" (ikon `whatsapp-logo` hijau WA) → `https://wa.me/?text=` + encode(judul + " " + URL); "Salin link" (ikon `link-simple` `--color-text`) → `navigator.clipboard.writeText(url)`, lalu label berubah sementara jadi "Link disalin" (umumkan lewat `aria-live="polite"`). **Mobile:** bertumpuk, lebar penuh, gap 12. **Desktop:** satu baris, label + 2 tombol lebar otomatis, gap 12. |

Ikon Phosphor baru yang dipakai: `caret-down`, `caret-right`, `arrow-right`, `link-simple`, `image`, `x`.

---

## 6. Halaman kategori: `src/pages/menu/[slug].astro`

`getStaticPaths` dari `categoryPages`. Header `current="menu"`. Halaman memuat `OrderBar`, `OrderSheet`,
`QtyStepperTemplate`, dan script `cart` seperti `index.astro`.

### 6.1 Urutan section
1. **Kepala halaman**: breadcrumb "Beranda / Menu / {name}" (Menu → `/#menu`), foto, H1, pengantar, info.
2. **Pilihan menu**: pita kategori (komponen pita yang sama dengan Menu Lengkap) berjudul `ribbonTitle`
   dengan jumlah "{n} menu" dan **tanpa** link "Lihat detail", lalu daftar `MenuItem`. Untuk `jus-buah`:
   dua pita (Jus Original, Jus Mix), masing-masing dengan daftarnya sendiri.
3. **"Isi {Nama} Kami"**: 3 foto dekat dan paragraf (paragraf disembunyikan bila placeholder; caption
   "Foto: potongan buah, kuah alpukat, dan sop buah siap diambil." hanya untuk sop buah).
4. **"Cara Pesan"**: `OrderSteps`.
5. **"Tanya Jawab"**: `FaqAccordion` (seluruh section disembunyikan bila tidak ada jawaban yang terisi).
6. **"Menu Lainnya"**: 3 `CategoryCard` ke kategori lain (selain halaman ini).
7. Footer; bar pesanan menempel di bawah (mobile/tablet), panel pesanan di kanan (desktop).

### 6.2 Mobile (acuan `v0bAR`, `g3jdzN`)
| Section | Latar | Padding | Isi |
|---|---|---|---|
| Kepala | `--color-bg` | 4px 16px 32px, gap 16 | Breadcrumb · foto lebar penuh tinggi 240 radius 14 · blok teks (padding atas 8, gap 12): H1 `--text-display` · pengantar `--text-body-lg` · info 14px/600 muted |
| Pilihan menu | `--color-bg` | 0 16px 32px, gap 4 | Pita + daftar menu (item terakhir tanpa garis) |
| Isi … Kami | `--color-bg-subtle` | 32px 16px, gap 16 | H2 `--text-h2` · baris foto (gap 8): foto besar tinggi 200 (lebar setengah) + kolom 2 foto @96 (gap 8), semua radius 12 · paragraf 17px · caption 14px muted |
| Cara Pesan | `--color-bg` | 32px 16px, gap 20 | H2 + 3 langkah bertumpuk |
| Tanya Jawab | `--color-bg-subtle` | 32px 16px, gap 8 | H2 + accordion |
| Menu Lainnya | `--color-bg` | 32px 0 40px, gap 16 | Kepala (padding 0 16, space-between, rata bawah): H2 + "Geser" 15px/500 muted + `arrow-right` 16 · baris kartu geser horizontal (`overflow-x: auto`, `scroll-snap`), padding 0 16, gap 12, kartu lebar 200 |
| Footer | seperti sekarang | padding bawah tetap memberi ruang untuk bar pesanan | |

Keadaan "FAQ terbuka + 2 item di keranjang" (frame `g3jdzN`) bukan halaman terpisah, melainkan hasil
interaksi: baris menu menampilkan stepper, bar pesanan menampilkan "2 item · Rp23.000" dan tombol Kirim Pesanan.

### 6.3 Desktop (acuan `a8ZDx`)
| Section | Latar | Padding | Isi |
|---|---|---|---|
| Kepala | `--color-bg` | 16px gutter 56px, gap 24 | Breadcrumb · baris (gap 64, rata tengah): teks (sisa lebar, gap 20: H1 58px · pengantar 20px · info 15px/600 muted) + foto 560×400 radius 14 |
| Pilihan menu + panel | `--color-bg` | 0 gutter 80px | Flex gap 40, rata atas: kiri = pita (dengan jumlah menu) + daftar **2 kolom** gap 32 (pola yang sama dengan Menu Lengkap); kanan = **panel pesanan 360px yang sama persis dengan halaman utama**: pakai ulang `<OrderSummary variant="panel" />` beserta pembungkus sticky-nya seperti di `MenuSection.astro` |
| Isi … Kami | `--color-bg-subtle` | 80px gutter | Baris gap 64 rata tengah: blok foto 680×420 (foto besar mengisi sisa + kolom 240 berisi 2 foto sama tinggi, gap 12, radius 14) + teks (gap 20: H2 40px · paragraf 20px · caption 14px) |
| Cara Pesan | `--color-bg` | 80px gutter, gap 32 | H2 + 3 kolom |
| Tanya Jawab | `--color-bg-subtle` | 80px gutter | Baris gap 64: judul (lebar 360) + daftar accordion (sisa lebar) |
| Menu Lainnya | `--color-bg` | 80px gutter, gap 32 | H2 + 3 kartu sama lebar gap 32, foto tinggi 260 |

### 6.4 Potongan foto dekat (sementara)
Tiga elemen `<img>` dari sumber yang sama dengan `object-fit: cover` dan potongan berbeda:
foto 1 "potongan buah" `object-position: 50% 45%` + `scale(2.6)`; foto 2 "kuah" `40% 55%` + `scale(4)`;
foto 3 "penyajian" `55% 55%` + `scale(1.6)`. Bungkus dengan `overflow: hidden` dan radius.
Ini hanya placeholder sampai ada foto asli.

---

## 7. Daftar artikel: `src/pages/artikel/index.astro`

Header `current="artikel"`. Memuat `OrderBar`/`OrderSheet`/cart (bar pesanan tetap ada di mobile).
- `<title>`: "Artikel Jus Tugu – Cerita Seputar Buah dan Menu". Description = kalimat pengantar.
- Artikel diurutkan dari tanggal terbaru dan hanya yang `draft: false`.

**Filter:** chip "Semua", "Menu", "Tips Buah" memakai gaya chip yang sudah ada (tinggi 44, radius penuh).
Chip aktif: latar dan garis `--color-accent`, teks `--color-on-accent`. Chip adalah `<button aria-pressed>`.
Filter berjalan di sisi klien lewat `data-category` pada setiap kartu; kategori aktif disimpan di
`?kategori=menu|tips-buah` (bisa dibagikan). Tanpa JS, semua artikel tampil. Bila hasil kosong, tampilkan
`EmptyState` (tombolnya mengembalikan filter ke "Semua").

**Mobile (`hqHRs`, `iVTke`):**
- Kepala: padding 4px 16px 8px, gap 12 → breadcrumb "Beranda / Artikel" · H1 "Artikel Jus Tugu" ·
  pengantar 17px "Cerita seputar buah, menu, dan cara kami menyiapkannya."
- Baris filter: padding 12px 16px, gap 8, garis bawah 1px.
- Daftar: padding 4px 16px 40px, `ArticleCard` horizontal.
- Empty state: padding 24px 16px.

**Desktop (`THhcM`):**
- Kepala: padding 16px gutter 0, gap 16 → breadcrumb · baris space-between rata bawah, padding bawah 24,
  garis bawah 1px: kiri teks (lebar 640, gap 12: H1 58px + pengantar 20px), kanan chip filter.
- Daftar: padding 40px gutter 80px, gap 56:
  - **Artikel terbaru (sorotan):** baris gap 48 rata tengah: foto 680×400 radius 14 + teks (gap 12):
    label "{Kategori} · Terbaru" 13px/700 accent · judul Heading 40px lh 1.1 · ringkasan 18px muted · meta 14px.
  - **Grid 3 kolom** gap 32 untuk sisa artikel (`ArticleCard` vertical).
  - Saat filter aktif, sorotan dibatalkan dan semua hasil tampil di grid.

---

## 8. Detail artikel: `src/pages/artikel/[slug].astro`

Header `current="artikel"`. `<title>` = `"{title} | Jus Tugu"`; description = `description`.
Meta OG memakai cover. JSON-LD: `Article` (headline, datePublished, image, author: Person bila nama bukan
placeholder, selain itu Organization "Jus Tugu", publisher Jus Tugu) dan `BreadcrumbList`.

### 8.1 Urutan
1. Breadcrumb "Beranda / Artikel / {judul pendek}". Untuk artikel 1: "Beda Salad Buah dan Sop Buah".
   Tambahkan field opsional `shortTitle` di skema.
2. Label kategori (13px/700 accent, letter-spacing 0.3px) → H1 → meta
   "Oleh {author}, Jus Tugu · {tanggal} · {n} menit baca" (14px muted; bagian "Oleh …" disembunyikan bila
   author masih placeholder).
3. Foto utama + caption.
4. Daftar Isi.
5. Isi MDX.
6. `RelatedMenu` → `OrderCta` → **Sumber** (hanya bila `sources` terisi) → `ShareButtons`.
7. "Artikel Lainnya": 3 artikel lain terbaru (tanpa artikel ini). Bila belum ada, section disembunyikan.
8. Footer (latar `--color-bg` + garis atas, **bukan** bg-subtle, karena section sebelumnya sudah bg-subtle).
   Bar pesanan di mobile.

### 8.2 Tipografi isi artikel (kenyamanan baca di HP adalah prioritas)
- Kolom isi **maks. 680px**.
- Paragraf, butir daftar, dan isi tips: **18px, line-height 1.7**, `--color-text`.
- Jarak antarblok utama (TOC, pembuka, setiap bagian H2, blok menu, CTA, sumber, bagikan): **40px**.
  Di dalam satu bagian (H2 → paragraf → tabel/daftar): **16px**.
- H2: Heading 28px, lh 1.15, letter-spacing −0.4px (sama di mobile dan desktop). H2 punya `id` untuk anchor TOC
  dan `scroll-margin-top: calc(var(--header-height) + 16px)`.
- H3: Heading 22px lh 1.2; grup H3 diberi padding atas 8, jarak ke daftar 12.
- Daftar berbutir: titik bulat 7px `--color-ink` (custom marker, sejajar baris pertama), jarak titik–teks 12,
  jarak antarbutir 8.
- Caption: 14px `--color-text-muted`.
- **Sumber:** padding atas 20 dengan garis atas 1px; judul "Sumber" 14px/700; setiap entri 14px muted,
  bernomor ("1. …"), bergaris bawah bila punya URL (`target="_blank" rel="noopener"`).

### 8.3 Mobile (`T9YM8`, `qet6M`)
- Kepala: padding 4px 16px 24px, gap 12.
- Foto utama **full-bleed** (lebar layar, tanpa radius), tinggi 260; caption padding 0 16, jarak 8.
- Isi: padding 24px 16px 40px. Daftar Isi tertutup secara default (frame `qet6M` = keadaan setelah diketuk).
- Tabel bisa digeser horizontal di dalam wadahnya, dengan petunjuk di bawahnya.
- Foto tengah tinggi 220 radius 12.
- Bagikan: tombol bertumpuk lebar penuh.
- Artikel Lainnya: latar `--color-bg-subtle`, padding 32px 16px, gap 4, H2 28px + 3 `ArticleCard` horizontal.

### 8.4 Desktop (`UvNbh`)
- Kepala: padding 16px 220px 32px (blok lebar 1000px di tengah), gap 16 → breadcrumb · blok judul
  (padding atas 16, gap 16): label · H1 58px (lebar maks. 1000, sekitar 2 baris) · meta 15px satu baris.
- Foto utama: padding 0 220px 48px, foto lebar 1000 tinggi 540 radius 14, caption 14px (jarak 10).
- Badan: padding 0 220px 80px, flex gap 60 rata atas: **Daftar Isi sticky 260px** di kiri + **isi 680px**.
- Tabel lebar penuh 680 tanpa petunjuk geser. Foto tengah tinggi 400.
- Bagikan: satu baris.
- Artikel Lainnya: latar `--color-bg-subtle`, padding 80px gutter, gap 32: H2 40px + grid 3 `ArticleCard` vertical.
- **Asumsi (tidak ada di desain):** halaman artikel desktop tidak punya panel pesanan, jadi `OrderBar`
  **tetap tampil di desktop** pada halaman artikel (konten bar dibatasi 1200px di tengah). Dengan begitu
  tombol + di "Menu di Artikel Ini" tetap memberi umpan balik dan pesanan bisa dikirim.

---

## 9. Perilaku placeholder
Gunakan `isPlaceholder()` dari `src/data/site.ts`. Aturan:
- Jawaban FAQ `[Jawaban]` → item tidak dirender; jika semua kosong, section "Tanya Jawab" disembunyikan.
- `detailText` placeholder → paragraf disembunyikan, foto tetap tampil.
- `TipBox` dengan isi placeholder → tidak dirender.
- `author` placeholder → bagian "Oleh …" disembunyikan dari meta dan JSON-LD memakai Organization.
- `sources` yang semua labelnya placeholder → section Sumber disembunyikan; TOC tidak mencantumkan "Sumber".
- Tambahkan semua placeholder baru ke tabel di `README.md` (bagian "Mengubah data"), beserta cara menulis
  artikel baru di `src/content/artikel/`.

---

## 10. Aksesibilitas & kualitas
- Satu `<h1>` per halaman; urutan heading tidak melompat.
- Area sentuh minimal 48px untuk link dan tombol (link footer 40px tinggi baris masih diterima,
  seperti di desain).
- Fokus keyboard terlihat (pakai gaya fokus yang sudah ada).
- Semua `<img>` memakai `astro:assets` (`<Image>`/`<Picture>`) dengan `alt` bermakna dan ukuran yang benar;
  foto di bawah lipatan diberi `loading="lazy"`.
- Tidak ada pergeseran layout saat font dimuat (font sudah di-preload).
- Kontras teks memenuhi WCAG AA (palet yang ada sudah memenuhinya; jangan memakai kuning sebagai warna teks).

---

## 11. Yang TIDAK boleh berubah
- Palet warna, skala ukuran huruf, jarak, sudut, dan bayangan.
- Logika `cart.ts`, isi dan format pesan WhatsApp, `OrderSheet`, form Kritik & Saran.
- Section halaman utama selain Header, pita Menu Lengkap, dan Footer.
- `og-image.jpg`, `site.webmanifest`, `themeColor`.
- Perubahan yang belum di-commit milik pemilik di `src/data/site.ts` dan `public/robots.txt`.

---

## 12. Urutan kerja & kriteria selesai

Kerjakan per tahap. Setiap tahap harus lulus `npm run build` sebelum lanjut:
1. Font Outfit (§1) → cek halaman utama: tidak ada teks yang terpotong atau meluber.
2. Favicon (§2).
3. Header, pita, dan footer halaman utama (§3).
4. Data dan komponen baru (§4–5).
5. Halaman kategori (§6) untuk 4 slug.
6. Daftar dan detail artikel (§7–8).
7. README (§9).

**Checklist penerimaan (cek di lebar 390px dan 1440px):**
- [ ] Semua teks memakai Outfit; Bricolage dan Plus Jakarta Sans sudah tidak dimuat sama sekali (cek tab Network).
- [ ] Favicon tugu pasir tampil di tab browser; PNG 48/180/512 sudah diperbarui.
- [ ] Header punya link Artikel (desktop dan menu mobile); link Menu/Lokasi/Saran berfungsi dari halaman lain.
- [ ] Pita Menu Lengkap: "Lihat detail →" menuju halaman yang benar; Minuman Lain tanpa link; di mobile tidak ada teks yang bertumpuk.
- [ ] Footer punya kolom Menu dan Info di mobile dan desktop.
- [ ] `/menu/sop-buah`, `/menu/salad-buah`, `/menu/jus-buah`, `/menu/jus-yakult` ter-build; harga dan jumlah sesuai `menu.ts`.
- [ ] Menambah item di halaman kategori → jumlahnya ikut di bar pesanan; pindah ke halaman utama, keranjang tetap sama.
- [ ] FAQ bisa dibuka/ditutup dengan keyboard dan tanpa JS; item placeholder tidak tampil.
- [ ] `/artikel`: filter berfungsi, URL `?kategori=` ikut berubah, empty state muncul untuk kategori tanpa hasil, draft tidak tampil.
- [ ] Detail artikel: teks isi 18px/1.7, kolom ≤ 680px, TOC tertutup di mobile dan sticky dengan item aktif di desktop, tabel bisa digeser di mobile, Salin link berfungsi.
- [ ] JSON-LD `BreadcrumbList`, `FAQPage` (hanya bila ada jawaban), dan `Article` valid (uji di validator schema.org).
- [ ] Sitemap memuat halaman kategori dan artikel non-draft.
- [ ] `npm run build` lulus tanpa error dan tanpa peringatan baru dari `astro check`.

---

## 13. Asumsi yang dipakai (ubah bila pemilik memutuskan lain)
1. Pemetaan kategori seperti §4.1 (Jus Buah = Jus Original + Jus Mix; Minuman Lain tanpa halaman).
2. Placeholder disembunyikan otomatis, tidak ditampilkan apa adanya.
3. Hanya artikel 1 yang terbit; artikel 2–4 berstatus draft.
4. Foto dekat "Isi … Kami" sementara berupa potongan foto header.
5. `themeColor` tetap `#FFDD00`.
6. Di desktop, halaman artikel menampilkan bar pesanan di bawah layar (lihat §8.4).
