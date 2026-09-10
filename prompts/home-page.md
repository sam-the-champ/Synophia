# Implementation prompt: Synophia Home Page

## Revision (design/synopia-home1.png)

The home page was redesigned to a centered, single-column layout with **no left
sidebar**. Changes from the original below:

- Removed the `app/(app)` route group, `components/app-shell/*`, and `components/ui/path-card.tsx`.
- Home page moved back to `app/page.tsx`. It renders its own floating pill top bar
  (logo, "Courses" active pill, "My Learning", bell, avatar) — no shared shell.
- Hero is centered: "Intelligent Learning" eyebrow, "Search your learning in plain
  English." (gradient "English."), subcopy, one gradient/glow "Explore Courses" button,
  and a large glowing search bar ("Ask anything about your learning...", ⌘K). Inert.
- Section renamed "All Courses" with 3 cards: Next.js for Production, Docker Essentials,
  TypeScript Deep Dive. `CoursePreviewCard` reshaped: icon tile top-left, title,
  description, divider, level/duration/modules meta row (no media banner, no category pill).
- Footer reduced to a centered rule: star icon + "New courses and lessons added every week."
- Full-bleed aurora background via layered radial gradients.
- Sections below (Why Synophia, Featured Learning Paths, stats strip) are dropped —
  not in the new reference.

Original prompt retained below for history.

---


## Goal

Reproduce `design/synopia-home.png` as the site's home page at `/` — a dark,
presentational landing/dashboard screen with a fixed left sidebar, top bar, hero,
"Popular Courses", "Why Synophia", "Featured Learning Paths", a stats strip, and a
footer. Match the desktop reference exactly; make it responsive down to mobile
(sidebar collapses, grids stack). Static content only — no data layer yet.

## Skills / docs read

- `AGENTS.md` / `CLAUDE.md` — boundaries (section 5), UI reproduction rule (section 3),
  "build nothing beyond that / do not overbuild" (section 1), checks (section 13).
- `node_modules/next/dist/docs/` — App Router page conventions, server vs client components.

## Code inspected

- `app/page.tsx` — current Create-Next-App placeholder; will be fully replaced.
- `app/layout.tsx` — root layout, Inter via `--font-inter`, `<body class="min-h-full flex flex-col">`.
- `app/globals.css` — Tailwind v4 `@theme` tokens: `primary-{100..600}`, `neutral-{100..900}`,
  `text-display-1/2`, `text-heading-1/2/3`, `text-body-lg/body/small`, `radius-*`, `shadow-*`,
  body bg `neutral-900`.
- `app/design-system/page.tsx` — existing composition patterns (Panel wrapper, grids, spacing).
- `components/ui/*` — `Button` (primary/secondary/tertiary/text + `icon`), `Badge`
  (video/lesson/popular), `Input` (search icon + `shortcut` kbd), `Select`, `Status`,
  `ProgressBar`, `Pagination`, card set. `cn()` in `lib/utils.ts`.
- `package.json` — Next 16.3.4, React 19, Tailwind v4, `lucide-react`, `clsx`, `tailwind-merge`.
  No Sanity/Clerk/PostHog yet.

## Decisions & assumptions

- **Static page, server component.** No Sanity/Clerk/PostHog wiring (not installed; out of
  scope per "do not overbuild"). All copy, course cards, paths, and stats are hardcoded from
  the reference image as placeholder content, kept in local `const` arrays at the top of the
  file so they are trivially swappable for a GROQ fetch later.
- **New route group for the app shell.** Add `app/(app)/layout.tsx` holding the sidebar +
  top bar, and move the home page to `app/(app)/page.tsx`. This keeps the shell reusable for
  later pages (Courses, My Learning) without re-implementing it. The `/design-system` route
  stays outside the group, untouched.
- **Sidebar nav items** (from image): Home (active), Courses, My Learning, Progress,
  Resources, Community. Links point to `#` for now except Home (`/`); real routes land later.
- **Top bar**: logo, centered search input (`Input` with `⌘K` shortcut, non-functional),
  notification bell with dot, avatar with chevron. Avatar uses a placeholder
  (`next/image` with a local SVG or a plain circle with initials) — no external image host.
