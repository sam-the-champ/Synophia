# Implementation prompt: Courses catalog page + home page trim

## Goal

Limit the home page's "All Courses" section back to 3 courses (matching the original home-page reference), add a real `/courses` catalog page listing every course, and wire the "Courses" nav item and "View all courses" link to it. This is the "catalog" deliverable from AGENTS.md §1, which hasn't been built as its own route yet.

## Skills / docs read

- `AGENTS.md` §1 (catalog is an explicit deliverable), §3 (no design reference exists for this page — reuse existing components/patterns rather than inventing new visual language), §5 (pages are read-only).
- `node_modules/next/dist/docs/` — App Router route conventions, `usePathname` for nav active-state.

## Code inspected

- `web/app/page.tsx` — currently renders **all** courses from `getCourses()` in the "All Courses" section (a regression from the original 3-card reference, introduced when I wired it to live data). "View all courses" links to `#`.
- `web/components/top-bar.tsx` — `NAV` is a hardcoded array with `Courses` always `active: true` and both items pointing to `href: "#"`. It's a client component already (`"use client"`, uses `useState` for the mobile menu).
- `web/components/ui/course-preview-card.tsx` — already data-driven (real `coverImage`, links to `/courses/${slug}`), reusable as-is for the catalog grid.
- `web/sanity/lib/courses.ts` / `queries.ts` — `getCourses()` returns all courses ordered by title, already carrying everything `CoursePreviewCard` needs.
- No design image exists for a dedicated catalog page (the only reference so far is the home page and the course detail page).

## Decisions and assumptions

1. **Home page reverts to showing the first 3 courses** from `getCourses()` (existing title-asc order — no curation logic beyond that, since nothing in the data model marks a course as "featured" beyond `popular`, and the section is literally titled "All Courses", i.e. a preview, not a curated pick).
2. **New route `/courses`** is a plain, read-only listing: reuses the existing "All Courses" grid pattern from the home page (same `CoursePreviewCard`, same `max-w-5xl`/grid layout, same dark/aurora-free background consistent with the course detail page) since there's no design reference to match instead — per AGENTS.md §3's instruction to reuse existing components/patterns when no reference exists, rather than inventing new visual design.
3. **`TopBar`'s nav becomes pathname-aware**: `usePathname()` computes `active` per item instead of a hardcoded flag; "Courses" points to `/courses` and is active on `/courses` and any `/courses/[slug]` (via `startsWith`); "My Learning" stays `href="#"` (that page doesn't exist yet) and is never active. On `/` neither item is active, which is correct now that the catalog has its own route.
4. **"View all courses" on the home page links to `/courses`.**
5. No pagination, filtering, or sorting on `/courses` — 10 seeded courses fit on one page; that's the full "browse" surface AGENTS.md asks for here, not the search results page (a separate, later deliverable per §11).

## Files touched

- Edit `web/app/page.tsx` — slice to first 3 courses, fix the "View all courses" `href`.
- Create `web/app/courses/page.tsx` — catalog page, `getCourses()`, grid of `CoursePreviewCard`.
- Edit `web/components/top-bar.tsx` — pathname-aware active state, real `Courses` href.

## Requirements

- `/` shows exactly 3 course cards.
- `/courses` shows all seeded courses (10 today) in the same card style, each linking to its detail page.
- Nav "Courses" is visually active on `/courses` and `/courses/[slug]`, and not active on `/`.
- No client-side Sanity access; catalog page fetch is server-side.

## Security considerations

- No change to token handling. `usePathname` is a client-side routing hook only, no data implications.

## Acceptance criteria

- `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass.
- Manual test steps below confirmed against the live dataset.

## Checks to run

1. `cd web && npx tsc --noEmit`
2. `cd web && npm run lint`
3. `cd web && npm run build`

## Manual test steps

1. `npm run dev`, open `/` — confirm exactly 3 course cards.
2. Click "View all courses" — lands on `/courses` with all 10 courses.
3. Click the "Courses" nav item from `/` — lands on `/courses`, nav item now shows active.
4. Click a card on `/courses` — lands on that course's `/courses/[slug]` page, nav "Courses" still shows active there.
5. Back on `/`, confirm neither nav item shows active.
