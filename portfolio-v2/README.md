# Portfolio v2 · A New Era of Coding

A fresh, standalone portfolio for Erin Tuzon. Vite + React + TypeScript, built as a static site.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check and build to dist/
```

## Where things live

- `src/data/profile.ts` holds all content. It was carried over from the original portfolio; nothing is invented.
  Fields marked `TODO(Erin)` are optional story details (challenges, lessons, repo links) that only Erin can fill in.
  In `npm run dev` the project modal shows a dashed "To fill in" note for them; production builds hide them.
- `src/sections/` has one component per page section.
- `src/sections/hero/HeroScene.tsx` is the hero visual slot. Replace that component (same export name) to swap in a 3D scene; `Hero.tsx` keeps the copy and buttons.

## Deploying

The repo-root `vercel.json` builds this folder on Vercel, so no project settings are needed.
