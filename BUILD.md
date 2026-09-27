# BUILD.md — the plan

Read `DESIGN.md` first. Work one phase at a time, in order. A phase is done
when every box in its **Done when** list is true — not when the code looks
finished.

Each phase should end in a commit that builds, lints, typechecks and deploys.

---

## Stack, pinned

| | Version | Why |
|---|---|---|
| Next.js | 16.x, App Router | Fills a genuine CV gap; adjacent to existing React/TS work; required for ISR |
| React | 19.x | Next 16 default |
| TypeScript | 5.x or 7.x, `strict: true` | — |
| Keystatic | `@keystatic/core` + `@keystatic/next` 5.x | Git-based admin UI. Peer range is `next >= 14`, React 18/19 |
| Hosting | Vercel | Needed for ISR; already connected |
| Styling | CSS Modules + custom properties | No runtime CSS-in-JS; keeps the perf budget reachable |

Deliberately **not** used: an animation library, a component library, a CSS
framework, WebGL. Everything in `DESIGN.md` is achievable with CSS transforms.

---

## Performance budget

Checked at the end of every phase. A recruiter running Lighthouse on a
portfolio is a real scenario.

**Lighthouse ≥ 95 in all four categories, mobile profile.** This is the real
gate — it is what someone would actually run, and it is the number worth
defending in an interview.

- LCP < 3.0s · CLS < 0.05 · INP < 200ms
- No layout shift from font loading — `next/font`, self-hosted, `display: swap`
- JS transferred to `/` under 160 KB
- Images through `next/image`. **No base64 data URIs** — the existing
  `index.html` is 731 KB because of inlined images; do not repeat that.

**How to measure**, so the numbers mean the same thing every time: against
`npm run build && npm run start`, Lighthouse mobile profile, a clean `.next`
and nothing else already bound to the port. Record the figures in `PLAN.md`
alongside the phase.

**LCP is noisy — treat a single run with suspicion.** Repeated runs of the
identical Phase 0 build returned 2.3s, 2.6s, 2.6s and 2.3s. The 3.0s
threshold sits deliberately above that band, because a limit set inside it
fails at random and teaches everyone to ignore the gate. If LCP looks
borderline, run it three times and use the worst.

*These raw numbers were revised up in Phase 0 after being measured for the
first time. They originally read LCP < 2.0s and JS < 100 KB, which the pinned
stack cannot reach: Next 16 with React 19 transfers **132 KB** of runtime and
lands at **2.3s** mobile LCP on a page with no content in it. The budget had
been set without measuring the framework floor, so it was the budget that was
wrong rather than the build — Lighthouse scored 98/100/100/100 while two
"failing" numbers sat underneath it. The headroom above the floor is roughly
28 KB of JS, which is what the carousel and the five covers have to fit in.
If a phase blows through that, the fix is the code, not another revision:
this budget gets raised once.*

---

## Phase 0 — Scaffold

Next app at the repo root, owning `/` from here on. `index.html` stays in the
repo untouched as the content source for the Phase 4e port — it stops being
served the moment Next owns the root, and that is fine (see Blockers).

- `create-next-app`: TypeScript, App Router, ESLint, no Tailwind, `src/`
- `next.config.ts`, `tsconfig.json` with `strict: true` and path aliases
- Fonts via `next/font/google`: Bricolage Grotesque (600/700/800), Manrope
  (400–800), Caveat (500–700)
- `src/lib/design/tokens.ts` — already written, see the file
- `src/content/items.ts` — already written, see the file
- `src/styles/tokens.css` — `:root` custom properties mirroring the scalar
  values in `tokens.ts` (`color`, `radius`, `shadow`, `motion`). This is the
  bridge CSS Modules files read via `var(--x)`. Decide here whether it's
  hand-written and checked against `tokens.ts` for drift, or generated from
  it — either way, add the check so the two can't silently disagree.
  `type.*` (multi-property objects) and `closedBook.*` (functions) don't
  reduce to single custom properties; keep those as TS values consumed via
  props on the Phase 1 primitives, not duplicated into CSS.
- `src/styles/reset.css` — global reset, `:focus-visible` ring,
  `prefers-reduced-motion` rule
- `src/styles/shared.module.css` — actual reusable classes meant to be
  composed into component modules (e.g. `.visuallyHidden`, `.stack`); keep
  deliberately small, don't let it become a dumping ground
- CSS Modules convention: co-locate `Component.module.css` next to
  `Component.tsx`; only cross-component styles live in `src/styles/`.
  `camelCase` class names; use `composes:` for shared building blocks
  instead of duplicating declarations; never `:global()` as a shortcut
- Root layout: background washes from `DESIGN.md` §1.2, font variables,
  skip-to-content link
- Scripts: `dev`, `build`, `lint`, `typecheck`, `test:a11y`
- Vercel project connected to this repo, preview deploys on PRs

**Done when:** `npm run build` passes clean; a preview URL renders an empty
page with the correct background and all three fonts loaded.

---

## Phase 1 — Design system

Primitives every later phase consumes. Build these before any page.

