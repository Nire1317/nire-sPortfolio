/**
 * Pure string renderers for the page. No DOM access here: this module runs in
 * Node (from vite.config.ts) to bake the full page into index.html, so link
 * previews, crawlers and no-JS visitors get real content.
 */
import { about, contact, growth, intro, journey, person, shine, site, toolkit, ui, work } from './content.ts';

export type StopKind = 'intro' | 'about' | 'toolkit' | 'work' | 'journey' | 'shine' | 'growth' | 'contact';

export interface StopModel {
  id: string;
  kind: StopKind;
  chapter: string;
  project?: number;
}

export function stopModel(): StopModel[] {
  return [
    { id: 'intro', kind: 'intro', chapter: intro.chapter },
    { id: 'about', kind: 'about', chapter: about.chapter },
    { id: 'toolkit', kind: 'toolkit', chapter: toolkit.chapter },
    ...work.projects.map((p, i): StopModel => ({ id: `work-${p.id}`, kind: 'work', chapter: p.title, project: i })),
    { id: 'journey', kind: 'journey', chapter: journey.chapter },
    { id: 'strengths', kind: 'shine', chapter: shine.chapter },
    { id: 'leveling-up', kind: 'growth', chapter: growth.chapter },
    { id: 'contact', kind: 'contact', chapter: contact.chapter },
  ];
}

/* ---------- helpers ---------- */

export function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Escapes, then turns **bold** into <strong>. */
function rich(s: string): string {
  return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

const ext = (url: string) => /^https?:\/\//.test(url);
const extAttrs = (url: string) => (ext(url) ? ' target="_blank" rel="noopener noreferrer"' : '');
const srNewTab = (url: string) => (ext(url) ? `<span class="sr-only"> ${esc(ui.opensInNewTab)}</span>` : '');

const svg = (body: string, cls = 'icon', vb = '0 0 24 24') =>
  `<svg class="${cls}" viewBox="${vb}" width="24" height="24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;

const icon = {
  arrowRight: svg('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>'),
  arrowUpRight: svg('<path d="M7 17 17 7"/><path d="M8 7h9v9"/>'),
  arrowDown: svg('<path d="M12 5v14"/><path d="m6 13 6 6 6-6"/>'),
  pin: svg('<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.4"/>'),
  mail: svg('<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3.5 6 8.5 7 8.5-7"/>'),
  github: svg(
    '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  ),
  linkedin: svg('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 10v7"/><path d="M8 7v.01"/><path d="M12 17v-4a2 2 0 0 1 4 0v4"/><path d="M12 10v7"/>'),
  file: svg('<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h4"/>'),
  copy:
    '<svg class="icon icon-morph" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect class="morph-copy" pathLength="1" x="8" y="8" width="12" height="12" rx="1.5"/>' +
    '<path class="morph-copy" pathLength="1" d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8"/>' +
    '<path class="morph-check" pathLength="1" d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  sound:
    '<svg class="icon icon-sound" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" fill="currentColor">' +
    '<rect x="3" y="9" width="2.4" height="6"/><rect x="7.4" y="6" width="2.4" height="12"/><rect x="11.8" y="3.5" width="2.4" height="17"/><rect x="16.2" y="7" width="2.4" height="10"/><rect x="20.6" y="10" width="2.4" height="4"/></svg>',
  tilt: svg('<rect x="7" y="3" width="10" height="18" rx="2" transform="rotate(-14 12 12)"/><path d="M3 8a9 9 0 0 1 2.5-3.5"/><path d="M21 16a9 9 0 0 1-2.5 3.5"/>'),
  mark:
    '<svg class="brand__mark" viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" focusable="false">' +
    '<path d="M16 2 28 9v14l-12 7L4 23V9Z" fill="none" stroke="currentColor" stroke-width="2"/>' +
    '<path d="M16 2v28M4 9l24 14M28 9 4 23" stroke="currentColor" stroke-width="1" opacity=".45"/>' +
    '<circle cx="16" cy="16" r="3.2" fill="#FF6B3D"/></svg>',
};

/** "erintuzon" → erin + dimmed tuzon, when the brand starts with the first name. */
function brandName() {
  const b = person.brand;
  const f = person.firstName.toLowerCase();
  return b.toLowerCase().startsWith(f) && b.length > f.length
    ? `${esc(b.slice(0, f.length))}<span>${esc(b.slice(f.length))}</span>`
    : esc(b);
}

const label = (text: string, extra = '') => `<p class="label${extra}" data-label><span>${esc(text)}</span></p>`;

const btn = (
  text: string,
  href: string,
  kind: 'primary' | 'ghost',
  opts: { goto?: string; iconHtml?: string; cls?: string } = {},
) =>
  `<a class="btn btn--${kind}${opts.cls ? ' ' + opts.cls : ''}" href="${esc(href)}"${extAttrs(href)}${
    opts.goto !== undefined ? ` data-goto="${opts.goto}"` : ''
  } data-magnetic><span class="btn__text">${esc(text)}</span>${opts.iconHtml ?? ''}${srNewTab(href)}</a>`;

/* ---------- stops ---------- */

function stopOpen(m: StopModel, index: number, extraCls = '') {
  return `<section class="stop stop--${m.kind}${extraCls}" id="${m.id}" data-stop="${index}" data-kind="${m.kind}" data-chapter="${esc(
    m.chapter,
  )}" aria-labelledby="${m.id}-title"><div class="stop__card" data-card>`;
}
const stopClose = `</div></section>`;

