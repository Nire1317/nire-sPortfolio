# Erin Tuzon — 3D guided-tour portfolio

A single-page portfolio built as a "guided tour": every swipe, scroll, or key press flies a camera through one persistent three.js world to the next of 11 full-screen stops, with micro-animations on each step.

**Stack:** Vite + TypeScript (strict, no UI framework), three.js, GSAP (ScrollTrigger, SplitText), Lenis + `lenis/snap`, Bricolage Grotesque + Manrope (Fontsource). Shaders are plain `.glsl` files loaded with Vite's `?raw`.

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # tsc --noEmit && vite build  →  dist/
npm run preview   # serve dist/ locally
```

---

## Editing content

**All personal copy lives in [`src/content.ts`](src/content.ts).** Nothing else needs to change to update the words on the site.

| What you want to change | Where in `content.ts` |
|---|---|
| Name, role, email, GitHub / LinkedIn / resume links | `person` |
| Page title, description, share-preview text, production URL | `site` |
| Intro tagline, "Now" line, location | `intro` |
| About heading, bio paragraphs (`**bold**` works), the three values | `about` |
| Tech stack (three groups = three rings) | `toolkit.groups` |
| Projects (one tour stop each) | `work.projects` |
| Timeline | `journey.milestones` |
| Strengths and their proof | `shine.strengths` |
| Growth areas and the "Now" line for each | `growth.areas` |
| Contact heading, button labels, footer | `contact` |
| Interface words (sound button, "Role", "Years", …) | `ui` |

### Projects

Each entry in `work.projects` becomes its own stop and its own floating screen in the starfield tunnel.

- `link`: set a URL to show a **Live site** button, or `null` to hide it.
- `screenshot`: a path inside `public/` (e.g. `shots/leavely.webp`). It is drawn full-bleed and dimmed according to its brightness, so light themes don't glare. Use a 16:10 image around 1600×1000.
- No screenshot: set `art: 'logistics'` or `art: 'delivery'` to get a drawn, animated app UI instead.
- `accent`: the screen's frame and glow colour.
- `chrome`: the small text in the window's title bar. Don't repeat the project title here.

Adding or removing projects adds or removes tour stops automatically. The rail, story bars, keyboard navigation and the tunnel length all follow.

### Share previews and SEO

The `<title>`, description, Open Graph and Twitter tags, and the JSON-LD `Person` block are **generated from `content.ts` into `index.html` at build time** (see `vite.config.ts`), so link previews work without JavaScript. The full page markup is baked into the HTML the same way, so crawlers and no-JS visitors get real content.

Static assets in `public/`:

- `og-image.jpg`: 1200×630 share image (a capture of the real hero). Re-capture it if the hero changes.
- `favicon.svg`, `apple-touch-icon.png` (180×180)
- `Christian-Erin-Tuzon-Resume.pdf`, which the Resume link points to
- `shots/`: project screenshots

> Keep phone numbers and street addresses out of `content.ts`: everything in it is public. Note that the linked resume PDF is public too.

---

## How the tour works

```
src/
  content.ts          all copy (single source of truth)
  markup.ts           pure string renderers → baked into index.html by vite.config.ts
  main.ts             boot, frame loop, landing effects
  core/               shared state + event bus, math, quality tiers + FPS monitor
  tour/scroll.ts      Lenis, snap, gesture filter, keyboard, focus-follow, landing detection
  tour/layout.ts      fit pass (CSS zoom) + where each 3D subject may sit on screen
  ui/                 reveals (SplitText), nav (rail / story bars), cursor, fx, tilt, contact
  audio/sound.ts      generative WebAudio soundscape
  three/              world layout, particle formations, camera rig, panels, post-processing
  shaders/            GLSL
