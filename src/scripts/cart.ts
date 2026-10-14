/**
 * Keranjang belanja: satu sumber status untuk kartu Best Seller, daftar menu,
 * bottom sheet, panel desktop, dan bar pesanan. Disimpan di localStorage.
 */
import { formatRupiah } from '../lib/format';
import { buildOrderMessage, greetingLink, waLink, type OrderLine } from './whatsapp';

interface ItemData {
  name: string;
  price: number;
}

const STORAGE_KEY = 'justugu-cart-v1';

const dataEl = document.getElementById('cart-data');
const catalog: Record<string, ItemData> = dataEl ? JSON.parse(dataEl.textContent || '{}') : {};

const cart = new Map<string, number>();
let notes = '';

function load(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw) as { items?: Record<string, number>; notes?: string };
    for (const [slug, qty] of Object.entries(saved.items ?? {})) {
      if (catalog[slug] && Number.isInteger(qty) && qty > 0) cart.set(slug, Math.min(qty, 99));
    }
    notes = typeof saved.notes === 'string' ? saved.notes : '';
  } catch {
    /* localStorage tidak tersedia atau rusak — mulai dari kosong */
  }
}

function save(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: Object.fromEntries(cart), notes }));
  } catch {
    /* abaikan (mode privat, kuota penuh) */
  }
}

function lines(): OrderLine[] {
  return Array.from(cart, ([slug, qty]) => ({ name: catalog[slug].name, price: catalog[slug].price, qty }));
}

function setQty(slug: string, qty: number): void {
  if (!catalog[slug]) return;
  if (qty <= 0) cart.delete(slug);
  else cart.set(slug, Math.min(qty, 99));
  save();
  render();
}

/* ---------- Render ---------- */

const template = document.getElementById('cart-line-template') as HTMLTemplateElement | null;
const sheet = document.querySelector<HTMLDialogElement>('[data-order-sheet]');

function updateOrderLinks(current: OrderLine[]): void {
  const href = current.length ? waLink(buildOrderMessage(current, notes)) : greetingLink;
  document.querySelectorAll<HTMLAnchorElement>('[data-wa-order]').forEach((link) => {
    link.href = href;
  });
}

const stepperTemplate = document.getElementById('qty-stepper-template') as HTMLTemplateElement | null;

/** Stepper dibuat saat item pertama kali ditambahkan (menghemat HTML awal). */
function ensureStepper(control: HTMLElement): HTMLElement | null {
  const existing = control.querySelector<HTMLElement>('.qty__stepper');
  if (existing || !stepperTemplate) return existing;
  const stepper = stepperTemplate.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const name = control.dataset.name ?? '';
  stepper.setAttribute('aria-label', `Jumlah ${name}`);
  stepper.querySelector('[data-action="dec"]')!.setAttribute('aria-label', `Kurangi ${name}`);
  stepper.querySelector('[data-action="inc"]')!.setAttribute('aria-label', `Tambah satu ${name}`);
  control.append(stepper);
  return stepper;
}

function renderLine(slug: string, qty: number): HTMLElement | null {
  if (!template) return null;
  const node = template.content.firstElementChild?.cloneNode(true) as HTMLElement;
  const { name, price } = catalog[slug];
  node.dataset.slug = slug;
  node.querySelector('[data-line-name]')!.textContent = name;
  node.querySelector('[data-line-sub]')!.textContent = `${qty} × ${formatRupiah(price)} = ${formatRupiah(qty * price)}`;
  node.querySelector('[data-line-count]')!.textContent = String(qty);
  node.querySelector('[data-line-group]')!.setAttribute('aria-label', `Jumlah ${name}`);
  const dec = node.querySelector<HTMLElement>('[data-line-action="dec"]')!;
  dec.setAttribute('aria-label', qty === 1 ? `Hapus ${name}` : `Kurangi ${name}`);
  dec.querySelector<HTMLElement>('[data-icon-minus]')!.hidden = qty === 1;
  dec.querySelector<HTMLElement>('[data-icon-trash]')!.hidden = qty !== 1;
  node.querySelector('[data-line-action="inc"]')!.setAttribute('aria-label', `Tambah satu ${name}`);
  return node;
}