function introStop(m: StopModel, i: number) {
  return (
    stopOpen(m, i) +
    `<p class="label" data-label><span class="roles">${intro.roles
      .map((r, k) => `<span class="roles__item${k === intro.roles.length - 1 ? ' roles__item--extra' : ''}">${esc(r)}</span>`)
      .join('')}</span></p>` +
    `<h1 class="hero-name" id="${m.id}-title" data-split="chars"><span class="hero-name__first">${esc(
      person.firstName,
    )}</span> <span class="hero-name__last">${esc(person.lastName)}</span></h1>` +
    `<p class="lede" data-split="lines">${esc(intro.tagline)}</p>` +
    `<ul class="meta" data-rise>` +
    `<li class="meta__now"><span class="status-dot" aria-hidden="true"></span><span class="meta__k">${esc(
      intro.nowPrefix,
    )}</span> ${esc(person.availability)}</li>` +
    `<li class="meta__loc">${icon.pin}<span>${esc(intro.clockLine)}</span><time class="clock" data-tz="${esc(
      person.timeZone,
    )}" aria-label="${esc(ui.localTime)}"></time></li>` +
    `</ul>` +
    `<div class="actions" data-rise>` +
    btn(intro.primaryCta, '#about', 'primary', { goto: '1', iconHtml: icon.arrowRight }) +
    btn(intro.secondaryCta, '#contact', 'ghost', { goto: 'last' }) +
    `</div>` +
    `<p class="hint" aria-hidden="true" data-rise><span class="hint__mouse"><i></i></span><span class="hint__text"><span class="only-touch">${esc(
      intro.hintTouch,
    )}</span><span class="only-pointer">${esc(intro.hintPointer)}</span> ${esc(intro.hintSuffix)}</span></p>` +
    `<button class="icon-btn tilt-btn" type="button" hidden aria-label="${esc(ui.enableTilt)}" title="${esc(
      ui.enableTilt,
    )}">${icon.tilt}</button>` +
    stopClose
  );
}

function aboutStop(m: StopModel, i: number) {
  return (
    stopOpen(m, i) +
    label(about.label) +
    `<h2 class="h2 h2--long" id="${m.id}-title" data-split="chars">${esc(about.heading)}</h2>` +
    `<p class="lede" data-split="lines">${esc(about.intro)}</p>` +
    about.bio.map((p) => `<p class="bio" data-words>${rich(p)}</p>`).join('') +
    `<div class="values" data-rise><h3 class="values__title">${esc(about.valuesTitle)}</h3><ul class="values__list">` +
    about.values
      .map((v) => `<li class="value"><span class="value__title">${esc(v.title)}</span><span class="value__text">${esc(v.text)}</span></li>`)
      .join('') +
    `</ul></div>` +
    stopClose
  );
}

