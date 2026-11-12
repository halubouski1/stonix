# Stonix landing — how we work

General rules: `CLAUDE-universal.md`. This file holds what is specific to Stonix.

## Figma
- File "Stonix — Landing (Copy)", key `N3lw6CuNH1tAFxmHa8NqoY`. Desktop frame `4:18` (1920×8333). No mobile/tablet frame yet.
- Section map (Figma y → section, height): 0 Header 88 · 88 Hero 992 · 1080 Why 880 · 1960 Materials 854 · 2814 Services 1196 · 4010 Process 835 · 4845 Remnants 770 · 5615 Quote form 934 · 6549 FAQ 906 · 7455 Final CTA 477 · 7932 Footer 401.
- Image originals: `../stonix-originals/images` (PNG exports), `../stonix-originals/figma` (raw downloads, icons), `../stonix-originals/fonts`.

## Typography
- Onest (SIL OFL, Google Fonts), one variable WOFF2 (latin subset, weights 300–500) in `assets/fonts/onest-latin.woff2`, preloaded.
- Chrome's `line-height: normal` for Onest is 21px at 16px and 22px at 18px; Figma's boxes are 20 and 23. Those rules use 1.25 / 1.28 instead.

## Build
- `npm run build` = laptop generator (`tools/scale-laptop.py`) + `css/site.min.css` + `js/site.min.js`.
- `npm run build:images` → `assets/images/*-<w>.webp|avif` from `tools/images.config.json` (widths = cover width at 1920 and ×0.75, ×2 for retina).
- Remnant swatches reuse the material images where Figma uses the same file (md5-identical): marble, granite, porcelain, quartz.

## Components
- `.btn` + `--primary/--outline`, `--sm` (header). Arrow variant = `.btn--outline` + `.icon--arrow`.
- `.icon icon--{phone-sm,arrow,phone,mail,pin,clock,chevron,clip,toggle}`: SVG masks from `assets/icons/`.
- FAQ: `[data-accordion]`, items `.faq-item(.is-open)`, buttons with `aria-expanded`; one open at a time (main.js).
- Quote form: `[data-form]`, `data-validate` = required | phone | email | zip, `[data-attach]` + `[data-attach-hint]`, `[data-form-status]`.

## Status (November 2026)

| Page | Desktop 1920 | Laptop ×0.75 | Tablet | Mobile 360 |
|---|---|---|---|---|
| index | done (node 4:18) | done (generated) | todo (no frame) | todo (no frame) |

Below 1280px the laptop block still applies (`@media (max-width: 1919px)`); there is no compact layout yet.

## Deviations from Figma
- Hero is one screen tall (`--fixed-vh` − header, min 640px) instead of a fixed 992px; content pinned 120px from the bottom.
- Final CTA title: Figma's 180px box clips the "y" descenders; shown in full (box 180.5px).
- Text-box heights in Figma are rounded up (62.7 → 63 etc.), so later sections sit up to ~5px higher than Figma at 1920 (page 8328 vs 8333). Section-internal positions are within ~1.5px.
- Wide screens (>1920): content stays in a 1920 frame; hero and Why photos extend to the screen edge.

## Content flagged to the client
- FAQ answers 2–8 are draft copy (Figma has only the first answer). Check facts: timelines, free measuring, removal, service area.
- Phone `(206) 000-0000` is a placeholder (`tel:+12060000000`).
- Privacy policy links point to `#`.
- Quote form has no backend: it validates and shows a thank-you line. Set `action` and wire submit in `js/main.js`.
- "108 pieces in stock" is static; the remnant cards are static too (live stock is at stonixwa.com/stock).
