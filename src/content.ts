/**
 * Every word of personal copy on the site lives in this file.
 *
 * - The page markup, the <head> tags (title, Open Graph, Twitter, JSON-LD) and
 *   the 3D labels are all generated from it, at build time and in dev.
 * - Wrap words in **double asterisks** to bold them (supported in `about.bio`).
 * - Never add a phone number or street address here: the whole file is public.
 */

export const site = {
  /** Production URL, used for canonical and absolute Open Graph image links. */
  url: 'https://nire-s-portfolio.vercel.app',
  lang: 'en',
  title: 'Erin Tuzon | Software Engineer',
  description:
    'Christian Erin J. Tuzon is a software engineer from Isabela, Philippines, building delivery and logistics platforms with React, React Native, Node.js and MySQL.',
  /** Shorter text for link previews (Open Graph / Twitter). */
  shareDescription: 'Software engineer from Isabela, Philippines. Selected work, experience and toolkit.',
  ogImage: 'og-image.jpg',
  ogImageAlt: 'Erin Tuzon, Software Engineer: a glowing faceted core inside a field of light particles.',
  themeColor: '#06070B',
};

export const person = {
  /** Shown top-left in the header. */
  brand: 'erintuzon',
  firstName: 'Erin',
  lastName: 'Tuzon',
  fullName: 'Christian Erin J. Tuzon',
  role: 'Software Engineer',
  employer: 'Dory Delivery',
  /** What you're doing right now (shown with a green status dot). */
  availability: 'Software engineer at Dory Delivery',
  region: 'Isabela',
  countryCode: 'PH',
  location: 'Isabela, PH',
  /** Drives the live clock. IANA time zone name. */
  timeZone: 'Asia/Manila',
  email: 'erintuzon01@gmail.com',
  links: {
    github: { label: 'GitHub', url: 'https://github.com/Nire1317' },
    linkedin: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/erin-tuzon-541038343' },
    resume: { label: 'Resume', url: 'Christian-Erin-Tuzon-Resume.pdf' },
  },
};

/** Interface words that are not about Erin, kept here so all text is in one place. */
export const ui = {
  skip: 'Skip to content',
  brandHome: 'Back to the start',
  getInTouch: 'Get in touch',
  chaptersNav: 'Chapters',
  sound: {
    on: 'Sound on',
    off: 'Sound off',
    pendingPointer: 'Click for sound',
    pendingTouch: 'Tap for sound',
    toggle: 'Toggle sound',
  },
  enableTilt: 'Enable tilt',
  role: 'Role',
  years: 'Years',
  stack: 'Tech stack',
  projects: 'Projects',
  opensInNewTab: '(opens in a new tab)',
  localTime: 'Local time',
};

export const intro = {
  chapter: 'Intro',
  /** The small stacked roles above the name (the last one hides on narrow screens). */
  roles: ['Software Engineer', 'Web & Mobile Apps', 'React, Node.js, MySQL'],
  tagline: 'I build, break, learn and ship software faster with AI, without losing the engineering behind it.',
  nowPrefix: 'Now',
  clockLine: 'Shipping from Isabela, PH',
  primaryCta: 'Start the tour',
  secondaryCta: 'Get in touch',
  hintTouch: 'Swipe up',
  hintPointer: 'Scroll',
  hintSuffix: 'to start the tour',
};

/**
 * Software engineering roles as 'YYYY-MM' (start, end); `null` end = still there.
 * Months count inclusively, the way LinkedIn does, so the total matches LinkedIn.
 * Dates follow LinkedIn's Experience section. Keep in sync with `journey` below.
 */
const softwareRoles: [string, string | null][] = [
  ['2025-11', null], // Software Engineer, full-time
];

/** Total software engineering experience, e.g. "1 year and 6 months". */
function softwareExperience(): string {
  const toIndex = (ym: string | null) => {
    if (!ym) {
      const now = new Date();
      return now.getFullYear() * 12 + now.getMonth();
    }
    const [y, m] = ym.split('-').map(Number);
    return y * 12 + (m - 1);
  };
  const months = softwareRoles.reduce((sum, [start, end]) => sum + toIndex(end) - toIndex(start) + 1, 0);
  const yrs = Math.floor(months / 12);
  const mos = months % 12;
  return [yrs > 0 ? `${yrs} year${yrs > 1 ? 's' : ''}` : '', mos > 0 ? `${mos} month${mos > 1 ? 's' : ''}` : '']
    .filter(Boolean)
    .join(' and ');
}