function toolkitStop(m: StopModel, i: number) {
  return (
    stopOpen(m, i) +
    label(toolkit.label) +
    `<h2 class="h2" id="${m.id}-title" data-split="chars">${esc(toolkit.heading)}</h2>` +
    `<p class="lede" data-split="lines">${esc(toolkit.intro)}</p>` +
    `<div class="groups">` +
    toolkit.groups
      .map(
        (g, gi) =>
          `<div class="group" data-rise data-group="${gi}"><h3 class="group__name"><span class="group__swatch" aria-hidden="true"></span>${esc(
            g.name,
          )}</h3><ul class="group__items">${g.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>`,
      )
      .join('') +
    `</div>` +
    stopClose
  );
}

function workStop(m: StopModel, i: number, all: StopModel[]) {
  const p = work.projects[m.project ?? 0];
  const dots = all
    .filter((s) => s.kind === 'work')
    .map((s) => {
      const proj = work.projects[s.project ?? 0];
      const cur = s.id === m.id;
      return `<li><a class="project-dot${cur ? ' is-current' : ''}" href="#${s.id}" data-goto-id="${s.id}"${
        cur ? ' aria-current="true"' : ''
      }><span class="sr-only">${esc(proj.title)}</span></a></li>`;
    })
    .join('');
  return (
    stopOpen(m, i) +
    `<p class="label" data-label><span><span class="label__cat">${esc(p.category)}</span><span class="label__ctx"> · ${esc(
      p.status,
    )}</span></span></p>` +
    `<h2 class="h2 work-title" id="${m.id}-title" data-split="chars">${esc(p.title)}</h2>` +
    `<p class="blurb" data-split="lines">${esc(p.blurb)}</p>` +
    `<dl class="work-meta" data-rise><div><dt>${esc(ui.role)}</dt><dd>${esc(p.role)}</dd></div><div><dt>${esc(
      ui.years,
    )}</dt><dd>${esc(p.years)}</dd></div></dl>` +
    `<ul class="tags" aria-label="${esc(ui.stack)}" data-rise>${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` +
    `<div class="work-foot" data-rise>` +
    (p.link ? btn(work.liveLabel, p.link, 'primary', { iconHtml: icon.arrowUpRight }) : '') +
    `<ol class="project-dots" aria-label="${esc(ui.projects)}">${dots}</ol>` +
    `</div>` +
    stopClose
  );
}

function journeyStop(m: StopModel, i: number) {
  const last = journey.milestones.length - 1;
  return (
    stopOpen(m, i) +
    label(journey.label) +
    `<h2 class="h2" id="${m.id}-title" data-split="chars">${esc(journey.heading)}</h2>` +
    `<ol class="timeline">` +
    journey.milestones
      .map(
        (ms, k) =>
          `<li class="tl${k === last ? ' tl--now' : ''}" data-rise><span class="tl__node" aria-hidden="true"></span><p class="tl__date">${esc(
            ms.date,
          )}${k === last ? ` <span class="now-tag">${esc(journey.nowLabel)}</span>` : ''}</p><div class="tl__body"><h3 class="tl__title">${esc(
            ms.title,
          )}</h3><p class="tl__place">${esc(ms.place)}</p><p class="tl__detail">${esc(ms.detail)}</p></div></li>`,
      )
      .join('') +
    `</ol>` +
    stopClose
  );
}

