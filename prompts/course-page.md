# Implementation prompt: Course detail page

## Goal

Add the course detail page at `/courses/[slug]`, reproducing `design/synophia-course.png`, wired to live Sanity content via the existing server-only data layer. Read-only, no new writes, no search, no video ingestion, no progress backend (those are separate AGENTS.md deliverables).

## Skills / docs read

- `AGENTS.md` / `CLAUDE.md` — data model (§8), workspace boundaries (§5), UI reproduction rule (§3, "reproduce exactly," "do not restyle or improve beyond the reference"), decisions already made (§7: progress tracked per learner, lesson page is a separate deliverable), checks (§13).
- `node_modules/next/dist/docs/` — App Router dynamic segment (`app/courses/[slug]/page.tsx`), `notFound()`, `generateMetadata`, `next/image` remote patterns.
- `sanity-best-practices` — GROQ projection and TypeGen conventions already established in this repo (`defineQuery`, `sanityFetch`).

## Code inspected

- `web/sanity/lib/queries.ts`, `courses.ts`, `fetch.ts`, `image.ts`, `env.ts` — `getCourseBySlug(slug)` already exists and returns the course with `instructor`, `category`, and `modules[].lessons[]` resolved. `sanityFetch` tags by `course:${slug}` for revalidation.
- `studio/schemaTypes/documents/{course,lesson}.ts`, `objects/{module,learning-outcome}.ts` — confirmed field names: `course.whatYoullLearn[]` (`learningOutcome`: `icon`/`title`/`description`), `course.modules[]` (`title`/`summary`/`lessons[]`), `lesson.poster`, `lesson.duration` (seconds), `lesson.freePreview`.
- **Live dataset check** (queried `qjt0bx6o`/`production` directly with the existing read token): the seeded content does **not** match those schema field names — courses store `learningOutcomes` (schema: `whatYoullLearn`) and lessons store `thumbnail` (schema: `poster`). All 10 seeded courses have exactly 4 modules / 12 lessons, `popular` true on 4 of them, and `learningOutcome.icon` values in the wild are `sparkles`, `code`, `workflow`, `gauge`, `layers`, `rocket`, `shield`, `puzzle` — none of which are in the schema's `ICON_OPTIONS` list (`video`/`code`/`certificate`/`community`/`lifetime-access`/`support`), so the Studio's own dropdown is already stale against the seed. `math::sum(modules[].lessons[]->duration)` works for a total-duration figure.
- `web/components/{top-bar.tsx, ui/{button,badge,card,progress-bar,course-preview-card}.tsx}`, `lib/utils.ts` — reusable pieces: `Badge variant="popular"` renders the exact "POPULAR" pill; `ProgressBar` renders the "N% complete" bar; `Button` has `primary`/`secondary` variants matching "Continue Learning" / "Bookmark"; `cn()` helper.
- `web/app/page.tsx`, `app/layout.tsx`, `app/globals.css` — `max-w-5xl` content width, `neutral-900`/`primary-*` tokens, gradient-on-last-word heading pattern already used in the hero H1, sticky `TopBar`.
- `web/next.config.ts` — no `images.remotePatterns` yet; this page is the first to render a real Sanity image, so `cdn.sanity.io` needs adding.
- No `/courses` catalog route and no `/lessons/[slug]` route exist yet (only `/` shows 3 hardcoded course cards, and lesson pages are a separate AGENTS.md deliverable).

## Decisions and assumptions

1. **Fix the field-name mismatch in the read layer, not the schema or the data.** Add `"whatYoullLearn": coalesce(whatYoullLearn, learningOutcomes)` and `"poster": coalesce(poster, thumbnail)` to the relevant GROQ projections in `queries.ts`. This keeps the schema (source of truth per the approved content-model prompt) unchanged, requires no write-token migration, and is forward-compatible once the seed/schema drift is reconciled separately. Flagging the drift itself as a "needs your attention" item — it should get a real fix (either rename the schema fields or fix the seed importer) so Studio editing isn't stuck writing to a field the front end ignores.
2. **Cover art uses the real `coverImage`,** not the reference screenshot's hardcoded "N" glyph tile. The screenshot is one example course; every seeded course has an authored `coverImage` asset, so rendering it (via `next/image` + `urlFor`) is the generalizable, grounded choice for a route that serves any of the 10 courses.
3. **Instructor is not shown on this page.** The reference image has no instructor byline anywhere in the hero or content sections. AGENTS.md §3 says match the reference exactly and not add beyond it; instructor surfacing happens on the (separate, future) lesson page and instructor page.
4. **"Course Content" rows are modules, not lessons** — the numbered rows in the reference ("1 Introduction to Next.js", with a one-line summary and a duration) map to `course.modules[]` (`title`/`summary`), matching our data exactly. Each row is a client-side expand/collapse (chevron) revealing that module's lessons (title, formatted duration, a small "Free preview" tag when `freePreview` is true). Per-module duration and the "N modules • Xh Ym" header total are computed by summing `lessons[].duration`. "Show all N modules" only renders when `modules.length > 6` (none of the seeded courses trigger it today, but the component stays generic).
5. **"Continue Learning" and "Bookmark" are inert**, matching the precedent already set on the home page for buttons whose target doesn't exist yet (no lesson page, no bookmark backend). Same for the lesson rows inside an expanded module — they show data but are not links.
6. **"Your Progress" panel is presentational-only, pinned to 0%.** No progress-tracking data model exists yet (AGENTS.md §1 lists it as a separate deliverable). Rendering a fabricated non-zero percentage would violate the project's "never invent data" principle even though that rule is written for search; the honest default until progress ships is 0%. The section is still rendered (reference requires reproducing it) with the real `ProgressBar` component.
7. **Breadcrumb "All Courses" links to `/`** — there's no dedicated `/courses` catalog page yet (that's the home page's "All Courses" section); building one is out of scope for this task.
8. **Gradient-on-last-word heading**, consistent with the home page's H1 treatment: the last word of `course.title` gets the `primary-300`→`primary-500` gradient clip, the rest stays white.
9. **Level label** is capitalized from the stored enum (`intermediate` → `Intermediate`); **student count / lesson/module counts** use a small `formatCompactNumber` (Intl compact notation, lowercased unit) to get `2.1k`-style output; **duration** (seconds) formats as `18h 24m` / `45m` via a small `formatDuration` helper.
10. Static `generateMetadata` from the course title/summary; `notFound()` when the slug doesn't resolve.

