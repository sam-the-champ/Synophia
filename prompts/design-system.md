# Implementation prompt: Synophia Design System

## Goal

Turn `design/synophia-designsystem.png` into the project's real design foundation:
design tokens wired into Tailwind v4, the Inter font, a small set of reusable UI
primitives that match the reference states, and a `/design-system` showcase page
that reproduces the reference image exactly on desktop and adapts sensibly down to
mobile.

## Skills / docs read

- `AGENTS.md` / `CLAUDE.md` — project rules, boundaries, UI reproduction rule (section 3), checks (section 13).
- `node_modules/next/dist/docs/01-app/01-getting-started/13-fonts.md` — `next/font/google`, variable fonts, `variable` option.
- `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md` — Tailwind v4 via `@import "tailwindcss"`, global CSS in root layout, keep imports at the root.
- Tailwind v4: tokens are declared in CSS with `@theme`; no `tailwind.config.js`.

## Code inspected

- `app/layout.tsx` — root layout, currently loads Geist / Geist_Mono as CSS variables, `LayoutProps<"/">` typing, `h-full antialiased` on `<html>`, `min-h-full flex flex-col` on `<body>`.
- `app/globals.css` — `@import "tailwindcss"`, a `:root` light/dark `--background`/`--foreground` pair, `@theme inline` mapping, body font-family override.
- `app/page.tsx` — default Create Next App landing page (will be left in place; not part of this task).
- `package.json` — Next 16.3.4, React 19.2.8, Tailwind v4, TypeScript. No component library, no `clsx`/`cva`, no `lucide-react`.
- `postcss.config.mjs` — `@tailwindcss/postcss` only.
- Repo is still a single root Next.js app; the two-workspace split (AGENTS.md section 5) has not happened yet.

## Decisions & assumptions

- **Scope**: build the design system inside the current root app (`app/`, new `components/ui/`, new `lib/`). The web/Studio workspace split is a separate, larger task and is out of scope here. Flagged under "Needs your attention".
- **Dark-first**: the reference is a dark UI. Tokens are defined dark-first on `:root`; the showcase page and primitives are built for the dark palette shown. A light theme is not in the reference, so it is not built now (existing `prefers-color-scheme` block is replaced by the token set).
- **Font**: replace Geist with `Inter` via `next/font/google` (variable), exposed as `--font-sans`. Keep a mono fallback only if needed; the reference only uses Inter. Remove the `body { font-family: Arial }` override.
- **Tokens come straight from the image**:
  - Colors: `primary` 600 `#6366F1`, 500 `#818CF8`, 400 `#A5B4FC`, 300 `#C7D2FE`, 200 `#E0E7FF`, 100 `#EEF2FF`; `neutral` 900 `#0B0F19`, 800 `#1E293B`, 700 `#334155`, 500 `#64748B`, 300 `#CBD5E1`, 200 `#E2E8F0`, 100 `#F1F5F9`, white `#FFFFFF`.
  - Type scale: Display 1 56/64 semibold, Display 2 40/48 semibold, Heading 1 32/40 semibold, Heading 2 24/32 medium, Heading 3 20/28 medium, Body Large 18/26 regular, Body 16/24 regular, Small 14/20 regular. Exposed as `--text-*` tokens.
  - Spacing base unit 8px; scale 4, 8, 12, 16, 24, 32, 40, 48, 64 as `--spacing-*` tokens (Tailwind v4 already generates a 4px-based scale, so mostly documentation on the page).
  - Radius: xs 4px, sm 8px, md 12px, lg 16px, xl 24px, full — as `--radius-*`.
  - Shadows: sm/md/lg/xl per the image's rgba stacks — as `--shadow-*`.
- **Icons**: the reference shows generic outline/filled 24px icons. Add `lucide-react` (tree-shakeable, 24px, 2px stroke, round caps — matches "Icon Specs") rather than hand-rolling SVGs. Flagged as a new dependency.
- **Class merging**: add `clsx` + `tailwind-merge` and a `cn()` helper in `lib/utils.ts` for variant-based primitives. Small, standard, widely used.
- Primitives are presentational only. No data, no server calls — consistent with boundaries.

## Files to touch / add