function shineStop(m: StopModel, i: number) {
  return (
    stopOpen(m, i) +
    label(shine.label) +
    `<h2 class="h2" id="${m.id}-title" data-split="chars">${esc(shine.heading)}</h2>` +
    `<ul class="strengths">` +
    shine.strengths
      .map(
        (s) =>
          `<li class="strength" data-rise><span class="strength__spark" aria-hidden="true"></span><h3 class="strength__title">${esc(
            s.title,
          )}</h3><p class="strength__proof">${esc(s.proof)}</p>${
            s.projects.length
              ? `<ul class="strength__projects">${s.projects.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>`
              : ''
          }</li>`,
      )
      .join('') +
    `</ul>` +
    `<div class="facts" data-rise><h3 class="facts__title">${esc(shine.factsLabel)}</h3><ul class="facts__list">${shine.stats
      .map(
        (st) =>
          `<li class="fact"><span class="fact__value" aria-hidden="true"><span data-count="${st.value}">${st.value}</span>${esc(
            st.suffix,
          )}</span><span class="sr-only">${st.value}${esc(st.suffix)} </span><span class="fact__label">${esc(st.label)}</span></li>`,
      )
      .join('')}</ul></div>` +
    stopClose
  );
}

function growthStop(m: StopModel, i: number) {
  return (
    stopOpen(m, i) +
    label(growth.label) +
    `<h2 class="h2" id="${m.id}-title" data-split="chars">${esc(growth.heading)}</h2>` +
    `<p class="lede" data-split="lines">${esc(growth.intro)}</p>` +
    `<ul class="areas">` +
    growth.areas
      .map(
        (a) =>
          `<li class="area" data-rise><h3 class="area__title">${esc(
            a.title,
          )}</h3><p class="area__now"><span class="now-tag"><span class="status-dot" aria-hidden="true"></span>${esc(
            growth.nowLabel,
          )}</span> <span>${esc(a.now)}</span></p><p class="area__next">${icon.arrowRight}<span>${esc(
            a.next,
          )}</span></p></li>`,
      )
      .join('') +
    `</ul>` +
    stopClose
  );
}

function contactStop(m: StopModel, i: number) {
  const l = person.links;
  const link = (href: string, text: string, ic: string) =>
    `<li><a class="social" href="${esc(href)}"${extAttrs(href)} data-magnetic>${ic}<span>${esc(text)}</span>${srNewTab(href)}</a></li>`;
  return (
    stopOpen(m, i) +
    label(contact.label, ' label--center') +
    `<p class="currently" data-rise><span class="status-dot" aria-hidden="true"></span><span class="currently__k">${esc(
      contact.currentlyPrefix,
    )}</span> ${esc(person.availability)}</p>` +
    `<h2 class="h2 contact-title" id="${m.id}-title" data-split="chars">${contact.headingLines
      .map((s) => `<span class="contact-title__line">${esc(s)}</span>`)
      .join(' ')}</h2>` +
    `<p class="lede" data-split="lines">${esc(contact.line)}</p>` +
    `<div class="contact-actions" data-rise>` +
    `<button class="btn btn--primary copy-btn" type="button" data-copy="${esc(person.email)}" data-magnetic>${icon.copy}<span class="btn__text"><span class="copy-btn__label" data-label-default="${esc(
      contact.copyLabel,
    )}" data-label-done="${esc(contact.copiedLabel)}">${esc(contact.copyLabel)}</span> <span class="copy-btn__email">${esc(
      person.email,
    )}</span></span></button>` +
    btn(contact.emailCta, `mailto:${person.email}`, 'ghost', { iconHtml: icon.mail }) +
    `</div>` +
    `<ul class="socials" data-rise>` +
    link(l.github.url, l.github.label, icon.github) +
    link(l.linkedin.url, l.linkedin.label, icon.linkedin) +
    link(l.resume.url, l.resume.label, icon.file) +
    `</ul>` +
    `<p class="footer-note" data-rise>${esc(contact.footer)}</p>` +
    stopClose
  );
}

/* ---------- page ---------- */

export function renderBody(): string {
  const stops = stopModel();
  const sections = stops
    .map((m, i) => {
      switch (m.kind) {
        case 'intro':
          return introStop(m, i);
        case 'about':
          return aboutStop(m, i);
        case 'toolkit':
          return toolkitStop(m, i);
        case 'work':
          return workStop(m, i, stops);
        case 'journey':
          return journeyStop(m, i);
        case 'shine':
          return shineStop(m, i);
        case 'growth':
          return growthStop(m, i);
        case 'contact':
          return contactStop(m, i);
      }
    })
    .join('\n');

  const rail = stops
    .map(
      (m, i) =>
        `<li><a class="rail__item${i === 0 ? ' is-active' : ''}" href="#${m.id}" data-goto="${i}"${
          i === 0 ? ' aria-current="step"' : ''
        }><span class="rail__label">${esc(m.chapter)}</span><span class="rail__tick" aria-hidden="true"></span></a></li>`,
    )
    .join('');

  const stories = stops.map(() => `<span class="stories__bar"><i></i></span>`).join('');

  return `
<a class="skip-link" href="#main">${esc(ui.skip)}</a>
<canvas id="gl" aria-hidden="true"></canvas>
<div class="backdrop" aria-hidden="true"></div>
<div class="ring-labels" aria-hidden="true"></div>
<div class="fx" aria-hidden="true"><div class="fx__sweep"></div><div class="fx__flash"></div></div>
<header class="topbar">
  <div class="stories" aria-hidden="true">${stories}</div>
  <div class="topbar__row">
    <a class="brand" href="#intro" data-goto="0" aria-label="${esc(person.firstName + ' ' + person.lastName)}: ${esc(ui.brandHome)}">${
      icon.mark
    }<span class="brand__name">${brandName()}</span></a>
    <span class="topbar__chapter" aria-hidden="true"><span class="topbar__chapter-text">${esc(stops[0].chapter)}</span></span>
    <div class="topbar__actions">
      <button class="sound-btn" type="button" aria-pressed="false" aria-label="${esc(ui.sound.toggle)}" data-state="pending">${
        icon.sound
      }<span class="sound-btn__label" aria-hidden="true"><span class="only-pointer">${esc(ui.sound.pendingPointer)}</span><span class="only-touch">${esc(
        ui.sound.pendingTouch,
      )}</span></span></button>
      ${btn(ui.getInTouch, '#contact', 'primary', { goto: 'last', cls: 'btn--small topbar__cta' })}
    </div>
  </div>
</header>
<nav class="rail" aria-label="${esc(ui.chaptersNav)}"><ol>${rail}</ol></nav>
<main id="main" tabindex="-1">
${sections}
</main>
<p class="sr-only" id="announcer" aria-live="polite"></p>
<div class="cursor" aria-hidden="true"><div class="cursor__ring"></div><div class="cursor__dot"></div></div>`;
}

export function renderHead(): string {
  const url = site.url.replace(/\/$/, '');
  const ogImage = `${url}/${site.ogImage}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: person.fullName,
    alternateName: `${person.firstName} ${person.lastName}`,
    jobTitle: person.role,
    worksFor: { '@type': 'Organization', name: person.employer },
    address: { '@type': 'PostalAddress', addressRegion: person.region, addressCountry: person.countryCode },
    email: `mailto:${person.email}`,
    url: `${url}/`,
    image: ogImage,
    sameAs: [person.links.github.url, person.links.linkedin.url],
  };
  const meta = (attr: 'name' | 'property', key: string, value: string) => `<meta ${attr}="${key}" content="${esc(value)}" />`;
  return [
    `<title>${esc(site.title)}</title>`,
    meta('name', 'description', site.description),
    meta('name', 'author', person.fullName),
    meta('name', 'theme-color', site.themeColor),
    `<meta name="color-scheme" content="dark" />`,
    `<link rel="canonical" href="${esc(url)}/" />`,
    `<link rel="icon" type="image/svg+xml" href="favicon.svg" />`,
    `<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png" />`,
    meta('property', 'og:type', 'profile'),
    meta('property', 'profile:first_name', person.firstName),
    meta('property', 'profile:last_name', person.lastName),
    meta('property', 'og:site_name', `${person.firstName} ${person.lastName}`),
    meta('property', 'og:title', site.title),
    meta('property', 'og:description', site.shareDescription),
    meta('property', 'og:url', `${url}/`),
    meta('property', 'og:image', ogImage),
    meta('property', 'og:image:type', 'image/jpeg'),
    meta('property', 'og:image:width', '1200'),
    meta('property', 'og:image:height', '630'),
    meta('property', 'og:image:alt', site.ogImageAlt),
    meta('property', 'og:locale', 'en_US'),
    meta('name', 'twitter:card', 'summary_large_image'),
    meta('name', 'twitter:title', site.title),
    meta('name', 'twitter:description', site.shareDescription),
    meta('name', 'twitter:image', ogImage),
    meta('name', 'twitter:image:alt', site.ogImageAlt),
    `<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`,
  ].join('\n    ');
}
