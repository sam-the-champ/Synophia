# Implementation prompt: Wire the home page's "All Courses" section to Sanity

## Goal

Replace the home page's hardcoded 3-course placeholder array with a real fetch through the existing server-only data layer (`getCourses()`), so `/` shows the actual seeded catalog and each card links to its real `/courses/[slug]` page. No new routes, no catalog page, no search — just swapping static content for the live one already available.

## Skills / docs read

- `AGENTS.md` §5 (pages are read-only, server-only Sanity client) and §7 (content is grounded, never invented).
- Prior `prompts/course-page.md` for the precedent already agreed with the user: use the real `coverImage` instead of a hand-picked glyph/icon when a component needs to represent an arbitrary course, not just the 3 examples in a reference image.

## Code inspected

- `web/app/page.tsx` — `COURSES` is a local hardcoded array of 3 courses, each with a custom `icon`/`iconClassName` (a black tile with "N", a Docker container icon, "TS" initials) that has no equivalent in the content model.
- `web/components/ui/course-preview-card.tsx` — renders that hardcoded `icon`/`iconClassName` in a tile; no image support.
- `web/sanity/lib/{queries,courses}.ts` — `getCourses()` / `COURSES_QUERY` already return `title`, `slug`, `summary`, `coverImage`, `level`, `price`, `popular`, `studentCount`, `instructor`, `category` for every course, but not a module count or total duration (the card needs both, and the query doesn't currently project `modules` at all).
- `web/lib/format.ts` (added in the course-page work) already has `formatDuration` and `capitalize`, reusable here.
- `web/next.config.ts` already allows `cdn.sanity.io` images (added in the course-page work).

## Decisions and assumptions

1. **`COURSE_CARD_PROJECTION` gets two additive fields**: `"moduleCount": count(modules)` and `"totalSeconds": math::sum(modules[].lessons[]->duration)`. This is the same aggregation pattern already used on `COURSE_BY_SLUG_QUERY`, computed directly without needing to project the full `modules[]` array.
2. **`CoursePreviewCard` drops the `icon`/`iconClassName` props and renders the real `coverImage`** (via `urlFor`, `next/image`) instead. It's the only caller of this component, so this is a direct edit, not a new variant — matches the precedent already set on the course page (§ decision 2 in `course-page.md`).
3. **Each card links to `/courses/${slug}`** (the whole card becomes a `<Link>`), since that page now exists and renders real data.
4. **`app/page.tsx` becomes `async`**, calls `await getCourses()`, maps the result directly (title→title, summary→description, level→capitalized, `totalSeconds`→formatted duration, `moduleCount`→"N modules"). The local `COURSES` array and the now-unused `Container` icon import are removed.
5. **Out of scope, left as-is**: the hero's "Explore Courses" button and the section's "View all courses" link stay inert (`href="#"`) — no catalog/browse page exists yet, and building one isn't part of this request.

## Files touched

- Edit `web/sanity/lib/queries.ts` — add `moduleCount`/`totalSeconds` to `COURSE_CARD_PROJECTION`.
- Edit `web/components/ui/course-preview-card.tsx` — replace icon tile with cover image, wrap in `Link`.
- Edit `web/app/page.tsx` — fetch via `getCourses()`, remove hardcoded data.

## Requirements

- Home page renders all 10 seeded courses (title, summary, level, duration, module count, real cover image) with no invented data.
- Each card navigates to its course's real detail page.
- No client-side Sanity access; fetch stays server-side in the page component.

## Security considerations

- No change to token handling — still server-only via the existing `sanityFetch`/`client` wrapper.

## Acceptance criteria

- `/` shows 10 real course cards from the live dataset; clicking one navigates to that course's `/courses/[slug]` page.
- `npx tsc --noEmit`, `npm run lint`, `npm run build` all pass.

## Checks to run

1. `cd web && npx tsc --noEmit`
2. `cd web && npm run lint`
3. `cd web && npm run build`

## Manual test steps

1. `npm run dev`, open `/` — confirm 10 course cards render with real titles, summaries, levels, durations, module counts, and cover images.
2. Click a card — confirm it lands on the matching `/courses/[slug]` page with matching title.
