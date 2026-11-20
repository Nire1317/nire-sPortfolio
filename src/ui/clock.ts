/** Live local time next to "Shipping from Isabela, PH", in the time zone from content.ts. */
export function createClock() {
  const els = [...document.querySelectorAll<HTMLTimeElement>('time.clock')];
  if (!els.length) return;
  let fmt: Intl.DateTimeFormat;
  try {
    fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: els[0].dataset.tz });
  } catch {
    return;
  }
  const tick = () => {
    const now = new Date();
    for (const el of els) {
      el.textContent = fmt.format(now);
      el.dateTime = now.toISOString();
    }
  };
  tick();
  window.setInterval(tick, 15000);
}
