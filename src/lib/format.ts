const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });

/** 7000 → "Rp7.000" */
export function formatRupiah(value: number): string {
  return rupiah.format(value).replace(/\s/g, '');
}