- **Hero**: eyebrow pill, "Learn without limits with Synophia." (last word in `primary-400`),
  subcopy, "Explore Courses" primary button + "Watch Overview" text button with play circle,
  the decorative orbit/blob graphic on the right reproduced as CSS (radial gradients +
  blurred rounded blob + absolutely-positioned floating chips "Learn Anywhere", "Build
  Skills", "Grow Your Future"). No raster asset for the blob.
- **Big search bar** below hero: full-width `Input` variant, "What do you want to learn
  today?", `⌘K`. Presentational.
- **Popular Courses**: section header + "View all courses" link; 3 course cards. Card matches
  the image (not the design-system `CourseCard`, which is a different, denser shape): media
  area with gradient + icon, circular arrow button top-right, category pill, title,
  description, meta row (level / duration / modules). Add a local `HomeCourseCard` component
  in the page file or `components/ui/` — reuse `Badge`? No, category pill is plain; use a
  small local pill. Prefer a new `components/ui/course-preview-card.tsx` if it stays generic.
- **Why Synophia**: dark panel with eyebrow, "Learn Smarter, Not Harder.", subcopy, a 4-item
  feature row (Flexible Learning / Real Projects / Expert Instructors / Certificate — icon +
  title + caption), a photo on the right with floating chips (Better Skills / Bigger
  Opportunities / Brighter Future). Photo: placeholder (local asset or gradient block) — flag
  that a real image is needed.
- **Featured Learning Paths**: header + "View all paths"; 4 cards (Web Development, Data
  Science, Mobile Development, Product Design) — icon, circular arrow, title, description,
  "N courses · Nh" meta.
- **Stats strip**: 4 stats (50K+ Active Learners, 200+ Expert-Led Courses, 4.8/5 Average
  Rating, 30K+ Community Members) with icons, in a rounded bordered bar.
- **Footer**: logo, center links (Courses / My Learning / About / Support), right tagline
  "Learn · Build · Grow".
- Reuse existing tokens/utilities; add components only where the image's shape genuinely
  differs from what exists. Keep new files minimal.

## Files to touch / add

- `app/(app)/layout.tsx` — new: app shell (sidebar + top bar), client component only if the
  mobile sidebar toggle needs state (it does) — split the toggle into a small client
  `components/app-shell/sidebar.tsx`; keep the layout a server component wrapping it.
- `app/(app)/page.tsx` — new: the home page composition + local placeholder data.
- `app/page.tsx` — delete (replaced by the route-group page).
- `components/app-shell/sidebar.tsx` — new client component: nav list + mobile open/close.
- `components/app-shell/top-bar.tsx` — new: logo, search, bell, avatar.
- `components/ui/course-preview-card.tsx` — new: the image-style course card.
- `components/ui/path-card.tsx` — new: the learning-path card (or inline in page if not reused).
- `public/avatar-placeholder.svg`, `public/learner-placeholder.svg` — new local placeholders,
  or use pure-CSS blocks and skip assets.
- No changes to `app/globals.css` (tokens already cover it) unless a one-off keyframe is
  needed for the blob (add under a small `@layer`), and no changes to `app/layout.tsx`.

## Requirements

- Desktop matches the reference: fixed ~230px left sidebar on `neutral-900` with a faint
  aurora glow at the bottom, main content max-width aligned to the reference, top bar with
  centered search, all sections in order with the same spacing rhythm.
- Colors, type, radii, shadows come only from the existing tokens.
- Active "Home" nav item styled as the filled pill in the image.
- All buttons/inputs are visually correct but inert (no handlers) except the mobile sidebar
  toggle and nav links.
- Responsive: below `lg`, sidebar becomes a slide-in drawer with a hamburger in the top bar;
  hero graphic drops below or hides; course/path grids collapse to 1–2 columns; stats wrap;
  footer stacks. No horizontal scroll at 375px. Desktop composition unchanged.
- Semantic landmarks: `<nav>`, `<main>`, `<footer>`; nav links keyboard-focusable; images
  have `alt`.

## Security considerations

- Purely presentational. No secrets, no network, no Clerk/Sanity/PostHog, no server/client
  boundary crossed beyond a client sidebar toggle. No new dependencies. No external image
  hosts (placeholders are local).

## Acceptance criteria

- `/` renders the full page matching `design/synopia-home.png` at ~1280–1440px width.
- Sidebar, top bar, hero, big search, Popular Courses (3), Why Synophia, Featured Learning
  Paths (4), stats strip (4), footer all present with reference copy.
- `/design-system` still renders unchanged.
- Responsive with no horizontal scroll at 375px; sidebar drawer opens/closes.
- `npx tsc --noEmit` clean; `npm run lint` clean; `npm run build` succeeds.

## Checks to run (AGENTS.md §13, web)

1. `npx tsc --noEmit`
2. `npm run lint`
3. `npm run build`
4. `npm run dev`, load `/` and `/design-system`.

## Manual test steps

1. `npm run dev`, open `http://localhost:3000/`.
2. Side-by-side with `design/synopia-home.png` at ~1440px: verify sidebar items and active
   state, top bar, hero heading/subcopy/buttons/graphic chips, big search bar, Popular
   Courses cards and meta, Why Synophia panel + feature row + floating chips, Featured
   Learning Paths cards, stats strip values, footer.
3. Resize to 375px: hamburger appears, sidebar opens as a drawer and closes on
   backdrop/nav click, all grids stack, nothing overflows horizontally.
4. Open `/design-system` — confirm it is visually unchanged.
5. Tab through the page — nav links and buttons are focusable with visible focus rings.
