# PuhhfieldAi — DESIGN.md

UI is a 1:1 clone of the **higgsfield.ai** design language (measured from the live site, `/` and `/ai/video`, 2026-10-19).
Only the visual layer is cloned; product behaviour stays PuhhfieldAi's own.

Implementation: tokens live in [src/index.css](src/index.css) (`@theme` → Tailwind classes `bg-hf-*`, `text-hf-*`; `:root` → `var(--*)`), components are `hf-*` classes in `@layer components`.

## Brand

| Asset | File | Notes |
|---|---|---|
| Source artwork | `public/favicon.jpg` | 2048² lime squircle + black line mark |
| App icon (squircle) | `public/logo-icon.svg`, `public/favicon.svg` | vectorized, single `evenodd` path, `rx = 19.8 %` |
| Mark only | `public/logo.svg` | `fill="currentColor"`, use via `<PuhhfieldLogo variant="mark">` (CSS mask) |
| Raster | `favicon.png` 512, `favicon-32x32.png`, `apple-touch-icon.png` 180 (full-bleed) | rendered from the same trace |

Name: **PuhhfieldAi** (wordmark `Puhhfield` + lime `Ai`). In the nav only the 32px icon is shown, as on Higgsfield.

## Color

| Token | Value | Use |
|---|---|---|
| `hf-bg` | `#0F1113` | page, top nav |
| `hf-panel` | `#131517` | side panel, drawer, inset fields |
| `hf-surface` | `#1C1E20` | prompt box, chips, segmented control, popovers, modals, cards |
| `hf-card` | `#23262A` | 48px model icon tiles |
| `hf-text` | `#F7F7F8` | primary text |
| `hf-nav` | `#A8A8A8` | inactive nav item |
| `hf-muted` | `#898A8B` | descriptions, labels |
| white / 60 | `rgba(255,255,255,.6)` | field labels, inactive tabs |
| `hf-lime` | `#D1FE17` | accent, active nav, CTA |
| `hf-lime-hi` | `#EFFE17` | Generate radial-gradient core |
| lime / 8 | `rgba(209,254,23,.08)` | tinted button (Higgsfield "Login") |
| lime / 20 | `rgba(209,254,23,.2)` | nav badge ("Top"/"New") |
| `hf-cyan` | `#3CD8FF` | `TOP` model badge + icon border |
| `hf-pink` | `#FF3D9A` | `FAST` badge, counters |

Borders: panel `rgba(217,217,217,.04)`, card frame `white/5`, canvas `white/10`.

## Typography

- **Inter** — UI. Nav 14/20 500 +0.1px · body 14/20 · labels 12/16 500 · descriptions 12/18 or 14/20 muted.
- **Space Grotesk 700, UPPERCASE, −4 % tracking** (`.hf-display`) — page heroes 40/48, panel preset title 20/28 lime, card titles 16/24.
- Menu item titles: Space Grotesk 14/20 500.

## Radius & spacing

nav item 8 · buttons 10 · fields / chips / segmented / Generate 12 · cards 16 (frame, 2px padding) → 12 (body) · panel & canvas 20 · popovers & modals 24.
Top nav 52px, page gutter 16px, panel 320px, panel ↔ canvas gap 8px, panel padding 8px.

## Components

- **Top nav** (`.hf-nav`): logo 32px, items `Explore · Image · Video · Audio | AI Models`, active = lime text, no underline. Right: 36px soft icon buttons (`.hf-btn-soft`), divider, tinted status (`.hf-btn-tint`) or solid CTA (`.hf-btn-solid`).
- **Mega menu** (`.hf-popover` + `.hf-menu-item`): label "Models", rows = 48px icon tile (`.hf-model-icon` with `.is-top/.is-new/.is-fast` border and italic `.hf-tag` on the corner) + title + muted description.
- **Studio** = side panel + canvas:
  - panel: underlined tabs (`.hf-tab`) → preset card (gradient, lime display title, "Change") → segmented control (`.hf-segment`) → dashed upload zone → prompt box (`Prompt` label inside, mini chips `.hf-mini-chip` below) → Model row (`.hf-field-btn`) → param chips (`.hf-chip`) → **Generate** (`.hf-generate`: radial lime gradient, inset `0 -3px 0 rgba(0,0,0,.43)`).
  - pickers open as fly-outs next to the panel (desktop) or below the control (mobile); chip options open above the chip.
  - canvas: History / status row, then empty state "How it works" (display hero + 3 step tiles), progress, or result.
- **Modal** (`.hf-modal`), **Drawer** (`.hf-drawer`), **Inputs** (`.hf-input`, borderless, focus = white/16 border).