export const about = {
  chapter: 'About',
  label: 'About me',
  heading: 'I’m Erin, a software engineer from Isabela, Philippines.',
  intro: 'I build software that holds up, from the database schema and API all the way to the screen people tap on.',
  bio: [
    `I have **${softwareExperience()}** of software engineering experience.`,
    'My favorite part is turning an idea into something that works properly and chasing every bug to **its real cause**.',
    'AI makes me faster, but I know the code I ship **inside out**. I am **obsessed with growth** and **addicted to progress**.',
  ],
  valuesTitle: 'Three things I live by.',
  values: [
    { title: 'Consistency', text: 'Small daily improvements that compound.' },
    { title: 'Discipline', text: 'Quality first, even when a shortcut is easier.' },
    { title: 'Goals', text: 'Roadmaps, not dreams.' },
  ],
};

export const toolkit = {
  chapter: 'Toolkit',
  label: 'Toolkit',
  heading: 'Tools I’ve used on real projects, not a wishlist.',
  intro: 'Grouped by where they sit in the system.',
  groups: [
    {
      name: 'Frontend & Mobile',
      items: ['React', 'TypeScript', 'React Native', 'Expo', 'Tailwind CSS', 'Redux', 'TanStack Query'],
    },
    {
      name: 'Backend & Data',
      items: ['Node.js', 'Express', 'Socket.IO', 'MySQL', 'Sequelize', 'Redis', 'BullMQ', 'Supabase'],
    },
    {
      name: 'Cloud & Tools',
      items: ['Railway', 'Vercel', 'GitHub', 'Postman', 'Claude Code'],
    },
  ],
};

export type ProjectArt = 'logistics' | 'delivery';

export interface Project {
  id: string;
  title: string;
  /** Shown on every screen size. */
  category: string;
  /** Appended after the category on wider screens. */
  status: string;
  blurb: string;
  role: string;
  years: string;
  tags: string[];
  /** Omit (null) to hide the "Live site" button. */
  link: string | null;
  /** Path inside /public. Omit (null) to draw the app UI instead. */
  screenshot: string | null;
  /** Which drawn UI to use when there is no screenshot. */
  art?: ProjectArt;
  /** Small header text in the panel's window chrome (never the project title). */
  chrome: string;
  accent: string;
}

