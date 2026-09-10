# Implementation prompt: Clerk Authentication

## Goal

Add Clerk authentication to the synophia web app using the Clerk CLI, linked to the
Clerk application `app_3J8TMv1YcgUN9Ez2rZblrjHqSLZ`. Browsing stays fully public; no
routes are gated yet (learner progress / My Learning arrive later). The nav gets real
sign-in / sign-up / signed-in controls so the user can create their first account.

## Skills / docs read

- `AGENTS.md` / `CLAUDE.md` — §5 boundaries (Clerk wired through Next.js middleware,
  secret key server-only, only publishable key in browser, protect private routes in
  middleware not client code), §6 tech stack (Clerk), §7 (Clerk is the auth, keep
  browsing public and gate only what a feature marks protected, per-user state keys off
  the Clerk user id — later), §12 (secret key server-only; `.env.example` is the
  canonical committed list; never print env files), §13 checks.
- `.claude/skills/clerk/SKILL.md` + `.claude/skills/clerk/clerk-setup` router — version
  detection: Next 16 → `@clerk/nextjs` v7+ ("current" SDK), `@clerk/nextjs` not
  `@clerk/clerk-react`.
- `node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md` — **Next.js 16
  renames Middleware to Proxy**: the file is `proxy.ts` at project root, same level as
  `app/`, exporting a `proxy` function + `config.matcher`.
- `.agents/skills/clerk-nextjs-patterns/templates/nextjs-basic-auth/{proxy.ts,app/layout.tsx}`
  — reference shapes for `clerkMiddleware()` and `<ClerkProvider>` + `<Show>` controls.
- The task doc "Add Clerk Authentication" (Quick Setup steps 1–8).

## Code inspected

- `package.json` — Next 16.3.4, React 19.2, Tailwind v4, `lucide-react`, `clsx`,
  `tailwind-merge`. No Clerk / Sanity / PostHog yet. Scripts: `dev`, `build`, `start`,
  `lint` (`eslint`). Single workspace at repo root (the web/Studio split in AGENTS §5 is
  not built yet).
- `app/layout.tsx` — root layout, Inter via `--font-inter`, `<body class="min-h-full
  flex flex-col">`. No provider yet.
- `components/top-bar.tsx` — `"use client"` floating pill header. Has a presentational
  notification bell (keep — §7 "notifications bell" is presentational) and a **fake
  account button** rendering hardcoded initials "JL" + chevron. This is what gets
  replaced with real Clerk controls.
- `app/page.tsx` — renders `<TopBar />`. `app/design-system/page.tsx` — does not.
- No `components.json` at root → shadcn/`@clerk/ui` step is skipped.
- No `.env*` at repo root → need a committed `.env.example`.

## Decisions & assumptions

- **Install with `clerk init` at the repo root** against the existing Next app. The
  AGENTS §5 web/Studio workspace split does not exist yet; when it lands, the Clerk
  config moves into `web/` with the rest of the Next app. Flag this.
- **CLI flow**: `clerk auth login` is interactive — I will run it and pause for the user
  to finish the browser login, then continue. `clerk init --app
  app_3J8TMv1YcgUN9Ez2rZblrjHqSLZ` (no `--framework` / `--pm` — detection handles an
  existing project). Let `clerk init` install `@clerk/nextjs`, add `<ClerkProvider>`,
  create the proxy/middleware file, and write env keys (temporary dev keys via the
  linked app).
- **Proxy vs middleware**: Next 16 uses `proxy.ts`. Whatever `clerk init` generates
  (`proxy.ts` or `middleware.ts`), I will verify it exports `clerkMiddleware()` and sits
  at repo root. Matcher: keep the Clerk-generated matcher. The task's
  `'/__clerk/:path*'` after `'/(api|trpc)(.*)'` note is for "Next.js 15 and earlier" —
  I will add it only if the generated matcher lacks a Clerk proxy path and `clerk
  doctor` / the CLI asks for it. No `createRouteMatcher` protection — nothing is gated
  yet, so `proxy.ts` just runs `clerkMiddleware()`.
- **`<ClerkProvider>`** wraps `{children}` **inside `<body>`** in `app/layout.tsx` (not
  around `<html>`), per the critical rules. If `clerk init` already added it, leave it;
  if it wrapped `<html>`, move it inside `<body>`.
- **Auth controls in the nav** — replace only the fake "JL" account button in
  `components/top-bar.tsx`:
  - `<SignedOut>`: a `SignInButton` (mode="modal") styled as the existing tertiary/ghost
    pill, and a `SignUpButton` (mode="modal") styled as the primary gradient pill to
    match the nav's visual language.
  - `<SignedIn>`: `<UserButton />` in place of the avatar circle.
  - Keep the bell untouched. Keep the mobile menu toggle. Import from `@clerk/nextjs`
    (the file is already `"use client"`, which is fine; these components also work in
    RSC — no change to the directive needed either way).
  - Use `appearance` only if the default Clerk button chrome clashes badly with the dark
    pill; prefer wrapping `SignInButton`/`SignUpButton` with `asChild`-style custom
    `<button>` children so existing Tailwind classes apply. No design reference exists
    for auth (AGENTS §3), so keep it minimal and consistent with the current nav.