function render(): void {
  const current = lines();
  const count = current.reduce((sum, line) => sum + line.qty, 0);
  const total = current.reduce((sum, line) => sum + line.qty * line.price, 0);

  // Tombol tambah / stepper di kartu dan daftar menu
  document.querySelectorAll<HTMLElement>('[data-qty-control]').forEach((control) => {
    const qty = cart.get(control.dataset.slug ?? '') ?? 0;
    control.querySelector<HTMLElement>('[data-action="add"]')!.hidden = qty > 0;
    const stepper = qty > 0 ? ensureStepper(control) : control.querySelector<HTMLElement>('.qty__stepper');
    if (stepper) {
      stepper.hidden = qty === 0;
      stepper.querySelector('[data-qty-count]')!.textContent = String(qty);
    }
  });

  // Ringkasan (sheet + panel); pertahankan fokus tombol baris
  const active = document.activeElement as HTMLElement | null;
  const activeLine = active?.closest<HTMLElement>('.line');
  const focusTarget = activeLine
    ? { summary: activeLine.closest('[data-order-summary]'), slug: activeLine.dataset.slug, action: active?.dataset.lineAction }
    : null;

  document.querySelectorAll<HTMLElement>('[data-order-summary]').forEach((summary) => {
    const list = summary.querySelector<HTMLElement>('[data-cart-list]');
    if (list) {
      const nodes = Array.from(cart, ([slug, qty]) => renderLine(slug, qty));
      list.replaceChildren(...nodes.filter((node): node is HTMLElement => node !== null));
    }
    summary.querySelector('[data-cart-count]')!.textContent = String(count);
    summary.querySelector('[data-cart-total]')!.textContent = formatRupiah(total);
    summary.querySelector<HTMLElement>('[data-cart-filled]')!.hidden = count === 0;
    const emptyState = summary.querySelector<HTMLElement>('[data-cart-empty]');
    if (emptyState) emptyState.hidden = count > 0;
    const notesField = summary.querySelector<HTMLTextAreaElement>('[data-cart-notes]');
    if (notesField && notesField !== document.activeElement) notesField.value = notes;
  });

  if (focusTarget?.summary) {
    const again = focusTarget.summary.querySelector<HTMLElement>(
      `.line[data-slug="${focusTarget.slug}"] [data-line-action="${focusTarget.action}"]`,
    );
    (again ?? focusTarget.summary.querySelector<HTMLElement>('[data-summary-focus]'))?.focus();
  }

  // Bar pesanan
  const bar = document.querySelector<HTMLElement>('[data-order-bar]');
  if (bar) {
    bar.querySelector<HTMLElement>('[data-bar-empty]')!.hidden = count > 0;
    bar.querySelector<HTMLElement>('[data-bar-filled]')!.hidden = count === 0;
    bar.querySelector('[data-bar-text]')!.textContent = `${count} item · ${formatRupiah(total)}`;
  }

  updateOrderLinks(current);

  if (count === 0 && sheet?.open) sheet.close();
}

/* ---------- Event ---------- */

document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;

  const qtyButton = target.closest<HTMLElement>('[data-qty-control] [data-action]');
  if (qtyButton) {
    const control = qtyButton.closest<HTMLElement>('[data-qty-control]')!;
    const slug = control.dataset.slug ?? '';
    const qty = cart.get(slug) ?? 0;
    const action = qtyButton.dataset.action;
    const next = action === 'dec' ? qty - 1 : qty + 1;
    setQty(slug, next);
    // Pindahkan fokus karena tombol yang ditekan bisa disembunyikan
    if (action === 'add') control.querySelector<HTMLElement>('[data-action="inc"]')?.focus();
    if (action === 'dec' && next === 0) control.querySelector<HTMLElement>('[data-action="add"]')?.focus();
    return;
  }

  const lineButton = target.closest<HTMLElement>('[data-line-action]');
  if (lineButton) {
    const slug = lineButton.closest<HTMLElement>('.line')?.dataset.slug ?? '';
    const qty = cart.get(slug) ?? 0;
    setQty(slug, lineButton.dataset.lineAction === 'dec' ? qty - 1 : qty + 1);
  }
});

document.addEventListener('input', (event) => {
  const field = event.target as HTMLElement;
  if (!(field instanceof HTMLTextAreaElement) || !field.matches('[data-cart-notes]')) return;
  notes = field.value;
  document.querySelectorAll<HTMLTextAreaElement>('[data-cart-notes]').forEach((other) => {
    if (other !== field) other.value = notes;
  });
  save();
  updateOrderLinks(lines());
});

/* ---------- Bottom sheet ---------- */

if (sheet) {
  let trigger: HTMLElement | null = null;

  document.querySelectorAll<HTMLElement>('[data-sheet-open]').forEach((button) => {
    button.addEventListener('click', () => {
      trigger = button;
      sheet.showModal();
      sheet.querySelector<HTMLElement>('[data-sheet-close]')?.focus();
    });
  });

  sheet.querySelector('[data-sheet-close]')?.addEventListener('click', () => sheet.close());

  // Ketuk area gelap (backdrop) untuk menutup
  sheet.addEventListener('click', (event) => {
    if (event.target === sheet) sheet.close();
  });

  sheet.addEventListener('close', () => {
    const fallback = document.querySelector<HTMLElement>('[data-order-bar] [data-wa-order], [data-order-bar] a');
    const back = trigger && trigger.offsetParent !== null ? trigger : fallback;
    back?.focus();
    trigger = null;
  });
}

load();
render();