- `<Eyebrow>`, `<SectionLabel>`, `<Squiggle>` (the hand-drawn SVG underline,
  width as a prop), `<Chip>`, `<PillButton>`, `<ArrowButton>`, `<MarginNote>`
- `<BookCover kind={...} size={...} />` — all five cover designs from
  `DESIGN.md` §2.1, one component switching on `kind`
- `<ClosedBook item={...} width={...} selected={...} />` — the spine-out
  construction in §2.2, exactly: a flat cover-coloured bar whose **height is
  `thickness`**, title along the spine in the contrast-chosen `ink`, `coverDark`
  inset ring and two raised bands. No gradient, no page block. Do not hardcode
  the bar height per item.
- `:focus-visible` ring and the global `prefers-reduced-motion` rule

**Done when:** a scratch route renders all five covers at both sizes and all
five closed books; axe reports zero violations; every value traces to
`tokens.ts`.

---

## Phase 2 — Landing (`/`)

`DESIGN.md` §4.1. The hardest phase — do it before the easy pages, because
the carousel decides the shape of the state model.

- Three-column layout; identity block with photo placeholder, bio placeholder,
  social links, "Go to shelf"
- Floating item with spine slab and `rotateY(-3deg)` cover
- Pile of four: offsets, rotations, 3px stacking, suspension shadow
- Arrows advance/reverse selection (`←`/`→` keyboard). **Each pile book is a
  direct link to its own route — clicking navigates straight there, no
  "bring to front, then click again"** (`DESIGN.md` §4.1). The floating item
  also links to its route.
- **No return-trip animation** (dropped — see DESIGN.md §6). Advancing just
  reorders: the selected book becomes the floating item and the others
  re-stack. Keep any transition short and interruptible, and gate it behind
  `prefers-reduced-motion`.
- Leader line to the description panel; `0X / 05` counter; pagination dots at
  **≥ 44px** targets
- Mobile: bottom control bar, no leader lines, description below the pile

**Done when:** all five cycle in both directions with no visual pass-through;
reduced-motion swaps instantly with no animation; keyboard-only operation
works; Lighthouse ≥ 95 mobile.

---

## Phase 3 — Shelf (`/shelf`)

`DESIGN.md` §4.2.

- Five covers, 40px apart, all visible; closed row at identical x positions
  and widths
- Arrows move selection, wrapping; hover `scale(1.2)` from `center bottom`
  with `z-index` raise
- No vertical movement on selection

**Done when:** each closed book is pixel-aligned under its cover at every
breakpoint; hover and selection are independent and never conflict.

---

## Phase 4 — Item routes

Order matters. `/projects` is the one with engineering substance — do it
first, so if time runs short the interesting page exists.

### 4a `/projects` — the magazine, with live data
- Server component, GitHub REST API, `export const revalidate = 3600`
- Fetch stars, language breakdown, last-commit date, description per repo
- Repo list curated in `src/content/items.ts`, not "all public repos"
- **Token in `GITHUB_TOKEN` env var**, server-side only. Never in a client
  component, never in `NEXT_PUBLIC_*`
- Graceful degradation: API failure renders the page with cached/static data
  and no error state visible to the visitor
- Issue-per-project layout matching the magazine cover language

### 4b `/resume` — the book
- Two spreads, §4.3. Arrows disable at the ends
- **A real print stylesheet** — `Cmd+P` produces a clean one-page CV, not a
  screenshot of the site. This is claimed on the page; make it true
- PDF download

### 4c `/journal` — the notebook
- MDX entries, tags, reverse-chronological

### 4d `/about` — the newspaper
- Multi-column layout, photo essay

### 4e `/handbook` — port the existing flip-book
- Rebuild the page-flip as a React component
- **Extract the base64 images to `/public`** and serve via `next/image`
- Fix the two failing greys (`DESIGN.md` §1.1)
- Keep the EN/DE toggle
- Only now remove the root `index.html`

**Done when:** every route in §3 resolves; `/projects` shows data that changes
when a repo is pushed to; printing `/resume` produces a usable CV.

---

## Phase 5 — Keystatic

- `@keystatic/core` + `@keystatic/next`, local mode in dev, GitHub mode in
  production
- Collections: `items` (the portfolio objects), `journal` (MDX entries),
  `reading` (books, once she wants it)
- Schema mirrors the `PortfolioItem` type — adding an item is a data entry,
  never a code change
- GitHub App auth; admin restricted to her account

**Done when:** she can add a new item through `/keystatic` in the browser, it
commits to this repo, and it appears in the stack, on the shelf and at its own
route with no code edit.

---

## Phase 6 — Gates

- axe-core across all routes in CI, zero violations
- Lighthouse CI against the budget above
- Playwright: carousel cycles, arrows disable correctly, routes resolve,
  reduced-motion honoured
- `README.md` rewritten for the portfolio
- Custom domain, or rename the repo — see `DESIGN.md` §6

---

## Phase 7 — AI drafting (optional, later)

The version that is worth building:

