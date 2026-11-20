import { contact } from '../content';

/** Copy-email button: writes to the clipboard and morphs its icon into a check. */
export function createContact() {
  const btn = document.querySelector<HTMLButtonElement>('.copy-btn');
  const label = btn?.querySelector<HTMLElement>('.copy-btn__label');
  const announcer = document.getElementById('announcer');
  if (!btn || !label) return;
  let timer = 0;

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      let ok = false;
      try {
        ok = document.execCommand('copy');
      } catch {
        ok = false;
      }
      ta.remove();
      return ok;
    }
  }

  btn.addEventListener('click', async () => {
    const ok = await copy(btn.dataset.copy ?? '');
    if (!ok) {
      window.location.href = `mailto:${btn.dataset.copy ?? ''}`;
      return;
    }
    btn.classList.add('is-copied');
    label.textContent = label.dataset.labelDone ?? contact.copiedLabel;
    if (announcer) {
      announcer.textContent = '';
      window.setTimeout(() => (announcer.textContent = contact.copiedAnnouncement), 30);
    }
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      btn.classList.remove('is-copied');
      label.textContent = label.dataset.labelDefault ?? contact.copyLabel;
    }, 2400);
  });
}