- `app/layout.tsx` — swap font to Inter, drop mono if unused, keep structure.
- `app/globals.css` — replace token block with the full `@theme` token set from the image; keep `@import "tailwindcss"`; set `body` background `--color-neutral-900`, text `--color-neutral-100`.
- `lib/utils.ts` — `cn()` helper.
- `components/ui/button.tsx` — variants: `primary | secondary | tertiary | text`; states default/hover/disabled; height 48px, padding 0 16px, radius 12px, Inter medium 14–16px; optional trailing icon.
- `components/ui/badge.tsx` — `video | lesson | popular` variants (pill, icon + label).
- `components/ui/input.tsx` — search/text input with leading icon and optional `⌘K` hint; 48px, radius 12px, 1px border `rgba(255,255,255,0.12)`, focus border `#818CF8`.
- `components/ui/select.tsx` — native `<select>` styled to match (chevron, same field spec).
- `components/ui/status.tsx` — `In Progress | Completed | Now Playing | Locked` indicator (dot/icon + label).
- `components/ui/progress-bar.tsx` — filled track + "NN% complete" label.
- `components/ui/card.tsx` — the four card shapes from panel 12: course card, video-moment card, lesson card, resource (PDF) card.
- `components/ui/pagination.tsx` — the numbered pager from panel 13 (prev, 1..n with ellipsis, next).
- `app/design-system/page.tsx` — the showcase page, 14 numbered panels reproducing the image: 01 Colors, 02 Typography, 03 Type scale, 04 Spacing, 05 Radius & shadows, 06 Icons, 07 Buttons, 08 Inputs, 09 Badges/Tags, 10 Status indicators, 11 Progress bar, 12 Cards, 13 Navigation, 14 Principles. Plus the left hero column ("Build Beautiful Products Faster", v1.0 · May 2025).
- `app/design-system/` — small local subcomponents (swatch, panel wrapper) as needed, colocated.
- `package.json` / lockfile — add `lucide-react`, `clsx`, `tailwind-merge`.
- `.env.example` — not needed for this task (no new env).

## Requirements

- Desktop layout matches the reference: dark gradient-ish background, rounded panels (`neutral-800` surfaces with subtle borders), numbered panel headers with the small index chip, exact swatch grids with hex labels, type-scale table, button matrix (variant × state), etc.
- All eight type styles, all fourteen colors, all radii, all four shadows rendered as live examples with their labels/values from the image.
- Button/badge/status/input states shown exactly as the matrix in the image (including disabled and hover — hover shown as a labeled static example, matching the image's "Hover" row).
- Responsive: panels stack to one column on mobile; swatch grids wrap; the button matrix becomes scrollable or stacks; no horizontal page scroll. Desktop composition unchanged.
- Tokens usable elsewhere as `bg-primary-500`, `text-neutral-300`, `rounded-lg`, `shadow-md`, `text-display-1`, etc.
- No new global CSS beyond tokens + body base; everything else is Tailwind utilities.

## Security considerations

- Purely presentational. No tokens, no secrets, no network, no Clerk/Sanity/PostHog wiring. No server/client boundary crossed (page is a server component; primitives are client only if they need interactivity — Input `⌘K`/Select can stay uncontrolled/native and server-safe).
- New deps (`lucide-react`, `clsx`, `tailwind-merge`) are well-known, no install scripts.

## Acceptance criteria

- `/design-system` renders all 14 panels + hero, visually matching `design/synophia-designsystem.png` at ~1440px width.
- Every color swatch, type row, radius, and shadow shows the value label from the image.
- Button, badge, status, input, select primitives exist under `components/ui/`, are typed, and are used by the showcase page.
- Tailwind token classes (`primary-*`, `neutral-*`, `text-display-1`, `rounded-xl`, `shadow-lg`) resolve.
- Page is responsive with no horizontal scroll at 375px.
- `npx tsc --noEmit` clean; `npm run lint` clean; `npm run build` succeeds.

## Checks to run (AGENTS.md §13, web)

1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build`
4. `npm run dev` and load `/design-system`.

## Manual test steps

1. `npm install` (picks up new deps), then `npm run dev`.
2. Open `http://localhost:3000/design-system`.
3. Side-by-side with `design/synophia-designsystem.png` at desktop width: confirm each numbered panel matches — colors + hex, typography samples, type-scale table, spacing scale, radius samples, shadow cards, icon row, button matrix (Primary/Secondary/Tertiary/Text × Default/Hover/Disabled), inputs + select, badges, status indicators, progress bar at 35%, the four cards, navigation + pagination (page 1 active), principles row.
4. Resize to 375px: panels stack, nothing overflows horizontally, text stays legible.
5. Toggle OS dark/light: page stays the dark design-system look (dark-first, intentional).