- A server action takes a description ("add *Refactoring UI*, these three
  takeaways")
- Claude drafts a content entry matching the Keystatic schema
- **It opens a pull request. It does not publish.**
- She reviews the diff and merges

Why this shape: nothing reaches the site unreviewed, the API key stays
server-side, and "AI-assisted authoring with a human gate" is a defensible
interview answer. A chat box that writes straight to the site is a wrapper
around an API call.

Do not start this until Phases 0–6 are green.

---

## Blockers

Hard blockers for a public launch (not for starting Phase 0–3):

- **Live `index.html`.** ~~Must stay reachable until Phase 4e.~~ **Resolved
  and no longer a blocker:** the handbook link is not shared publicly, so no
  continuity is owed. The Next app takes `/` from Phase 0 onward, blank page
  and all; `index.html` stays in the repo purely as the **content source**
  for the Phase 4e port — not served, not deleted. The handbook returns as
  book 05 at `/handbook` in 4e.
- **`GITHUB_TOKEN` + Vercel for a truthful `/projects` ISR claim.** Without
  the token, the SSR/ISR claim in Phase 4a is false — BUILD would then have
  to call it SSG instead. **Done:** fine-grained PAT generated and added to
  the Vercel project's environment variables. Confirm it's scoped read-only
  to public repos (or just this repo) before Phase 4a starts using it.
- **Real copy.** Blocks public launch, not the build — sample/bracketed data
  is enough through Phase 0–4. No concrete plan yet for replacing
  `[BRACKETED]` placeholders; flagged as an open pre-launch task.

Not blockers: Next scaffold (Phase 0). Keystatic (Phase 5). Phase 7 AI.
Unfinished canvas. Site-wide German.

Resolved before Phase 1:
- `pageBackground` and the `closedBook.pageBlock`/`hinge`/`lip` tokens
  encoded a discarded look (multi-stop background, old page-block/hinge
  spine construction) — fixed in `tokens.ts` to match the current spec in
  `DESIGN.md` §1.2 and §2.2.
- Pile click behavior confirmed as one-click straight to the route (already
  DESIGN.md's decision; BUILD.md's Phase 2 task list had drifted to a
  bring-to-front-then-click model and has been corrected above).

---

## Vercel hosting

How the resolved hosting blocker above is actually carried out. Do this
before or during Phase 0.

### 1. Connect the repo
- Import this GitHub repo into Vercel as a new project, framework preset
  Next.js. Vercel auto-detects `next build` — don't override the build
  command unless a later phase needs to.
- Every PR gets a preview deployment automatically; no extra config needed
  for that.

### 2. `index.html` during migration — decided
- **The Next app owns `/` from Phase 0**, even while it is a blank page. The
  handbook link was never shared publicly, so there is no continuity to
  preserve and no redirect juggling to do.
- `index.html` stays at the repo root as the **content source** for the
  Phase 4e port. Do not move it into `public/`, do not serve it, do not
  delete it. Next's router takes `/` and it simply stops being served.
- It is removed only at the end of Phase 4e, once the React flip-book is
  verified live at `/handbook`.

### 3. Environment variables
- Add `GITHUB_TOKEN` in the Vercel project's Settings → Environment
  Variables, scoped to **Production** (and Preview if `/projects` previews
  should also show live data). Never add it as `NEXT_PUBLIC_*` — it must
  stay server-side only, per Phase 4a.
- Generate the token as a GitHub fine-grained PAT scoped to public-repo
  read access only — no write/admin scopes, since it's only used for the
  REST API reads Phase 4a needs.

### 4. Domain cutover
- If a custom domain currently points at GitHub Pages: add it to the
  Vercel project (Settings → Domains), then repoint the domain's DNS
  (A/CNAME per Vercel's instructions) once the Vercel deployment is
  confirmed correct. Expect DNS propagation delay — do this at a low-traffic
  time, not mid-review.
- If no custom domain is in play yet (bare `*.github.io`), Vercel's default
  `*.vercel.app` URL is fine for now; revisit before public launch.
- Only remove the GitHub Pages deployment after the Vercel domain is
  confirmed live and serving the correct content — don't tear down the old
  host as part of the same change that stands up the new one.

**Done when:** the Vercel project builds this repo, PR previews build
automatically, and `GITHUB_TOKEN` is set server-side-only in the Vercel
project — all before Phase 4a needs it.

---

## Risks

| Risk | Mitigation |
|---|---|
| The pile return animation looks wrong and eats days | Time-box it. Fallback: cross-fade the pile instead of animating the insert |
| 3D/transform work tanks Core Web Vitals | Budget enforced per phase, not at the end. CSS transforms only |
| GitHub API rate limits on ISR revalidation | Authenticated requests (5000/hr), one batched call per revalidation |
| Content never arrives and the site ships full of `[BRACKETS]` | Phases 0–3 need no real content. Do not launch past Phase 4 without it |
| Keystatic GitHub mode auth misconfigured, admin publicly reachable | Verify on a preview deploy before production. Admin route restricted to her account |
| Dependency rot on a live portfolio | Dependabot or Renovate from Phase 0 |
