# Stonix landing — how we work

General rules: `CLAUDE-universal.md`. This file holds what is specific to Stonix.

## Figma
- File "Stonix — Landing (Copy)", key `lv9Mc3EtqTmKMzO49on28l` (v2, Nov 2026; the first version was `N3lw6CuNH1tAFxmHa8NqoY`, same node ids). Desktop frame `4:18` (1920×9485). Popups: `13:123` "Get a free quote" (modal `13:154`), `13:188` "Request sent" (modal `13:219`). No mobile/tablet frame yet.
- Section map (Figma y → section, height): 0 Header 88 · 88 Hero 992 · 1080 Why 880 · 1960 Materials 878 · 2838 Services 1233 · 4071 Our work 973 · 5044 Process 869 · 5913 Remnants 780 · 6693 Quote form 951 · 7644 FAQ 931 · 8575 Final CTA 493 · 9068 Footer 417.
- v2 raised the type scale (body 16 → 18, leads 18 → 20, titles 64 → 72, buttons 16 → 18) and moved the Why content to x 940.
- Image originals: `../stonix-originals/images` (PNG exports), `../stonix-originals/figma` and `figma-v2` (raw downloads, icons), `../stonix-originals/fonts`.

## Typography
- Onest (SIL OFL, Google Fonts), one variable WOFF2 (latin subset, weights 300–500) in `assets/fonts/onest-latin.woff2`, preloaded.
- Chrome's `line-height: normal` for Onest differs from Figma's by ±1px, so "normal" text uses explicit values: 15px → 1.27, 16px → 1.25, 18px → 1.28, 20px → 1.3.

## Build
- `npm run build` = laptop generator (`tools/scale-laptop.py`) + `css/site.min.css` + `js/site.min.js`.
- `npm run build:images` → `assets/images/*-<w>.webp|avif` from `tools/images.config.json` (widths = cover width at 1920 and ×0.75, ×2 for retina).
- Remnant swatches reuse the material images where Figma uses the same file (md5-identical): marble, granite, porcelain, quartz.

## Components
- `.btn` + `--primary/--outline`, `--sm` (header), `--block` (full width). Arrow variant = `.btn--outline` + `.icon--arrow`.
- `.round-btn`: 56px circle (slider arrows); `.modal__close` makes it 44px.
- `.icon icon--{phone-sm,arrow,phone,mail,pin,clock,chevron,clip,toggle,prev,next,close,check}`: SVG masks from `assets/icons/`.
- Our work slider (node 41:154): `[data-work-viewport]` (native horizontal scroll + scroll snap, mouse drag), `[data-work-prev]`/`[data-work-next]` (disabled at the ends). Cards `.work-card` + `--wide` (760) / `--narrow` (440), default 620. The track starts at the container edge and runs off the right of the screen.
- Quote modal (nodes 13:154 / 13:219): native `<dialog data-modal>` with two `[data-modal-view]`s, `form` and `sent`. Any `[data-modal-open]` opens it (the links keep `href="#quote"` as a fallback); `[data-modal-close]`, Esc and a backdrop click close it with an animation; focus returns to the trigger; page scroll is locked (`html.is-locked`).
- FAQ: `[data-accordion]`, items `.faq-item(.is-open)`, buttons with `aria-expanded`; one open at a time (main.js).
- Forms: `[data-form="inline"]` (quote section) and `[data-form="modal"]`, `data-validate` = required | phone | email | zip, `[data-attach]` + `[data-attach-hint]` (`data-default` = idle hint). A valid submit of either form opens the modal's "sent" view.

## Status (November 2026)

| Page | Desktop 1920 | Laptop ×0.75 | Tablet | Mobile 360 |
|---|---|---|---|---|
| index (v2 + popups) | done (node 4:18, 13:154, 13:219) | done (generated) | todo (no frame) | todo (no frame) |

Below 1280px the laptop block still applies (`@media (max-width: 1919px)`); there is no compact layout yet.

## Deviations from Figma
- Hero is one screen tall (`--fixed-vh` − header, min 660px) instead of a fixed 992px; content pinned 120px from the bottom.
- Popups are centred on the screen; in Figma they sit 13px (form) and 8px (sent) below centre.
- How it works: the longest step line (287px) is wider than its 284px column, as in Figma; the text may run into the 24px gap.
- Final CTA title: Figma's text box clips the "y" descenders; shown in full.
- Text-box heights in Figma are rounded (70.6 → 71 etc.), so some sections sit 2–3px off Figma at 1920 (page 9484 vs 9485). Section-internal positions are within ~1.5px.
- Wide screens (>1920): content stays in a 1920 frame; hero and Why photos extend to the screen edge.

## Content flagged to the client
- FAQ answers 2–8 are draft copy (Figma has only the first answer). Check facts: timelines, free measuring, removal, service area.
- Phone `(206) 000-0000` is a placeholder (`tel:+12060000000`).
- Privacy policy links point to `#`.
- Quote forms (section and popup) have no backend: they validate and show the "sent" popup. Set `action` and wire submit in `js/main.js`.
- Our work photos and captions come from Figma as they are; confirm they are Stonix's own projects.
- "108 pieces in stock" is static; the remnant cards are static too (live stock is at stonixwa.com/stock).