```

**One scroll position drives everything.** The page is 11 stops of `100svh`. `state.t` is the continuous tour position (0 = Intro … 10 = Contact). Each frame on the shared GSAP ticker: Lenis → tour position → DOM effects → 3D scene → render.

**One swipe = one stop.** Lenis runs smooth wheel and `syncTouch` for phones, and `lenis/snap` is registered in mandatory mode on every stop's centre. A gesture filter (Lenis' `virtualScroll` hook) turns each wheel gesture or swipe into a single flight. A finger drag still moves the page 1:1 until you let go. Any position left between stops (a scrollbar drag, find-in-page, a resize) settles onto the nearest centre through the snap. `scrollToStop()` always passes Lenis a pixel number.

**Camera.** The camera follows a centripetal Catmull-Rom curve through per-stop poses. After the layout pass measures where each text card sits, the projection matrix is shifted so the subject lands beside the text (landscape) or above it (portrait). The camera also dollies per stop so wide shapes fit. Banking roll follows lateral movement, and the FOV kicks with scroll speed.

**Particles.** A single GPU `Points` system: 40k particles on desktop, 12k on phones. Every particle has a baked position in all eight formations (core shell, helix, rings, tunnel, journey path, lattice, scaffold, portal). The vertex shader morphs between the current pair with a per-particle stagger and a curving stream between scenes. Particles part around the pointer, and a tap or click on empty space sends a shockwave ring through them. A separate dust layer drifts along the whole path.

**Landing on a stop** triggers a light sweep, a flash, a particle shockwave, a bell, an 8 ms vibration (Android, after the visitor has interacted), and on project stops the screen's scan-line power-on.

**Post-processing:** bloom (lower resolution on weaker devices), then ACES tone mapping, then a final pass with velocity-based chromatic aberration, vignette, film grain and the landing flash.

**Fit pass.** After fonts load and SplitText runs, each card is measured. If it doesn't fit between the top bar and the bottom edge, it's scaled with CSS `zoom` (minimum 0.6). On portrait screens, tall cards may shrink slightly (minimum 0.86) to leave room for the 3D subject.

### Accessibility and fallbacks

- Reveals animate opacity only, never `visibility`, so every stop stays readable by screen readers and reachable with Tab. Tabbing into a stop flies to it.
- Keyboard: Arrow keys, Page Up/Down, Space / Shift+Space, Home, End.
- `prefers-reduced-motion`: native scroll with CSS snap, no velocity effects or text reveals, and stops cross-fade instead of flying.
- No WebGL2: a static gradient background. All content stays readable and navigable.
- Quality tiers come from pointer type, screen density, CPU cores and WebGL2 support. If the frame rate stays under 45 fps, quality steps down: first bloom off and a lower resolution, then half the particles. Rendering pauses while the tab is hidden.
- Sound is on by default but stays "pending" until the first click, tap or key press. Turning it off is remembered.

### URL flags (handy for testing)

| Flag | Effect |
|---|---|
| `?quality=high` / `?quality=low` | Force a quality tier |
| `?webgl=0` | Force the no-WebGL fallback |
| `?fps=0` | Disable the automatic quality step-down (e.g. for screenshots on slow machines) |
| `?debug` | Expose `window.__tour` (state, `goto(i)`, layout, subject position) for automated checks |

---

## Deploying

The build is fully static (`base: './'`), so `dist/` works from any host or sub-path.

**CI/CD (GitHub Actions → Vercel).** Only `main` deploys. [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) runs on every push to `main` and every pull request into `main`:

1. **Type-check and build:** `npm ci` then `npm run build`. Pull requests stop here, so they're checked but never deployed.
2. **Deploy:** only for pushes to `main` (or a manual *Run workflow* on `main`), and only if step 1 passed. It runs `vercel pull`, `vercel build --prod` and `vercel deploy --prebuilt --prod` to production.

Vercel's own Git deployments are switched off in [`vercel.json`](vercel.json) (`git.deploymentEnabled: false`), so no other branch can deploy and every deploy goes through the checks. `vercel.json` builds the project root (`npm ci`, `npm run build`, output `dist/`), and Node 22 is pinned in `package.json`.

One-time setup: add three repository secrets under GitHub → Settings → Secrets and variables → Actions:

| Secret | Where to get it |
|---|---|
| `VERCEL_TOKEN` | Vercel → Account Settings → Tokens → Create |
| `VERCEL_ORG_ID` | `orgId` in `.vercel/project.json` after `vercel link` (or Vercel → Team Settings → Team ID) |
| `VERCEL_PROJECT_ID` | `projectId` in `.vercel/project.json` (or Vercel → Project Settings → Project ID) |

The previous site is kept in [`portfolio-v2/`](portfolio-v2/). To deploy that one instead, point `vercel.json` back at it (`npm ci --prefix portfolio-v2`, `npm run build --prefix portfolio-v2`, output `portfolio-v2/dist`). The serverless contact endpoint in `api/` (Firestore + Resend) is left in place and still deploys, though the new page doesn't call it.

**Any static host** (Netlify, Cloudflare Pages, GitHub Pages): run `npm run build` and publish `dist/`.

After deploying to a new domain, update `site.url` in `content.ts`. Canonical and Open Graph image URLs must be absolute.

> This repo is connected to Lovable. This tour lives on the `3d-tour` branch. Merging it into the Lovable-connected branch replaces the Lovable (TanStack) app with this one.
