# Sanity content model, standalone Studio, and server-side read data layer

## Goal

Model the core synophia content (course, module, lesson, instructor, category) in Sanity, move Studio authoring out of the Next.js app into its own standalone workspace, and build the server-only data-access layer in the web app that pages will later call to read that content. No pages, no search, no video ingestion, no progress tracking — those are separate tasks.

## Skills read

- `sanity-best-practices` (`.claude/skills/sanity-best-practices/SKILL.md`) and its references: `project-structure.md`, `schema.md`, `nextjs.md`, `typegen.md`.

## Code inspected

- Root `package.json`: a single Next.js 16.3.4 app (React 19, Tailwind v4, Clerk, `next-sanity`, `sanity`, `@sanity/vision`, `@sanity/image-url`) with no workspace tooling.
- `sanity.config.ts` (root, `'use client'`, `basePath: '/studio'`), `sanity.cli.ts` (root), `sanity/env.ts`, `sanity/lib/{client,image,live}.ts`, `sanity/structure.ts`, `sanity/schemaTypes/index.ts` (empty schema) — all **untracked**, scaffolded by `create-next-app`'s embedded Sanity flow.
- `app/studio/[[...tool]]/page.tsx` — mounts `<NextStudio />` at `/studio`, embedding the Studio inside the Next.js app.
- Existing app surface to preserve as-is: `app/{layout,page,globals.css}`, `app/design-system/page.tsx`, `app/sign-in/[[...sign-in]]/page.tsx`, `app/sign-up/[[...sign-up]]/page.tsx`, `components/{top-bar.tsx,ui/*}`, `lib/utils.ts`, `public/`, `proxy.ts` (Next 16's middleware file, wires `clerkMiddleware()`), `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `tsconfig.json` (path alias `@/*` → `./*`).
- `.env.local` / `.env.example`: currently mix Clerk vars with `NEXT_PUBLIC_SANITY_PROJECT_ID=qjt0bx6o` and `NEXT_PUBLIC_SANITY_DATASET=production`. No `SANITY_API_READ_TOKEN` yet (dataset is currently public/default — will be tightened below).
- Empty `web/` and `studio/` folders already exist at repo root, i.e. the two-workspace split AGENTS.md mandates was anticipated but not yet done.
- Confirmed with the user: do the full restructure now rather than deferring it or keeping the embedded scaffold.

## Decisions and assumptions

1. **Two independent workspaces, no npm-workspaces tooling** (per `project-structure.md`'s "Monorepo (Recommended)" pattern — "No workspace tooling is required — each app manages its own dependencies"). `studio/` and `web/` each get their own `package.json`, `node_modules`, and `.env.local`. Root keeps no `package.json` — check the two workspaces with `cd web && npm run <script>` / `cd studio && npm run <script>`, matching AGENTS.md §13's "run these from the correct workspace."
2. **Delete the embedded scaffold entirely**: root `sanity.config.ts`, `sanity.cli.ts`, `sanity/`, `app/studio/`. `styled-components` (a Studio peer dependency) moves out of the web dependency list.
3. **Move the existing Next.js app into `web/` verbatim** (git mv, no content changes): `app/`, `components/`, `lib/`, `public/`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `tsconfig.json`, `next-env.d.ts`, `proxy.ts`, `app/globals.css`, plus a new `web/package.json` carrying the web-only dependencies (Next, React, Clerk, Tailwind, `next-sanity`, `@sanity/image-url`, `clsx`, `tailwind-merge`, `lucide-react`) and a fresh `web/package-lock.json`/`node_modules` via `npm install`.
4. **New standalone Studio in `studio/`**: `sanity.config.ts` (no `'use client'`, Studio mounts at `/`, not `/studio`), `sanity.cli.ts` with `typegen` configured to scan `../web/**/*.{ts,tsx}` and emit `../web/sanity.types.ts`, `schemaTypes/` (documents + objects), `structure.ts`. Own `package.json` (`sanity`, `@sanity/vision`, `@sanity/icons`, `typescript`) and own `.env.local` using the `SANITY_STUDIO_*` prefix the Studio CLI requires (`SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`) — different prefix than the web app's `NEXT_PUBLIC_SANITY_*`, both pointing at the same project/dataset.
5. **No Visual Editing / Live Content API / draft mode** in this task. AGENTS.md scopes pages as read-only display fed by a server-only client; the browser never talks to Sanity. So `web/sanity/lib/client.ts` is a plain server-only `createClient` (no `defineLive`, no `SanityLive`, no stega, no browser token) — simpler and matches the "browser holds no token" rule more directly than the Live Content API pattern, which is built around exposing content to client-side Visual Editing.
6. **Dataset moves to token-gated reads.** AGENTS.md §12 says the dataset is private and reads use a server token. Today it's public (no token in env). This prompt adds `SANITY_API_READ_TOKEN` (a Sanity **Viewer** token, server-only) to `web/.env.local`/`.env.example`, and the Studio dataset should be switched to private in Sanity's project settings as part of this change (manual step, called out in acceptance criteria — I cannot flip that setting from code).
7. **Revalidation:** tag-based, via a small `sanityFetch` wrapper (`web/sanity/lib/fetch.ts`) that calls `client.fetch(query, params, { next: { tags } })`, plus a path for `useCdn: false` fetches (e.g. `generateStaticParams` later). No webhook route in this task — that's for whoever builds the pages/revalidation story next; the wrapper just takes tags so that's a drop-in later.
8. **Module stays an embedded object**, per AGENTS.md §8: "A module is an embedded object inside a course, not its own document." `course.modules[]` is an array of `module` objects, each holding an ordered array of **references** to `lesson` documents (lessons are reusable/standalone, not nested).
9. **Lesson does not store its course.** Course/module/lesson-index labels ("Lesson 5.1") are derived, never stored. The data layer resolves a lesson's parent course/module/index with a reverse `references()` query plus in-code index lookup (GROQ can't cheaply return a match's array index).
10. **Field-shape calls left to me** (spec says "everything else... is yours to choose sensibly"):
    - `course.price`: `number` (no currency object — single-currency for now).
    - `course.level`: `string` with `options.list` (`Beginner`/`Intermediate`/`Advanced`).
    - `course.whatYoullLearn[]` (`learningOutcome` object): `icon` (`string`, curated `options.list` of semantic tokens like `video`, `certificate`, `code`, `community`, `lifetime-access`, `support` — not a Lucide component name, keeping content decoupled from the rendering library per "data over presentation"), `title`, `description`.
    - `lesson.duration`: `number` (seconds) — consistent with the timestamped-chapter/transcript model section 8/9 will add later, and easy to format either way in the UI.
    - `lesson.resources[]` (`resource` object): `type` (`string` `options.list`: `pdf`, `code`, `link`, `download`), `title`, `description`, `url`.
    - `instructor.expertise`: `array` of `string` tags.
    - Slugs (`course`, `lesson`, `instructor`, `category`) all use `slugify` from title, validated unique via the async-uniqueness pattern in `schema.md`.
11. **Studio structure**: a custom `structure.ts` with explicit top-level lists for Courses, Lessons, Instructors, Categories (in that order), falling back to `S.documentTypeListItems()` for anything else added later.
12. **No `agentContext`, `video`, or `progress` document types in this task** — explicitly out of scope per the user's request (course/module/lesson/instructor/category + the read data layer only).

## Files touched

**Delete:** `sanity.config.ts`, `sanity.cli.ts`, `sanity/`, `app/studio/`, root `package.json`/`package-lock.json`/`node_modules` (recreated per-workspace), root `.env.local`/`.env.example` (split into `web/` and `studio/`).

**Move (git mv) into `web/`:** `app/`, `components/`, `lib/`, `public/`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs`, `tsconfig.json`, `next-env.d.ts`, `proxy.ts`.

**Create in `web/`:** `package.json`, `.env.local`, `.env.example`, `sanity/env.ts`, `sanity/lib/client.ts`, `sanity/lib/fetch.ts`, `sanity/lib/image.ts`, `sanity/lib/queries.ts`, `sanity/lib/courses.ts`, `sanity/lib/lessons.ts`, `sanity/lib/instructors.ts`, `sanity/lib/categories.ts` (data-access functions), `sanity.types.ts` (generated, committed after first `typegen` run).

**Create in `studio/`:** `package.json`, `.env.local`, `.env.example`, `sanity.config.ts`, `sanity.cli.ts`, `structure.ts`, `schemaTypes/index.ts`, `schemaTypes/documents/{course,lesson,instructor,category}.ts`, `schemaTypes/objects/{module,learningOutcome,resource}.ts`.

**Repo root:** updated `.gitignore` (add `web/sanity.types.ts`'s sibling `schema.json`, keep `node_modules`/`.env*` rules workspace-agnostic since they already glob), no root `package.json`.

## Requirements

- Schema fields exactly match AGENTS.md §8's fixed shape (title/slug everywhere, course→instructor/category references, course→modules[]→lessons[] refs, lesson notes as Portable Text, key points, pro tip, resources, instructor bio/expertise/photo, category description).
- All schema files use `defineType`/`defineField`/`defineArrayMember`, an icon from `@sanity/icons/<Name>` on every document/object, required-field validation on the fields that must never be empty (title, slug on every named type; course→instructor/category; lesson→videoUrl).
- Studio config: no `'use client'`, mounts at Studio root (`/`), reads `SANITY_STUDIO_PROJECT_ID`/`SANITY_STUDIO_DATASET`. TypeGen enabled in `sanity.cli.ts`, pointed at `../web`.
- `web/sanity/lib/client.ts` never imports into a Client Component — guard with the `server-only` package. Token read from `process.env.SANITY_API_READ_TOKEN`, never exposed with `NEXT_PUBLIC_`.
- Data-access functions return typed results via `defineQuery` + generated types (no manual interfaces duplicating the schema). One function per read need: `getCourses()`, `getCourseBySlug(slug)`, `getLessonBySlug(slug)` (returns the lesson plus its derived course/module/lesson-index context), `getInstructorBySlug(slug)` (with their courses), `getCategories()`.
- Portable Text and array fields project `_key` wherever the web layer will map over them later.
- `web/.env.example` and `studio/.env.example` are the canonical, committed list of env vars for each workspace (no secrets in either).

## Security considerations

- `SANITY_API_READ_TOKEN` and `CLERK_SECRET_KEY` stay server-only, never prefixed `NEXT_PUBLIC_`, never referenced from a Client Component.
- `web/sanity/lib/client.ts` imports `server-only` so any accidental client-side import fails the build instead of leaking the token at runtime.
- No write client, no mutation code, added anywhere in `web/` — this task is read-only per AGENTS.md §5.
- Studio's own `.env.local` is git-ignored like the web one; `studio/.env.example` has empty values only.

## Acceptance criteria

- `cd studio && npm run dev` starts the Studio at `localhost:3333` with Courses/Lessons/Instructors/Categories visible and creatable, and creating a course with modules/lessons/instructor/category works end-to-end in the Studio UI.
- `cd studio && npm run build` succeeds.
- `cd web && npm run build` succeeds (verifies the moved app still compiles with the new `web/package.json`/`tsconfig.json`).
- `cd web && npm run lint` passes.
- Calling each of the five data-access functions against the live dataset (via a throwaway script or the Vision plugin's equivalent query) returns the expected shape once at least one course/lesson/instructor/category exists in the dataset.
- No file under `web/` imports `sanity` or `@sanity/vision`; no file under `studio/` imports `next` or `@clerk/nextjs`.
- Manual: switching the dataset to private in Sanity project settings and confirming `getCourses()` still succeeds with the read token (and fails without one) — this dataset-visibility flip itself is a manual step in Sanity Manage, not something this PR can script.

## Checks to run

- `cd studio && npm run build`
- `cd web && npm run build && npm run lint`
- `cd studio && npm run typegen` (or rely on `sanity dev`/`sanity build` auto-generating) — confirm `web/sanity.types.ts` is non-empty and matches the schema.

## Manual test steps

1. `cd studio && npm install && npm run dev` → open `http://localhost:3333`, confirm the desk shows Courses, Lessons, Instructors, Categories in that order.
2. Create one Category, one Instructor, one Lesson (fill notes, key points, a resource), then one Course referencing that instructor/category and adding a module containing that lesson. Publish all four.
3. `cd web && npm install` (fresh lockfile) → confirm `npm run build` and `npm run lint` pass.
4. Add `SANITY_API_READ_TOKEN` (a Viewer token from Sanity Manage) to `web/.env.local`.
5. Write a one-off `web/scripts/smoke.ts` (or use `tsx`) that calls `getCourses()`, `getCourseBySlug()`, `getLessonBySlug()`, `getInstructorBySlug()`, `getCategories()` and logs the results; run it and confirm each returns the document created in step 2, with the lesson's derived module/lesson index correct.
6. Confirm `web` still runs (`npm run dev`) and the existing home page, sign-in/sign-up, and design-system routes render unchanged.
