import { gsap } from 'gsap';
import { clamp } from '../core/math';
import { state } from '../core/state';

/**
 * Chapter rail (desktop), Instagram-style story bars + current chapter name
 * (phones), and hiding the top bar's "Get in touch" on the Contact stop.
 */
export function createNav(stops: HTMLElement[], reduced: boolean) {
  const html = document.documentElement;
  const rail = document.querySelector<HTMLElement>('.rail');
  const railItems = [...document.querySelectorAll<HTMLAnchorElement>('.rail__item')];
  const bars = [...document.querySelectorAll<HTMLElement>('.stories__bar i')];
  const chapterText = document.querySelector<HTMLElement>('.topbar__chapter-text');
  const chapters = stops.map((s) => s.dataset.chapter ?? '');
  const last = stops.length - 1;
  let active = -1;
  let movingTimer = 0;
  const fills = bars.map(() => -1);

  function setActive(i: number) {
    if (i === active) return;
    const first = active === -1;
    active = i;
    railItems.forEach((a, k) => {
      a.classList.toggle('is-active', k === i);
      if (k === i) a.setAttribute('aria-current', 'step');
      else a.removeAttribute('aria-current');
    });
    html.classList.toggle('on-contact', i === last);
    if (chapterText) {
      if (first || reduced) chapterText.textContent = chapters[i];
      else {
        gsap.to(chapterText, {
          yPercent: -100,
          opacity: 0,
          duration: 0.18,
          ease: 'power2.in',
          onComplete: () => {
            chapterText.textContent = chapters[i];
            gsap.fromTo(chapterText, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.42, ease: 'expo.out' });
          },
        });
      }
    }
  }

  return {
    update(t: number) {
      setActive(clamp(Math.round(t), 0, last));
      for (let i = 0; i < bars.length; i++) {
        const f = clamp(t - i + 1);
        if (Math.abs(f - fills[i]) > 0.001) {
          fills[i] = f;
          bars[i].style.transform = `scaleX(${f.toFixed(4)})`;
        }
      }
      if (rail && state.speed > 0.06) {
        rail.classList.add('is-moving');
        window.clearTimeout(movingTimer);
        movingTimer = window.setTimeout(() => rail.classList.remove('is-moving'), 900);
      }
    },
  };
}
