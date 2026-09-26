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

- Lighthouse ≥ 95 in all four categories, mobile profile
- LCP < 2.0s · CLS < 0.05 · INP < 200ms
- No layout shift from font loading — `next/font`, self-hosted, `display: swap`
- JS shipped to `/` under 100 KB gzipped
- Images through `next/image`. **No base64 data URIs** — the existing
  `index.html` is 731 KB because of inlined images; do not repeat that.

---

## Phase 0 — Scaffold

Next app at the repo root. `index.html` stays untouched and keeps serving
until Phase 4.

- `create-next-app`: TypeScript, App Router, ESLint, no Tailwind, `src/`
- `next.config.ts`, `tsconfig.json` with `strict: true` and path aliases
- Fonts via `next/font/google`: Bricolage Grotesque (600/700/800), Manrope
  (400–800), Caveat (500–700)
- `src/lib/design/tokens.ts` — already written, see the file
- `src/content/items.ts` — already written, see the file
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
- `<ClosedBook item={...} width={...} selected={...} />` — the construction in
  §2.2, exactly. Derive `spineWidth` and `lip` from thickness; do not
  hardcode per item.
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
- Arrows advance/reverse; clicking a pile book brings it to the front;
  `←`/`→` keyboard
- **The return animation**: pile lifts, returning book slides in underneath
  from the front, pile settles. 420ms, `cubic-bezier(.2,.72,.18,1)`. Budget
  real time for this — it is the thing that makes or breaks the page.
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

## Risks

| Risk | Mitigation |
|---|---|
| The pile return animation looks wrong and eats days | Time-box it. Fallback: cross-fade the pile instead of animating the insert |
| 3D/transform work tanks Core Web Vitals | Budget enforced per phase, not at the end. CSS transforms only |
| GitHub API rate limits on ISR revalidation | Authenticated requests (5000/hr), one batched call per revalidation |
| Content never arrives and the site ships full of `[BRACKETS]` | Phases 0–3 need no real content. Do not launch past Phase 4 without it |
| Keystatic GitHub mode auth misconfigured, admin publicly reachable | Verify on a preview deploy before production. Admin route restricted to her account |
| Dependency rot on a live portfolio | Dependabot or Renovate from Phase 0 |
