/**
 * Data usaha Jus Tugu — satu-satunya sumber untuk header, footer, lokasi,
 * JSON-LD, dan tautan WhatsApp. Ganti semua nilai bertanda TODO.
 */

export interface OpeningHours {
  /** Nama hari dalam bahasa Indonesia, untuk tabel jam buka. */
  label: string;
  /** Nama hari schema.org (Monday … Sunday). */
  dayOfWeek: string;
  /** Format 24 jam "HH:MM", atau null jika tutup. */
  opens: string | null;
  closes: string | null;
}

const OPENING_HOURS_PLACEHOLDER = '[OPENING_HOURS]';

export const site = {
  name: 'Jus Tugu',
  // TODO: [SITE_URL] — domain asli, tanpa garis miring di akhir (contoh: https://justugu.com)
  url: 'https://example.com',
  // TODO: [WA_NUMBER] — format 62, tanpa + atau 0 di depan (contoh: 6281234567890)
  waNumber: '[WA_NUMBER]',
  address: {
    // TODO: [FULL_ADDRESS] — nama jalan / dusun / RT RW
    street: '[FULL_ADDRESS]',
    locality: 'Senggreng',
    district: 'Sumberpucung',
    regency: 'Kab. Malang',
    region: 'Jawa Timur',
    // TODO: [POSTAL_CODE]
    postalCode: '[POSTAL_CODE]',
    country: 'ID',
  },
  // TODO: [LANDMARK] — patokan yang mudah dikenali (contoh: "Depan balai desa")
  landmark: '[LANDMARK]',
  // TODO: [COORDINATES] — salin dari Google Maps (klik kanan pada titik lokasi)
  geo: { lat: null as number | null, lng: null as number | null },
  // TODO: [OPENING_HOURS] — isi jam buka per hari, format "HH:MM"; null = tutup
  openingHours: [
    { label: 'Senin', dayOfWeek: 'Monday', opens: null, closes: null },
    { label: 'Selasa', dayOfWeek: 'Tuesday', opens: null, closes: null },
    { label: 'Rabu', dayOfWeek: 'Wednesday', opens: null, closes: null },
    { label: 'Kamis', dayOfWeek: 'Thursday', opens: null, closes: null },
    { label: 'Jumat', dayOfWeek: 'Friday', opens: null, closes: null },
    { label: 'Sabtu', dayOfWeek: 'Saturday', opens: null, closes: null },
    { label: 'Minggu', dayOfWeek: 'Sunday', opens: null, closes: null },
  ] as OpeningHours[],
  // TODO: [OPENING_HOURS] — ringkasan untuk hero, contoh "setiap hari 09.00–21.00"
  openingHoursSummary: OPENING_HOURS_PLACEHOLDER,
  access: 'Mudah dijangkau dari Kepanjen dan Kromengan.',
  social: {
    // TODO: [INSTAGRAM_URL]
    instagram: '[INSTAGRAM_URL]',
    // TODO: [FACEBOOK_URL]
    facebook: '[FACEBOOK_URL]',
    // TODO: [GOFOOD_URL]
    gofood: '[GOFOOD_URL]',
  },
  // TODO: [APPS_SCRIPT_URL] — URL Web App Google Apps Script (lihat README)
  appsScriptUrl: '[APPS_SCRIPT_URL]',
  themeColor: '#FFDD00',
  servesCuisine: ['Jus buah', 'Sop buah', 'Salad buah', 'Minuman'],
} as const;

/** True jika nilai masih berupa placeholder "[...]" atau kosong. */
export function isPlaceholder(value: string | null | undefined): boolean {
  return !value || /^\[.*\]$/.test(value.trim());
}

/** URL valid (bukan placeholder) atau undefined. */
export function realUrl(value: string): string | undefined {
  return isPlaceholder(value) ? undefined : value;
}

/** False selama jam buka belum diisi (semua hari masih null). */
export const hoursConfigured = site.openingHours.some((h) => h.opens !== null);

export function hoursText(h: OpeningHours): string {
  if (!hoursConfigured) return OPENING_HOURS_PLACEHOLDER;
  if (h.opens && h.closes) return `${h.opens.replace(':', '.')}–${h.closes.replace(':', '.')}`;
  return 'Tutup';
}

export const fullAddress = `${site.address.street}, Desa ${site.address.locality}, Kec. ${site.address.district}, ${site.address.regency}, ${site.address.region}`;
export const shortAddress = `${site.address.street}, ${site.address.locality}, ${site.address.district}, ${site.address.regency}`;

const mapsQuery =
  site.geo.lat !== null && site.geo.lng !== null
    ? `${site.geo.lat},${site.geo.lng}`
    : `Jus Tugu, ${site.address.locality}, ${site.address.district}, Malang`;

/** Membuka Google Maps dengan rute ke lokasi. */
export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapsQuery)}`;
/** URL iframe peta (tanpa API key). */
export const mapsEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&z=16&output=embed`;
