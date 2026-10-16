const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

/** 7000 → "Rp7.000" */
export function formatRupiah(value: number): string {
  return rupiah.format(value).replace(/\s/g, '');
}

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

/** Date → "12 Okt 2026" (zona waktu UTC agar tanggal frontmatter tidak bergeser). */
export function formatTanggal(date: Date): string {
  return `${date.getUTCDate()} ${BULAN[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}
