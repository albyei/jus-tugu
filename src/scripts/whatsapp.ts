/**
 * Pembuat tautan & pesan WhatsApp. Dipakai saat build (href cadangan)
 * dan di browser (pesan keranjang).
 */
import { site } from '../data/site';
import { formatRupiah } from '../lib/format';

export const GREETING_MESSAGE = 'Halo Jus Tugu, saya mau tanya menu.';

export interface OrderLine {
  name: string;
  qty: number;
  price: number;
}

/** Nomor dalam format 62, tanpa "+" atau 0 di depan. */
function normalizeNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  return digits;
}

/** https://wa.me/62xxxx?text=... (tanpa nomor jika belum diisi, WhatsApp akan meminta memilih kontak). */
export function waLink(text: string, number: string = site.waNumber): string {
  return `https://wa.me/${normalizeNumber(number)}?text=${encodeURIComponent(text)}`;
}

export function buildOrderMessage(lines: OrderLine[], notes = ''): string {
  const total = lines.reduce((sum, line) => sum + line.qty * line.price, 0);
  const rows = [
    'Halo Jus Tugu, saya mau pesan:',
    ...lines.map((line) => `- ${line.qty}x ${line.name} (${formatRupiah(line.qty * line.price)})`),
    `Total: ${formatRupiah(total)}`,
  ];
  const trimmed = notes.trim();
  if (trimmed) rows.push(`Catatan: ${trimmed}`);
  return rows.join('\n');
}

export const greetingLink = waLink(GREETING_MESSAGE);