## Files touched

**Create:**
- `web/app/courses/[slug]/page.tsx` — server component: fetch, `notFound()`, compose sections.
- `web/components/course/course-hero.tsx` — cover image, badge, title, meta row, action buttons.
- `web/components/course/what-youll-learn.tsx` — 2×2 outcome cards + icon map (`sparkles/code/workflow/gauge/layers/rocket/shield/puzzle` → lucide icons, with a default fallback icon for any future value).
- `web/components/course/course-content.tsx` — client component: module list, expand/collapse, "Show all N modules".
- `web/lib/format.ts` — `formatDuration(seconds)`, `formatCompactNumber(n)`, `capitalize(s)`.

**Edit:**
- `web/sanity/lib/queries.ts` — add the two `coalesce(...)` aliases and a `"totalSeconds": math::sum(modules[].lessons[]->duration)` field to `COURSE_BY_SLUG_QUERY`.
- `web/next.config.ts` — add `images.remotePatterns` for `cdn.sanity.io`.
- `web/app/page.tsx` — point the existing "All Courses" `View all courses` link and the 3 hardcoded card `href`s stay as-is (out of scope); no change needed unless build reveals otherwise.

No schema, seed, or Studio changes in this task.

## Requirements

- Route: `app/courses/[slug]/page.tsx`, server component, calls `getCourseBySlug(params.slug)`, `notFound()` if null.
- Desktop layout matches the reference 1:1: sticky `TopBar`, breadcrumb, two-column hero (cover art + content), "What you'll learn" 2×2 grid, "Course Content" numbered list with per-row duration and chevron, bottom "Your Progress" panel with `ProgressBar` + a duplicate "Continue Learning" button.
- Responsive to ~375px: hero stacks to one column (image on top), the 2×2 grid becomes 1 column, module rows keep their duration visible, no horizontal scroll.
- All data rendered is real: title, summary, level, price is **not** shown (absent from the reference), popularity badge only if `popular`, student count, category is fetched but not displayed (absent from reference — don't invent a spot for it), module/lesson titles, summaries, durations, free-preview tags.
- Reuse `Badge`, `Button`, `ProgressBar`, `cn()` as-is; only add new components where the reference shape doesn't already exist in `components/ui`.
- Accessible: `<nav aria-label="Breadcrumb">`, expand/collapse buttons are real `<button>`s with `aria-expanded`, images have `alt` (from the Sanity asset's `alt` field, falling back to the course title).

## Security considerations

- Page stays a server component; the Sanity read token never reaches the client. No new client-side data fetching.
- `next.config.ts` remote pattern is scoped to `cdn.sanity.io` only.
- No mutation, no write client, no user input collected on this page.

## Acceptance criteria

- `/courses/nextjs-app-router-in-depth` (and the other 9 seeded slugs) render with real title, summary, cover image, level, duration, module count, student count, "What you'll learn" cards with correct icons, and the module list with correct per-module durations summing to the header total.
- `/courses/does-not-exist` renders the Next.js not-found page.
- Visually matches `design/synophia-course.png` at ~1280–1440px (module list content will differ per course; layout/spacing/typography must match).
- No horizontal scroll at 375px; hero and grids stack correctly.
- `npx tsc --noEmit`, `npm run lint`, and `npm run build` all pass in `web`.

## Checks to run (AGENTS.md §13, web)

1. `cd web && npx tsc --noEmit`
2. `cd web && npm run lint`
3. `cd web && npm run build`
4. `cd web && npm run dev`, load `/courses/nextjs-app-router-in-depth`

## Manual test steps

1. `npm run dev` in `web`, open `http://localhost:3000/courses/nextjs-app-router-in-depth`.
2. Compare side-by-side with `design/synophia-course.png`: breadcrumb, cover art, POPULAR badge, title gradient on last word, meta row icons, buttons, "What you'll learn" grid, "Course Content" list, progress panel.
3. Click a module row's chevron — it expands to show that module's lessons with formatted durations and a "Free preview" tag on the one lesson that has it.
4. Try 2–3 other seeded slugs (e.g. `python-for-data-work`, `practical-web-security`) to confirm the page holds up with different content lengths/icons.
5. Visit `/courses/not-a-real-course` — confirm the Next.js 404 page.
6. Resize to 375px — confirm the hero stacks, grids go to 1 column, no horizontal scroll.
7. Tab through the page — breadcrumb link, module expand buttons, and action buttons are all keyboard-focusable with visible focus rings.
