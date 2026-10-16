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
  // Domain sementara (alternatif: https://jus-tugu.my.id). Ganti juga di public/robots.txt.
  url: 'https://jus-tugu.web.id',
  // Format 62, tanpa + atau 0 di depan
  waNumber: '6281385040111',
  address: {
    street: 'Jl. Raya Senggreng, RT.01/RW.01, Dsn. Krajan',
    locality: 'Senggreng',
    district: 'Sumberpucung',
    regency: 'Kab. Malang',
    region: 'Jawa Timur',
    postalCode: '65165',
    country: 'ID',
  },
  landmark: 'Pinggir Jl. Raya Senggreng, Sumberpucung',
  geo: { lat: -8.156053 as number | null, lng: 112.517065 as number | null },
  // Format "HH:MM"; null = tutup
  openingHours: [
    { label: 'Senin', dayOfWeek: 'Monday', opens: '12:00', closes: '21:00' },
    { label: 'Selasa', dayOfWeek: 'Tuesday', opens: '12:00', closes: '21:00' },
    { label: 'Rabu', dayOfWeek: 'Wednesday', opens: '12:00', closes: '21:00' },
    { label: 'Kamis', dayOfWeek: 'Thursday', opens: '12:00', closes: '21:00' },
    { label: 'Jumat', dayOfWeek: 'Friday', opens: '12:00', closes: '21:00' },
    { label: 'Sabtu', dayOfWeek: 'Saturday', opens: '12:00', closes: '21:00' },
    { label: 'Minggu', dayOfWeek: 'Sunday', opens: '12:00', closes: '21:00' },
  ] as OpeningHours[],
  // Ringkasan untuk hero
  openingHoursSummary: 'setiap hari 12.00–21.00',
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
  appsScriptUrl: 'https://script.google.com/macros/s/AKfycbxxNFs_J5M2hKAQi0g5_2eIs666MzvRFH_YEEMWtPjHLqOpe2v7xMONHqTt7Y7UxMtAIA/exec',
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
/** URL iframe peta (tanpa API key), dari menu "Sematkan peta" Google Maps. */
export const mapsEmbedUrl =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000.1635646460267!2d112.51706537897988!3d-8.156053076889966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7898b6b0b6f40d%3A0x6e4edc7e90545613!2sRGV8%2BGXG%2C%20Krajan%20Senggreng%2C%20Senggreng%2C%20Kec.%20Sumberpucung%2C%20Kabupaten%20Malang%2C%20Jawa%20Timur%2065165!5e0!3m2!1sid!2sid!4v1791944709356!5m2!1sid!2sid';