- **`.env.example`** — create/commit at repo root as the canonical list:
  `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=` and `CLERK_SECRET_KEY=` (plus
  `NEXT_PUBLIC_CLERK_SIGN_IN_URL` / `SIGN_UP_URL` only if `clerk init` adds them).
  Never read or print the real `.env` / `.env.local`. Confirm `.env*.local` is
  git-ignored (Next's default `.gitignore` covers it; verify).
- **No route protection, no `auth()` calls, no user sync, no progress** — out of scope;
  those are later features. `auth()` is async in Next 15+ — noted for later.
- Do not remove or hand-edit the `next dev` agent-files block; commit it if it appears.

## Files to touch / add

- `package.json` / lockfile — `@clerk/nextjs` added by `clerk init`.
- `proxy.ts` (or `middleware.ts`) at repo root — created by `clerk init`; verified /
  corrected to `clerkMiddleware()` with a root-level matcher.
- `app/layout.tsx` — `<ClerkProvider>` inside `<body>` wrapping `{children}` (by
  `clerk init` or by me).
- `components/top-bar.tsx` — swap the fake account button for
  `<SignedIn>/<SignedOut>` + `SignInButton` / `SignUpButton` / `UserButton`.
- `.env.example` — new, committed. `.env.local` — written by `clerk init` (git-ignored,
  not committed, not printed).
- `.gitignore` — verify `.env*.local` present; add if missing.
- Possibly `app/globals.css` — only if a Clerk appearance CSS variable tweak is needed
  for legibility on dark; avoid if possible.

## Requirements

- `@clerk/nextjs` (v7+) installed; app builds and runs.
- Proxy/middleware file at repo root runs `clerkMiddleware()`; no routes gated.
- `<ClerkProvider>` inside `<body>`.
- Nav shows Sign in + Sign up when signed out, `<UserButton>` when signed in, styled to
  match the existing dark pill nav; bell and mobile toggle unchanged.
- Secret key only in `.env.local` (server); only `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  reaches the browser. `.env.local` git-ignored and never printed.
- `.env.example` committed with the Clerk key names.
- `/` and `/design-system` still render; desktop layout of the nav visually unchanged
  apart from the auth control.

## Security considerations

- `CLERK_SECRET_KEY` server-only, in `.env.local`, never in client code, never printed
  or committed.
- Only the `NEXT_PUBLIC_` publishable key is exposed to the browser (Clerk/Next
  convention).
- No secrets in the repo; `.env.example` holds names with empty values only.
- Route protection stays in `proxy.ts` (server), not client code — none added now, but
  the file is the designated place for it later.
- No new external image hosts; `<UserButton>` serves avatars from Clerk's domain via its
  own iframe/components.

## Acceptance criteria

- `clerk doctor` passes (or only warns about items requiring dashboard config).
- `npx tsc --noEmit` clean; `npm run lint` clean; `npm run build` succeeds.
- `npm run dev`: `/` loads, nav shows Sign in / Sign up; completing sign-up in the modal
  swaps the nav to `<UserButton>`; `/design-system` unaffected.
- `git grep` shows no secret key value in tracked files; `.env.local` is untracked.
- `proxy.ts`/`middleware.ts` present at root with `clerkMiddleware()`.

## Checks to run (AGENTS.md §13, web)

1. `clerk doctor`
2. `npx tsc --noEmit`
3. `npm run lint`
4. `npm run build`
5. `npm run dev` — manual flow below.

## Manual test steps

1. `npm run dev`, open `http://localhost:3000/`.
2. Nav (signed out): "Sign in" and "Sign up" controls visible, styled consistent with
   the pill nav; bell still present.
3. Click "Sign up", complete the modal flow to create the first user.
4. After sign-up: nav shows the Clerk `<UserButton>`; clicking it opens the account
   menu; "Sign out" returns to the signed-out nav.
5. Click "Sign in", sign back in with the same account — succeeds.
6. Open `/design-system` — unchanged.
7. Resize to 375px — nav auth control and hamburger coexist without overflow.
8. Confirm in DevTools that only `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is present in
   client bund/ `window`, not the secret key.

## Needs the user

- Completing the interactive `clerk auth login` browser step.
- A decision later on splitting the repo into `web/` + `studio/` workspaces (AGENTS §5);
  this setup assumes the current single-root layout.
