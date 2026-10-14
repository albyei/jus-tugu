/**
 * Ikon Phosphor sebagai satu sprite SVG. <Icon> mencatat ikon yang dipakai,
 * <IconSprite> (di akhir <body>) menulis <symbol> untuk ikon-ikon itu saja.
 */
export type IconWeight = 'regular' | 'bold' | 'fill';

const files = import.meta.glob<string>('/node_modules/@phosphor-icons/core/assets/{regular,bold,fill}/*.svg', {
  query: '?raw',
  import: 'default',
  eager: true,
});

const used = new Set<string>();

export function iconId(name: string, weight: IconWeight): string {
  return `i-${weight}-${name}`;
}

function source(name: string, weight: IconWeight): string {
  const file = weight === 'regular' ? `${name}.svg` : `${name}-${weight}.svg`;
  const raw = files[`/node_modules/@phosphor-icons/core/assets/${weight}/${file}`];
  if (!raw) throw new Error(`Ikon tidak ditemukan: ${weight}/${name}`);
  return raw;
}

export function useIcon(name: string, weight: IconWeight): string {
  source(name, weight);
  used.add(`${weight}:${name}`);
  return iconId(name, weight);
}

/** Mengembalikan <symbol> untuk semua ikon yang dipakai, lalu mengosongkan daftar. */
export function takeSymbols(): string {
  const symbols = Array.from(used, (key) => {
    const [weight, name] = key.split(':') as [IconWeight, string];
    const raw = source(name, weight);
    const viewBox = raw.match(/viewBox="([^"]+)"/)?.[1] ?? '0 0 256 256';
    const inner = raw.replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    return `<symbol id="${iconId(name, weight)}" viewBox="${viewBox}">${inner}</symbol>`;
  });
  used.clear();
  return symbols.join('');
}
