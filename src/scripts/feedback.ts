/**
 * Form Kritik & Saran → Google Apps Script → Google Sheets.
 * Content-Type text/plain agar tidak memicu CORS preflight.
 */
const COOLDOWN_MS = 30_000;
const COOLDOWN_KEY = 'justugu-feedback-last';
const MESSAGE_REQUIRED = 'Pesan belum diisi';

const form = document.querySelector<HTMLFormElement>('[data-feedback-form]');
const success = document.querySelector<HTMLElement>('[data-feedback-success]');

function lastSent(): number {
  try {
    return Number(localStorage.getItem(COOLDOWN_KEY)) || 0;
  } catch {
    return 0;
  }
}

function markSent(time: number): void {
  try {
    localStorage.setItem(COOLDOWN_KEY, String(time));
  } catch {
    /* abaikan */
  }
}

if (form && success) {
  const endpoint = form.dataset.endpoint ?? '';
  const max = Number(form.dataset.max) || 1000;
  const message = form.querySelector<HTMLTextAreaElement>('[name="message"]')!;
  const messageField = form.querySelector<HTMLElement>('[data-field="message"]')!;
  const errorText = form.querySelector<HTMLElement>('[data-error-text]')!;
  const errorIcon = form.querySelector<HTMLElement>('[data-error-icon]')!;
  const failure = form.querySelector<HTMLElement>('[data-form-error]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]')!;
  const spinner = form.querySelector<HTMLElement>('[data-spinner]')!;
  const defaultLabel = submitLabel.textContent ?? '';
  let sending = false;
  let memoryLastSent = 0;
  let cooldownTimer: number | undefined;

  const setError = (text: string) => {
    errorText.textContent = text;
    errorIcon.hidden = !text;
    messageField.classList.toggle('has-error', Boolean(text));
    if (text) message.setAttribute('aria-invalid', 'true');
    else message.removeAttribute('aria-invalid');
  };

  const setBusy = (busy: boolean, label = defaultLabel) => {
    submit.setAttribute('aria-disabled', String(busy));
    spinner.hidden = !(busy && label !== defaultLabel);
    submitLabel.textContent = label;
  };

  const remainingCooldown = () => Math.max(0, Math.max(lastSent(), memoryLastSent) + COOLDOWN_MS - Date.now());

  const applyCooldown = () => {
    const remaining = remainingCooldown();
    if (remaining <= 0) return;
    setBusy(true);
    window.clearTimeout(cooldownTimer);
    cooldownTimer = window.setTimeout(() => {
      if (!sending) setBusy(false);
    }, remaining);
  };

  message.addEventListener('input', () => {
    if (messageField.classList.contains('has-error') && message.value.trim()) setError('');
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending || remainingCooldown() > 0) return;

    failure.hidden = true;
    const text = message.value.trim();
    if (!text) {
      setError(MESSAGE_REQUIRED);
      message.focus();
      return;
    }
    setError('');

    const data = new FormData(form);
    const payload = {
      name: String(data.get('name') ?? '').trim().slice(0, 100),
      rating: Number(data.get('rating')) || null,
      message: text.slice(0, max),
      website: String(data.get('website') ?? ''),
    };

    sending = true;
    setBusy(true, 'Mengirim…');

    try {
      if (!/^https:\/\//.test(endpoint)) throw new Error('URL Apps Script belum diisi');
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { ok?: boolean };
      if (!response.ok || !result.ok) throw new Error('Gagal');

      const now = Date.now();
      memoryLastSent = now;
      markSent(now);
      form.reset();
      form.hidden = true;
      success.hidden = false;
      success.focus();
    } catch {
      failure.hidden = false;
    } finally {
      sending = false;
      setBusy(false);
      applyCooldown();
    }
  });

  success.querySelector('[data-feedback-again]')?.addEventListener('click', () => {
    success.hidden = true;
    form.hidden = false;
    applyCooldown();
    form.querySelector<HTMLInputElement>('[name="name"]')?.focus();
  });

  applyCooldown();
}