export const work = {
  chapter: 'Work',
  label: 'Selected work',
  liveLabel: 'Live site',
  projects: [
    {
      id: 'dorx',
      title: 'DORX',
      category: 'Parcel logistics',
      status: 'Pre-production',
      blurb:
        'Eleven interconnected systems that move parcels through Hub, Provincial and Regional warehouses. I designed the Return-to-Shipper flow and built bulk QR generation and the mid-mile QR handshake.',
      role: 'Top backend and web contributor, 700+ commits',
      years: '2025 to present',
      tags: ['Node.js', 'Express', 'MySQL', 'Socket.IO', 'React', 'React Native'],
      link: null,
      screenshot: null,
      art: 'logistics',
      chrome: 'Operations · Hub network',
      accent: '#9FD8FF',
    },
    {
      id: 'dory',
      title: 'DORY',
      category: 'Food and grocery delivery',
      status: 'Live',
      blurb:
        'Live food and grocery delivery with customer, rider and merchant apps, an admin web app and a REST API. I ship order flows across all of them and debug production payments in MySQL.',
      role: 'Software engineer',
      years: '2025 to present',
      tags: ['React Native', 'React', 'Node.js', 'MySQL', 'Redis', 'BullMQ'],
      link: null,
      screenshot: null,
      art: 'delivery',
      chrome: 'Rider · Active order',
      accent: '#FF5A1F',
    },
    {
      id: 'leavely',
      title: 'Leavely',
      category: 'Leave management',
      status: 'Live',
      blurb:
        'Automated leave and absence tracking for teams that were stuck on spreadsheets: manual, error-prone and hard to read at a glance.',
      role: 'Built and shipped on my own',
      years: '2025',
      tags: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Node.js'],
      link: 'https://leavely-frontend.vercel.app/',
      screenshot: 'shots/leavely.webp',
      chrome: 'leavely-frontend.vercel.app',
      accent: '#A8DC8C',
    },
    {
      id: 'e-barangay',
      title: 'E-Barangay',
      category: 'Civic services',
      status: 'Live',
      blurb:
        'Digital services and records for a local barangay, moving document requests and complaints off paper and manual processing.',
      role: 'Built and shipped on my own',
      years: '2025',
      tags: ['React', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Vite'],
      link: 'https://e-barangay-system.vercel.app/',
      screenshot: 'shots/e-barangay.webp',
      chrome: 'e-barangay-system.vercel.app',
      accent: '#8B7BFF',
    },
  ] as Project[],
};

export const journey = {
  chapter: 'Experience',
  label: 'Experience',
  heading: 'From classroom to production.',
  nowLabel: 'Now',
  milestones: [
    {
      date: '2021 to 2025',
      title: 'BS Information Technology',
      place: 'Saint Ferdinand College, City of Ilagan',
      detail: 'Software engineering, databases and web programming, plus a Diploma in ICT.',
    },
    {
      date: 'Feb to May 2025',
      title: 'Software Engineer Intern',
      place: 'Dory Delivery',
      detail: 'React Native features for the customer and rider apps, API work and QA.',
    },
    {
      date: '2025',
      title: 'Leavely and E-Barangay',
      place: 'Independent projects',
      detail: 'Built and deployed two web apps with React, TypeScript and Supabase.',
    },
    {
      date: 'Jul to Oct 2025',
      title: 'Technical Staff',
      place: 'Universal Leaf Philippines, Inc.',
      detail: 'Invoices, billing and service reports, maintenance records and parts tracking.',
    },
    {
      date: 'Nov 2025 to now',
      title: 'Software Engineer',
      place: 'Dory Delivery',
      detail: 'Back on DORY and DORX: MySQL schemas, REST APIs, Redis queues and deployments.',
    },
  ],
};

export const shine = {
  chapter: 'Where I shine',
  label: 'What I do',
  heading: 'Where I shine.',
  strengths: [
    {
      title: 'Shipping real products',
      proof: 'Leavely and E-Barangay are both live, built and deployed on my own.',
      projects: ['Leavely', 'E-Barangay'],
    },
    {
      title: 'Systems that agree',
      proof: 'Keeping 11 DORX logistics systems in sync on one parcel status.',
      projects: ['DORX'],
    },
    {
      title: 'Debugging to the root cause',
      proof: 'Traced live payment issues by querying real order data in MySQL.',
      projects: ['DORY'],
    },
    {
      title: 'AI-assisted, human-reviewed',
      proof: 'Claude Code and ChatGPT speed me up. I read, test and own every line.',
      projects: [] as string[],
    },
  ],
  factsLabel: 'Facts & figures',
  stats: [
    { value: 700, suffix: '+', label: 'Commits on DORX' },
    { value: 11, suffix: '', label: 'Systems kept in sync' },
    { value: 3, suffix: '', label: 'Products live in production' },
  ],
};

export const growth = {
  chapter: 'Next up',
  label: 'Next up',
  heading: 'Where I’m headed next.',
  intro: 'Deeper into DevOps and cloud, and toward designing systems end to end.',
  nowLabel: 'Now',
  areas: [
    {
      title: 'DevOps and cloud',
      now: 'I ship on Railway, Render and Vercel today.',
      next: 'Going deeper into DevOps and cloud over the next two years.',
    },
    {
      title: 'Designing systems at scale',
      now: 'Today I build features inside large systems like DORX.',
      next: 'Growing into a senior engineer who designs and scales systems end to end.',
    },
  ],
};

export const contact = {
  chapter: 'Contact',
  label: 'Contact',
  currentlyPrefix: 'Currently',
  headingLines: ['Let’s build', 'something that moves.'],
  line: 'Have a role, a project or a question? Email is the fastest way to reach me.',
  copyLabel: 'Copy email',
  copiedLabel: 'Copied',
  copiedAnnouncement: 'Email address copied to the clipboard.',
  emailCta: 'Email me',
  footer: '© 2026 Christian Erin J. Tuzon. Built with Vite, TypeScript and three.js. AI-assisted, human-reviewed.',
};
