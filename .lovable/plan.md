
## New page structure

Reorganize the single-page portfolio into 8 sections in this order:

1. **Landing / Hero** — intro + 3D scene, profile picture card, projects wheel
2. **About Me** — bio, background, personal story
3. **Experience** — work history timeline
4. **Achievements** — awards, recognitions, milestones
5. **Skills** — tech + design skill grid
6. **Hobbies** — personal interests
7. **Goals** — what I'm working toward
8. **Connect / Message Me** — contact form + socials

Nav links update to match the new order.

## Hero additions

**Profile picture toggle component**
- A card on the hero (next to / below the headline) showing a profile image.
- A small toggle/switch that flips between two versions of the photo (e.g. "Casual" ↔ "Formal", or Photo ↔ 3D Avatar).
- Smooth crossfade animation between the two images using Motion.
- Placeholder images generated for both states so it works immediately; user can swap later.

**Horizontal "projects wheel"**
- Placed inside the hero section, below the intro copy.
- A row of project cards that scrolls horizontally (left/right).
- Left/right arrow buttons plus drag-to-scroll and mouse wheel → horizontal scroll.
- Cards use a slight perspective / rotation so the row reads as a "wheel" (center card upright, side cards tilted).
- Smooth snap on each card.

## Section content sketch

- **About Me**: 2-column layout, short narrative + portrait, key facts strip.
- **Experience**: vertical timeline, role · company · years · one-line impact.
- **Achievements**: card grid with icon, title, year (awards, certifications, launches).
- **Skills**: grouped chips (Design / Frontend / 3D / Tools) with subtle hover.
- **Hobbies**: playful icon grid (e.g. photography, chess, cycling, cooking).
- **Goals**: 3-4 large numbered statements with accent typography.
- **Connect**: message form (name, email, message) + email link + social row. Form is UI-only for now (logs on submit) unless you want it wired to a backend.

## Preserved

- Dark theme, Space Grotesk display / Inter body, green primary + coral accent.
- 3D hero scene (distorted blob + orbs).
- Motion-based entry / scroll animations.
- Existing SEO metadata.

## Technical notes

- All new content lives in `src/routes/index.tsx`; long sections extracted into small components in the same file (or split into `src/components/portfolio/*` if it gets long).
- Profile toggle: local `useState` boolean + `motion.img` with `AnimatePresence` crossfade.
- Projects wheel: horizontal flex row inside an `overflow-x-auto snap-x snap-mandatory` container; arrow buttons call `scrollBy`; each card uses `motion` with a transform based on its distance from the viewport center for the wheel tilt effect.
- Placeholder profile images generated via the image tool (two variants).
- Contact form: controlled inputs, `onSubmit` handler that currently just resets and shows a toast — flag this as a UI-only stub.

## Open question

Do you want the **Connect / Message Me** form to actually send messages (needs Lovable Cloud + a small backend), or keep it as a UI-only form for now?
