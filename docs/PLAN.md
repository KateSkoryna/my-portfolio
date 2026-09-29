# docs/PLAN.md — the execution plan

Machine-executable companion to `docs/BUILD.md`. `docs/BUILD.md` says *what* each phase
is and why; this file says *what to do next*, *how to know it is done*, and
*where the state is*. It is the file the loop reads and writes.

`docs/DESIGN.md` remains the design contract. Where this file and `docs/DESIGN.md`
disagree about a value, `docs/DESIGN.md` wins and this file is corrected.

---

## How the loop runs

**One phase per iteration. Stop after every phase for human review.**

Each `/loop` invocation does exactly this:

1. Read `docs/DESIGN.md` in full, then `docs/BUILD.md`, then this file.
2. Find the first phase in the Status board below whose state is not `done`.
3. Work its tasks in order, **leaving every change uncommitted** so Kateryna
   can read the diff (see Git protocol). Do not commit, stage or push.
4. Run the **Universal definition of done** *and* that phase's own
   **Definition of done**. Every box in both must pass. A box that cannot be
   honestly ticked is a `blocked`, not a judgement call — accessibility and
   Lighthouse boxes especially are never waived to finish a phase.
5. Update this file: tick the task boxes, tick the DoD boxes, set the phase
   state to `done` (or `blocked` with a one-line reason).
6. **Stop with the work uncommitted.** Call `ScheduleWakeup` with
   `stop: true` and report: the branch name, what changed and where, what the
   DoD measured, and what needs a human eye. Then wait — Kateryna reads the
   diff, and commits, pushes and opens the PR on her own say-so.

The loop does **not** start the next phase. Kateryna reviews, then runs
`/loop` again.

### Stop immediately and ask if

- A task requires content that is `[IN BRACKETS]` in `items.ts` — never
  invent copy (`CLAUDE.md` hard rule 2).
- A DoD box cannot be made to pass without changing `docs/DESIGN.md`.
- A decision in **Open decisions** below is unresolved and blocks the task.
- A visual result is ambiguous — Sonnet cannot judge whether the pile "looks
  right". Report and let a human look.

### Git protocol

**Do not commit during a phase.** Work is left in the working tree so
Kateryna can read the diff in her editor before any of it is recorded. A
phase that commits as it goes gives her nothing to review — the changes have
already disappeared into history by the time she looks.

- **One branch per phase**, cut from up-to-date `main`:
  `phase-0-scaffold`, `phase-1-design-system`, `phase-2-landing`,
  `phase-3-shelf`, `phase-4a-projects`, … Create it as the phase's first act.
  The branch is created; nothing is committed onto it yet.
- **Leave every change uncommitted and unstaged** until the phase stops and
  Kateryna has reviewed it.
- When the phase's work is done, **stop and report** with the branch name and
  a summary of what changed, then wait. Do not commit as part of stopping.
- **Only commit when she says so.** At that point, group the work into the
  small logical commits it should have been — one per task, present-tense
  subject saying what changed and why — rather than one undifferentiated blob.
- **Never push. Never open a PR. Never merge. Never touch `main`.** She
  pushes and opens the PR herself.
- Never `git checkout`/`reset`/`clean` without running `git status` first and
  stashing anything uncommitted — the working tree is now where the
  unreviewed work lives, so losing it costs a whole phase.
- Attribution trailer as configured for the session.

The trade-off is deliberate: granular per-task history is worth less than
Kateryna actually seeing the work. The commits still get written, just after
review rather than before it.

---

## Settled settings

Decided. Not open for re-litigation by the loop.

| Setting | Value |
|---|---|
| **Languages** | **EN + DE now, architected to extend to 3 or 4 without a rewrite.** Use a real i18n framework — `next-intl` unless there is a concrete reason otherwise. Locale-segmented routes (`/de/...`). Adding a locale = adding a message file, never touching components. |
| **Language switcher** | In the header, on every page (`docs/DESIGN.md` §4.4). |
| **German copy** | Kateryna writes it. Never machine-translate, never invent. Missing strings fall back to English. |
| **Dark mode** | Not built. |
| **Hosting** | Next owns `/` from Phase 0. `index.html` kept as the Phase 4e content source. |
| **Unpublished items** | Small "coming soon" marker, not a link. Driven by `item.published`. |

---

## Standing rules for every phase

These are not per-phase reminders; they apply always.

1. **Never hardcode a colour, size, radius, shadow or duration.** Import from
   `src/lib/design/tokens.ts`, or `var(--x)` from `src/styles/tokens.css`. If
   a value is missing, add it to the token source first.
2. **Never invent Kateryna's content.** `[SQUARE BRACKETS]` stay bracketed and
   render as visible placeholder text in `color.placeholder`.
3. **Build fluid, not fixed-pixel.** Every px figure in `docs/DESIGN.md` is a spec
   of *intent* from a 1440/390 mockup. Implement with `clamp()`, grid/flex and
   container queries so 1280 laptops and tablets are not stranded
   (`docs/DESIGN.md` §6). Do not litter the codebase with `1440px`.
4. **Accessibility is a gate, not a polish pass.** Real `<button>`/`<a href>`,
   ≥44px targets, ≥11px informational text, `:focus-visible` ring,
   `prefers-reduced-motion` disables *every* transform (`docs/DESIGN.md` §5).
5. **No new dependency** without stating what it replaces and why the platform
   cannot do it. No animation library, no component library, no CSS framework,
   no WebGL, no runtime CSS-in-JS.
6. **CSS Modules**, co-located `Component.module.css`, `camelCase` classes,
   `composes:` for shared blocks, never `:global()` as a shortcut.
7. Run `npm run lint`, `format:check`, `typecheck`, `test` and `build` before
   considering any task complete. From Phase 0 these are the same five checks
   CI enforces — if they fail locally they will fail the pipeline, so do not
   commit through them.

---

## Priority order

These principles conflict in real decisions. When they do, higher wins —
do not silently trade one away for a lower one.

1. **Accessibility.** The contract in `docs/DESIGN.md` §5. Non-negotiable, never
   traded for elegance, brevity or cleverness. If the accessible version is
   uglier code, ship the uglier code.
2. **Lighthouse and the performance budget.** ≥ 95 in all four categories on
   mobile; LCP < 3.0s · CLS < 0.05 · INP < 200ms; JS to `/` under 160 KB.
   An abstraction that costs bundle size loses to the budget. The framework
   floor is ~132 KB, so the headroom for all our own code is ~28 KB.
3. **Fidelity to `docs/DESIGN.md`.** The design contract beats personal taste.
4. **DRY / KISS / YAGNI.** Below the three above, not above them.
5. Everything else.

A worked example: if a shared abstraction would ship more JS to `/` than
two plain implementations, write the two plain implementations — (2) beats
(4). Say so in the commit message so it is not "fixed" later.

---

## Code and design principles

Stated as things that can actually be checked, not slogans.

**DRY — the rule of three.**
- Two similar blocks are fine. A **third** copy means extract.
- Project-specific: the five cover treatments are **one** `<BookCover>`
  switching on `kind`, never five components. Closed-book geometry
  **derives from `item.thickness`**, never per-item constants. Shared CSS
  goes through `composes:`, never duplicated declarations. Repeated
  values live in `tokens.ts` / `tokens.css`, never inline.
- The honest test: *if this value or rule changed, how many files would I
  have to edit?* More than one is a smell.

**KISS.**
- No abstraction until a **second** caller exists. No config object, hook,
  or generic wrapper written for one call site.
- No state machine where `useState` does the job. The carousel is a
  selected index and a reorder — not a reducer with events.
- CSS transforms and transitions only. No animation library, no WebGL, no
  runtime CSS-in-JS.
- Prefer the platform: `<a href>` over a router push, native `<dialog>` and
  `<details>` over a hand-built equivalent, CSS over JS wherever both work.

**YAGNI.**
- Build for the five items that exist, not for "any number of items later".
- No theming layer (there is no dark mode). No CMS abstraction before Phase 5
  actually needs one.
- i18n is **not** a YAGNI case — it is a settled setting. Build it properly in
  Phase 1.
- No half-finished implementations left behind a flag.

**Comments and dead code.**
- Comment the *why*, never the *what*. A comment explaining a discarded
  design decision (like the ones in `tokens.ts`) earns its place; a comment
  restating the code does not.
- Delete dead code rather than commenting it out — git remembers.

---

## Universal definition of done

**Every box here applies to every phase**, in addition to that phase's own
list. Kept in one place rather than pasted seven times — the same reason the
code is expected to be DRY.

Accessibility and Lighthouse lead because they are the stated priority.

**Accessibility — the gate**
- [ ] axe-core: **zero** violations on every route the phase touches.
- [ ] Every interactive element is a real `<button>` or `<a href>` — never
      `role`/`onClick` on a `div` or `span`.
- [ ] Full keyboard operation: Tab reaches everything, arrow keys drive what
      §4 says they drive, nothing is a keyboard trap.
- [ ] Visible `:focus-visible` ring on every interactive element — mustard,
      3px, 2px offset.
- [ ] All hit areas ≥ 44px, via transparent padding — the visible art is not
      shrunk to suit.
- [ ] All informational text ≥ 11px. Sub-11px is decoration only and its
      information is duplicated at a readable size elsewhere.
- [ ] Every text colour clears its stated ratio: ≥ 4.5:1 body, ≥ 3:1 at 24px+.
      New colours measured before use, ratio recorded in `tokens.ts`.
- [ ] `prefers-reduced-motion: reduce` disables **every** transform in the
      phase — not most of them.
- [ ] Icon-only controls carry `aria-label`; active dots carry `aria-current`.

**Performance — the budget**
- [ ] Lighthouse ≥ 95 in all four categories, mobile profile, on every route
      the phase touches. This is the gate that matters.
- [ ] LCP < 3.0s · CLS < 0.05 · INP < 200ms. LCP is noisy — if it looks
      borderline, run three times and use the worst.
- [ ] JS transferred to `/` under 160 KB — measured, and the number recorded
      in this file. The framework floor is ~132 KB; if this phase's own code
      has eaten much of the ~28 KB headroom, say so rather than just passing.
- [ ] No layout shift from font loading.
- [ ] Images through `next/image`. No base64 data URIs, ever.

**Pipeline**
- [ ] `lint`, `format:check`, `typecheck`, `test`, `build` all pass locally
      and in CI.

**Code principles — checked by reading the diff, not by vibes**
- [ ] No value in the diff that belongs in `tokens.ts` / `tokens.css`: grep
      the phase's new CSS and TSX for hex codes, raw shadows, raw durations
      and token-able radii. Expect none beyond layout geometry.
- [ ] No third copy of anything — if a block appears three times, it was
      extracted.
- [ ] No abstraction introduced with only one caller.
- [ ] No dead code, no commented-out code, no half-finished work behind a
      flag.
- [ ] Nothing hardcoded that `items.ts` should drive — flipping a field in
      `items.ts` must be the only edit needed to change content behaviour.
- [ ] Comments explain *why*, not *what*.

**Fidelity**
- [ ] Fluid at 390, 768, 1280 and 1440 — no stranded breakpoint, no
      horizontal scroll.
- [ ] Nothing in the phase contradicts a locked decision in `docs/DESIGN.md` §6.
- [ ] Where a trade-off was made against a lower-priority principle, the
      commit message says which and why.

---

## Status board

| Phase | State | Gate |
|---|---|---|
| 0 — Scaffold | `done` | Lighthouse 98/100/100/100, all five checks green and proved to bite. Awaiting push + branch protection. |
| 1 — Design system | `done` | five covers + five closed books, axe clean. Merged (PR #8). |
| 2 — Landing `/` | `done` | carousel cycles, keyboard, Lighthouse 96/100/96/100. Awaiting human review. |
| 3 — Shelf `/shelf` | `done` | closed row aligns under covers. Lighthouse 96/100/96/100 (`/shelf`), 95/96/96/100 (`/`). Awaiting human review. |
| 4 — Item routes | `in progress` (4a, 4b done; 4c–4e todo) | every `docs/DESIGN.md` §3 route resolves |
| 5 — Keystatic | `todo` | she can add an item in the browser |
| 6 — Gates | `todo` | CI green on axe, Lighthouse, Playwright |

States: `todo` · `in progress` · `blocked: <reason>` · `done`

Phase 7 (AI drafting) is explicitly out of scope for this plan. Do not start
it; it requires Phases 0–6 green and a separate decision.

---

## Open decisions — resolve before the phase that needs them

These are gaps found between `docs/BUILD.md` and `docs/DESIGN.md`. The loop must **stop
and ask**, not guess.

Everything else is in **Settled settings** above — do not reopen it.

| # | Decision | Blocks | Why it is open |
|---|---|---|---|
| D1 | ~~Repo rename or custom domain?~~ **RESOLVED: renamed to `my-portfolio`.** | — | Settled. `docs/DESIGN.md` §6. Done early (Phase 1), ahead of Phase 6, at Kateryna's request. |
| D2 | ~~The performance budget is unreachable as written.~~ **RESOLVED: the numbers were raised** to LCP < 3.0s and JS to `/` < 160 KB, Lighthouse ≥ 95 unchanged as the real gate. | — | Settled. The budget had been set without measuring the framework floor. It gets raised **once** — a later phase that blows through the ~28 KB of headroom fixes its code, not the budget. |

### Phase 0 baseline — measured, production build, mobile profile

The framework floor every later phase builds on top of. If a phase's numbers
move a long way from these, its own code is what moved them.

| Metric | Budget | Phase 0 | |
|---|---|---|---|
| Lighthouse performance | ≥ 95 | **98** | pass |
| Lighthouse accessibility | ≥ 95 | **100** | pass |
| Lighthouse best practices | ≥ 95 | **100** | pass |
| Lighthouse SEO | ≥ 95 | **100** | pass |
| CLS | < 0.05 | **0** | pass |
| Console errors | none | **none** | pass |
| JS transferred to `/` | < 160 KB | **132.2 KB** | pass — 28 KB headroom left |
| LCP | < 3.0s | **2.3–2.6s** over four runs | pass |

The JS is five chunks, all compressed; the two largest (70 KB and 47 KB) are
the React and Next runtimes. Fonts are three variable files, 138 KB. LCP is
the `<h1>`, gated on the font swap under Lighthouse's simulated slow-4G.

---

## Phase 0 — Scaffold

**Goal:** a Next 16 app at the repo root that builds clean and renders an
empty page with the correct background and all three fonts — without taking
the live handbook offline.

**Hosting: resolved (D1).** The Next app owns `/` from this phase onward, even
while it is a blank page. `index.html` is **kept in the repo as the content
source** for the Phase 4e port — do not serve it, do not delete it. The
handbook comes back as book 05 at `/handbook` in 4e.

### Tasks

- [x] **`.gitignore` first, before anything generates files.** It currently
      contains only `.DS_Store`. It must cover `.env*` (except
      `.env.example`), `node_modules`, `.next`, `out`, `.vercel`, and
      coverage output. A committed `.env.local` means a leaked
      `GITHUB_TOKEN` — unrecoverable once pushed.
- [x] `create-next-app` at the repo root: TypeScript, App Router, ESLint, no
      Tailwind, `src/`. Preserve the existing `src/lib` and `src/content`.
- [x] `tsconfig.json`: `strict: true`, path alias `@/*` → `src/*`.
- [x] `next.config.ts`. No build-command override.
- [x] Fonts via `next/font/google`, self-hosted, `display: swap`: Bricolage
      Grotesque (600/700/800), Manrope (400–800), Caveat (500–700). Expose as
      `--font-bricolage`, `--font-manrope`, `--font-caveat` — the names
      `tokens.ts` already references.
- [x] `src/styles/tokens.css` — `:root` custom properties mirroring the
      **scalar** exports of `tokens.ts` (`color`, `radius`, `shadow`,
      `motion`). `type.*` and `closedBook.*` stay TS-only.
- [x] Drift guard for `tokens.css` ↔ `tokens.ts`: either generate the CSS from
      the TS at build time, or hand-write it plus a test that fails on
      divergence. State which was chosen and why in the file header.
- [x] `src/styles/reset.css` — reset, `:focus-visible` ring (mustard, 3px, 2px
      offset), global `prefers-reduced-motion` rule.
- [x] `src/styles/shared.module.css` — `.visuallyHidden` and only what is
      genuinely shared. Keep it small.
- [x] Root layout: flat `#F3EFE4` background (§1.2 — **no** multi-stop
      gradient), font variables, skip-to-content link.
- [x] Scripts in `package.json`: `dev`, `build`, `lint`, `format`,
      `format:check`, `typecheck` (`tsc --noEmit`), `test`, `test:a11y`.
      `test:a11y` may be a stub that exits 0 until Phase 1 has a route to
      scan — say so in its script comment.
- [x] Prettier + `eslint-config-prettier` so ESLint and Prettier do not fight
      over formatting. Config checked in. **New dependency, justified:**
      formatting is not something the platform provides, and a `format:check`
      job is what keeps diffs reviewable across a long autonomous build.
- [x] Vitest as the test runner. **New dependency, justified:** the token
      drift guard above needs somewhere to live, and Phase 6's Playwright
      suite is a different tool for a different job (E2E, not unit).
- [x] First test: the `tokens.css` ↔ `tokens.ts` drift guard.
- [x] Leave `index.html` in place at the repo root as the 4e content source.
      Next's router owns `/`, so it stops being served automatically — no
      move, no redirect, no deletion.
- [x] **CI pipeline** — `.github/workflows/ci.yml`, running on every pull
      request and on pushes to `main`. Jobs, all of which must pass:
      `lint` · `format:check` · `typecheck` · `test` · `build`.
      Run them as separate steps so a failure names itself, pin the Node
      version to match Vercel's, and cache `node_modules`.
- [x] Document in the workflow file that `main` must be branch-protected with
      these checks required — Vercel builds production from `main`, so that
      is what stops a red pipeline reaching production. **Kateryna enables
      the protection herself**; it is a GitHub setting, not a repo file.
- [x] Prove each check bites **locally**: deliberately break lint, then
      formatting, then types, and confirm the matching script exits non-zero
      each time. Revert after each. A gate never seen failing is not known to
      work.
- [x] Dependabot or Renovate config (`docs/BUILD.md` Risks).

### Definition of done

*Plus every box in the Universal definition of done above.*

*(The universal pipeline boxes are created by this phase — here they must not
just pass, they must be **proved** to work.)*

- [x] Each of the five checks demonstrably fails locally when deliberately
      broken, then passes again once reverted.
- [x] The workflow file is committed and its job names are the ones branch
      protection will require.
- [ ] **Kateryna, on the first push:** confirm CI runs all five as separate
      named checks on the PR, then enable branch protection on `main`
      requiring them. The loop cannot verify this — it never pushes.
- [x] Local `/` renders an empty page on `#F3EFE4` with no console errors.
- [x] All three fonts load and are applied — verified in the browser, not
      assumed from config.
- [x] `index.html` is still present in the repo, unmodified, for the 4e port.
- [x] `git status` shows no `.env*`, `node_modules` or `.next` as untracked
      or staged — the ignore rules demonstrably work.

**Universal DoD result for this phase** — measured on the production build,
mobile profile, not assumed:

- [x] Lighthouse 98 / 100 / 100 / 100 — all four ≥ 95.
- [x] CLS 0. No layout shift from font loading.
- [x] No console errors.
- [x] axe: zero violations (Lighthouse accessibility 100; `test:a11y` is
      still the documented stub until Phase 1 has a route worth scanning).
- [x] No hardcoded values — the only colour literals in the repo are in
      `tokens.ts`, and `tokens.css` is generated from it.
- [x] JS to `/` — **132.2 KB** against the 160 KB budget. This is the
      framework floor; ~28 KB of headroom remains for every later phase.
- [x] LCP — **2.3–2.6s** across four runs, against the 3.0s budget.

Both budget numbers were revised up in this phase after being measured for
the first time (D2). The only thing still outstanding is Kateryna's push:
confirming CI reports five named checks, and enabling branch protection.
- [x] `tokens.css` and `tokens.ts` agree, and the drift guard demonstrably
      fails when they are made to disagree.
- [x] **Human review:** Kateryna confirms the preview URL renders the new
      (blank) app with the right background and fonts.

---

## Phase 1 — Design system

**Goal:** every primitive later phases consume, provable on one scratch route.

**i18n is set up in this phase** — see Settled settings. `next-intl`,
locale-segmented routes, EN + DE now, extensible to more.

### Tasks
- [x] `<Eyebrow>`, `<SectionLabel>` — type patterns from §1.3.
- [x] `<Squiggle>` — hand-drawn SVG underline, width as a prop.
- [x] `<Chip>`, `<PillButton>`, `<ArrowButton>` (circular, 56px intent, ≥44px
      real hit area), `<MarginNote>` (Caveat — decoration only, never
      load-bearing text).
- [x] `<BookCover kind={...} size={...} />` — all five cover designs from
      §2.1, one component switching on `kind`.
- [x] `<ClosedBook item={...} width={...} selected={...} />` — spine-out per
      §2.2 **exactly**: flat cover-coloured bar, **height = `item.thickness`**
      (never hardcoded per item), title along the spine in the
      contrast-chosen ink, `coverDark` inset ring, two raised bands, volume
      from `closedBook.containerShadow(coverDark)` / `selectedShadow`.
      **No gradient. No page block. No hinge.**
- [x] Shared page chrome (§4.4) — *not in `docs/BUILD.md`'s task list, but every
      route needs it*: two-row header (language toggle pinned right on row 1;
      back-arrow / route label / page action on row 2), and the footer
      (`© 2026 Kateryna Skoryna · All rights reserved`, Manrope 700 / 10px /
      `quiet`).
- [x] `next-intl` set up: locale-segmented routes, `en` and `de` message
      files, English fallback for missing keys. Adding a third locale must be
      one new message file and nothing else.
- [x] All user-facing strings live in message files, not in JSX.
- [x] Language toggle component — sage pill track, filled emerald
      circle for the selected language, both real `<button>`s with
      `aria-label`, ≥44px hit areas.
- [x] Dot indicator component (§4.3) — dots only, no counter text; active dot
      widens to coral; `aria-current` on the active dot; `aria-label` per dot;
      ≥44px hit area via padding.
- [x] Scratch route (e.g. `/_scratch`, not linked from anywhere) rendering all
      five covers at both sizes and all five closed books.
- [x] Wire `test:a11y` to scan the scratch route for real.

### Definition of done

*Plus every box in the Universal definition of done above.*

- [x] Scratch route renders five covers at both sizes and five closed books.
- [x] Closed-book bar heights are 28 / 36 / 20 / 16 / 24 px — i.e. they track
      `item.thickness` from `items.ts`, verified by changing a thickness and
      seeing the bar change.
- [x] Spine title ink follows §2.2: cream on emerald and emeraldDeep, deep
      emerald on sage, charcoal on coral and mustard.
- [x] `test:a11y` now scans the scratch route for real, not a stub.
- [x] One `<BookCover>` switching on `kind` — not five cover components.
- [x] Adding a locale is one new message file — verified by adding a throwaway
      third locale, seeing it work, then removing it.
- [ ] **Human review:** Kateryna confirms the covers and spines look right.
      Sonnet cannot judge this. *(Shipped and merged via PR #8 ahead of this
      being ticked — flagging honestly rather than backfilling a review that
      didn't happen through this file.)*

---

## Phase 2 — Landing (`/`)

**Goal:** the carousel. The hardest phase — the state model here shapes
Phase 3.

**No dark mode** (settled setting) — no dark palette, no theme toggle, no
`prefers-color-scheme` branches anywhere.

### `published: false` — the "coming soon" state

`docs/DESIGN.md` designs no such state, so this is the spec. Four of the five
items carry `published: false` today; only `/handbook` is `true`.

- A **small "coming soon" marker** on the item, wherever an item is
  presented: the pile and description panel on `/`, and the shelf.
- It is **informational text, so ≥ 11px** (`docs/DESIGN.md` §5.4). Manrope, the
  `sectionLabel`/`caption` pattern from §1.3, in `color.quiet` or on a
  `sage` chip. Reuse `<Chip>` from Phase 1 rather than inventing a badge.
- **An unpublished item is not a link.** A dead link costs more trust than
  its absence — the same reasoning `docs/DESIGN.md` §6 applies to dead demo
  links. Render it as a non-interactive element, not an `<a>` to a 404.
- The marker is driven by `item.published` only. Never hardcode which items
  are unpublished — flipping the flag in `items.ts` (or later in Keystatic)
  must be the only change needed.
- Once a route ships, its flag flips to `true` in the same commit and the
  marker disappears with no component change.

### Tasks
- [x] Three-column layout (§4.1): identity block left, floating item centred,
      description panel right. Fluid, not fixed at 1440.
- [x] Identity block: photo placeholder, `profile.bio` placeholder, social
      links, "Go to shelf". Brackets render as visible placeholders.
- [x] Floating item: spine slab + `rotateY(-3deg)` cover, long-axis inset
      shadows per §2.2.
- [x] Pile of four: x offsets, ±0.6–1.4° rotations, 3px stacking, tallest at
      top.
- [x] Suspension shadow — 216 × 24 radial ellipse, 30% opacity, between the
      floating item and the pile. This is what sells "suspended".
- [x] **Each published pile book is an `<a href>` straight to its route.** The
      floating item links to its route too. No bring-to-front-then-click.
      Unpublished items render the coming-soon marker and are not links.
- [x] Arrows advance/reverse selection; `←`/`→` bound to the carousel, not
      advertised in the UI. *On mobile the flanking arrow buttons step out of
      the stage (their 56px each plus the pile blew the 390px budget) —
      `←`/`→` and the dots still give full navigation; see DoD note.*
- [x] **No return-trip animation** (§4.1, locked). Advancing reorders: the
      selected book becomes the floating item, the others re-stack. Any
      transition stays short and interruptible.
- [x] Leader line to the description panel: the §4.1 path, emerald 1.4px,
      3.6px coral dot at the book end.
- [x] `0X / 05` counter and pagination dots — dots reuse the Phase 1
      indicator; ≥44px targets.
- [x] Mobile: bottom control bar, no leader lines, description below the pile.

### Definition of done

*Plus every box in the Universal definition of done above.*

- [x] All five items cycle in both directions, wrapping, with no visual
      pass-through.
- [x] Every **published** pile book navigates to its route in **one** click;
      unpublished ones show the coming-soon marker and are not focusable as
      links. *Caveat: `/handbook` (the one published item) and `/shelf` (the
      identity block's CTA) don't have routes yet — Phase 4e and Phase 3
      respectively — so those two links 404 until those phases ship. Not a
      dead link in the `published`-flag sense this DoD line means, but real
      until then; shows up as two console 404s in Lighthouse best-practices
      (96, still ≥ 95).*
- [x] Flipping `published` in `items.ts` alone moves an item between the two
      states — no component edit needed.
- [x] `←`/`→` drive the carousel, and reduced-motion swaps instantly with no
      animation. *The cross-fade uses `--motion-select`; reset.css's global
      reduced-motion rule zeroes it, not a per-component check.*
- [x] Carousel state is an index plus a reorder — not a reducer, machine or
      library (KISS).
- [ ] **Human review:** Kateryna confirms the pile and the suspension read as
      intended. The pile fan and the per-book "coming soon" markers went
      through one visual pass already (see report) but this box needs her
      eyes, not mine.

**Universal DoD result for this phase** — measured on the production build
(`npm run build && npm run start`), Lighthouse mobile profile, `/en`, a clean
`.next` and nothing else on the port, three runs (§ Phase 0 baseline note on
LCP noise):

| Metric | Budget | Phase 2 | |
|---|---|---|---|
| Lighthouse performance | ≥ 95 | **96** (steady across 3 runs) | pass |
| Lighthouse accessibility | ≥ 95 | **100** | pass |
| Lighthouse best practices | ≥ 95 | **96** | pass, see the dead-link caveat above |
| Lighthouse SEO | ≥ 95 | **100** | pass |
| CLS | < 0.05 | **0** | pass |
| JS transferred to `/` | < 160 KB | **152.6 KB** | pass — headroom down from 28 KB at Phase 0 to about 7 KB now |
| LCP | < 3.0s | **2.8s**, steady across 3 runs | pass |

**This ate almost all the remaining JS headroom, and it's worth knowing
why rather than just passing.** The first version of this phase marked the
whole interactive `Landing` component `'use client'`, which pulled
`BookCover`, `ClosedBook` and every decorative element they render into the
client bundle — Lighthouse performance came back **94** and LCP **3.1s**,
both failing. The fix was architectural, not a trim: `FloatingItem`, `Pile`
and `DescriptionPanel` are Server Components (plain functions taking
resolved strings as props, not calling `next-intl` themselves — see the
comments in `Landing.tsx`), rendered once per item in `Landing` itself.
Only `Carousel` — index state, `←`/`→`, the arrow and dot controls — is
`'use client'`, and it receives the five already-rendered slides as props
rather than importing any of the visual components. That recovered the
budget (96, 2.8s), but **there is very little headroom left for Phase 3
onward** — the next phase that adds meaningfully more client-side
interactivity should check this table before assuming there's room.

## Phase 3 — Shelf (`/shelf`)

**Goal:** five covers with the closed row aligned beneath them.

### Tasks

- [x] Five covers, 40px apart, all five visible, none cut off (§4.2).
- [x] Closed row beneath at the **same x positions and widths**, so each
      closed book sits under its own cover.
- [x] Arrows move selection along the shelf, wrapping. They do not scroll.
- [x] Selected state: mustard ring on cover and on closed book, title turns
      `emeraldDeep`. **No vertical movement.**
- [x] Hover: `scale(1.08)` — turned down from the spec's `1.2`, see §4.2's
      note; `transform-origin: center bottom`, `z-index` raised so it passes
      in front of neighbours.
- [x] Mobile: vertical list of covers **only** — no closed row (§3).

### Definition of done

*Plus every box in the Universal definition of done above.*

- [x] Each closed book is pixel-aligned under its cover at 1280, 1440 and any
      width between — verified, not assumed. The two rows share one source of
      x positions and widths; they are not two lists kept in sync by hand.
- [x] Hover and selection are independent and never conflict.
- [x] No vertical movement on selection; all five stay on one line.
- [x] Mobile shows covers only, no closed row.
- [x] Covers and closed books are the Phase 1 components, unforked.
- [ ] **Human review:** Kateryna confirms the cover/closed-row correspondence.

**Universal DoD result for this phase** — measured on the production build
(`npm run build && npm run start`), Lighthouse mobile profile, `/en/shelf`,
`/de/shelf`, `/en` and `/de` (`/` re-measured because this phase edited
`BookCover`, `PageHeader` and shared tokens), a clean `.next` and nothing else
on the port:

| Metric | Budget | `/shelf` (en & de) | `/` (en & de) | |
|---|---|---|---|---|
| Lighthouse performance | ≥ 95 | **96** | **95** | pass |
| Lighthouse accessibility | ≥ 95 | **100** | **96** | pass, see contrast note below |
| Lighthouse best practices | ≥ 95 | **96** | **96** | pass, see dead-link note below |
| Lighthouse SEO | ≥ 95 | **100** | **100** | pass |
| CLS | < 0.05 | **0** | **0** | pass |
| JS transferred | n/a (budget scoped to `/`) / < 160 KB | 169.4 KB | **157.9 KB** | `/` pass, under budget |
| LCP | < 3.0s | **2.8s** | **3.0s**, steady across 3 runs | `/shelf` pass; `/` at the line — see note below |

*Both accessibility and best-practices dips on `/` and `/shelf` are
pre-existing, not introduced by this phase's diff:*
- *The accessibility `color-contrast` failure is `Carousel.module.css`'s
  `.counter` ("01 / 05", coral-on-cream, 2.37:1) — that file is untouched in
  this phase's changes. Belongs to Phase 2.*
- *The best-practices `errors-in-console` hit is the console 404s from
  prefetching the three unpublished item routes, already flagged and accepted
  in Phase 2's own DoD note above; `/shelf` links to all five items so it
  shows three 404s instead of two.*
- *`/`'s LCP sits exactly on the 3.0s budget line (not under it), versus 2.8s
  at Phase 2 close. Nothing in this phase's diff touches the landing route's
  render path directly, but `BookCover.module.css`, `BookCover.tsx` and
  `tokens.ts`/`tokens.css` are shared with `/`'s pile — worth Kateryna's eyes
  before calling it noise.*

**Goal:** every content route in `docs/DESIGN.md` §3 resolves. Do `4a` first — it
carries the engineering substance.

Sub-phases are large. Treat **each sub-phase as one loop iteration** and stop
after each, same protocol.

### 4a `/projects` — the magazine, live data

- [x] Server component. `export const revalidate = 3600`.
- [x] Fetch language breakdown, last-commit date, description per repo
      from the GitHub REST API — one batched call per revalidation.
- [x] Repo list from `featuredRepos` in `items.ts`, not "all public repos".
- [x] `GITHUB_TOKEN` server-side only. Never in a client component, never
      `NEXT_PUBLIC_*`.
- [x] Graceful degradation: API failure renders with static/cached data and no
      visible error state.
- [x] Issue-per-project layout matching the magazine cover language.
- [x] Drop the "Live demo" link for any repo with no real deployment (§6).

**Done when:** `/projects` renders live repo data that changes after a push;
the token never reaches the client bundle (grep the build output); API failure
degrades silently; axe clean; Lighthouse ≥ 95.

**4a result** — production build, Lighthouse mobile, `/en/projects`, three runs:
performance **95 / 96 / 96**, accessibility **100**, best-practices **100**,
SEO **100**, CLS **0**, LCP **2.8s**, 335 KiB total. axe (jsdom) clean with
stats and after simulated API failure. `GITHUB_TOKEN` is absent from
`.next/static`. Notes for review:
- GitHub REST has no multi-repo endpoint, so "one batched call" is one
  `Promise.all` over `repo` + `languages` per repo. Last-commit date is
  `pushed_at` (any branch), not the latest commit on the default branch.
- All four `summary` fields are still `[BRACKETED]` and render as placeholders.
  No repo has a `demoUrl`, so no "Live demo" link renders.
- No `GITHUB_TOKEN` locally, so measured unauthenticated (60 req/h). The
  Vercel token is untested from here.
- German `projects` strings not written (Kateryna's call); falls back to EN.
  The two a11y tests now cast `deMessages` because DE lacks the namespace.
- `projects.published` flipped to `true`.
- Layout is Kateryna's screenshot: one feature project plus cards; clicking a card swaps it with the feature. Stars are no longer fetched or shown (the design's margin note says "no star counts").
- Not checked visually at 390 / 768 / 1280 by a human; grid is `auto-fit`.

### 4b `/resume` — the book

- [x] Two spreads (§4.3), inset spine shadows facing each other.
- [x] Arrows **disable at the ends** — a book does not loop.
- [x] Dots-only indicator with `aria-current`.
- [x] A real print stylesheet — `Cmd+P` gives a clean one-page CV.
- [x] PDF download.
- [x] Mobile: one page at a time.

**Done when:** printing produces a usable one-page CV (verified in print
preview, not assumed); arrows disable correctly at both ends; axe clean.

**4b result** — English CV text is `docs/CV.md` verbatim (`src/content/resume.en.ts`);
`resume.de.ts` is a German translation of it. The book is a fixed-size frame
between header and footer; the CV is one flow laid out in CSS columns, one per
page, so text runs on from page to page and nothing scrolls. Page count is
measured (4 spreads in EN, 5 in DE at 1440×900). Desktop turns pages with a
hinged leaf (CSS transform, skipped under reduced motion); the closing
photo-and-links page always opens on a right-hand page. `npm run build`, lint,
typecheck and vitest pass; axe (jsdom) clean; arrows disable at both ends
(tested). Print verified by headless-Chrome `--print-to-pdf`: exactly **1 A4
page** in EN and DE; the EN output is `public/kateryna-skoryna-cv.pdf`, the
download (also linked from the landing page). Notes for review:
- Phone number deliberately omitted (Kateryna's call).
- Solar Calculator appears in the book only, not in print or the PDF.
- Not done: Lighthouse on `/resume`, and no human look at 390 / 768 / 1280
  (mobile shows one page at a time, no page-turn animation).
- The PDF is a static English copy — regenerate it when the CV changes.
- No "what I'm looking for" page: it is not in `CV.md` (`profile.lookingFor`
  is still a placeholder).
- The German CV text is a translation by Claude — needs Kateryna's read.

### 4c `/journal` — the notebook

- [ ] Design first: spiral notebook, `docs/DESIGN.md` §2.1, §2.2, §4.3b.
      Confirm the proposed layout with Kateryna before building.
- [ ] Shared components: add the left-edge spiral to `BookCover` (notebook),
      keep the dark-green elastic band on the right, widen the coral ribbon to
      18px; replace the two bands in `ClosedBook` with the coil-edge row
      for the notebook. This also changes the landing pile and `/shelf` —
      re-check both.
- [ ] MDX entries, tags, reverse-chronological.
- [ ] Entry index + open entry views, bound by a centre spiral (§4.3b).
- [ ] Dots-only indicator where paged.
- [ ] Sample entries in `[BRACKETS]` until Kateryna supplies the real posts.
- [ ] Share button (Web Share API, copy-link fallback) on an open entry.
      Likes and comments are out of scope for 4c.

**Done when:** an MDX file added to the content directory appears in the index
and at its own URL with no code change; the spiral renders on the cover, the
closed book and the open notebook with no image or canvas; axe clean.

### 4d `/about` — the newspaper

- [ ] Multi-column with centre fold (desktop); single column, no fold
      (mobile).
- [ ] Photo essay. Natural height ~1260, scrolls (§4.5).
- [ ] Same flat `#F3EFE4` background as every other route — not a different
      stock (§1.2).

**Done when:** columns reflow to one at mobile; no horizontal scroll at any
width; axe clean.

### 4e `/handbook` — port the flip-book

- [x] Rebuild the page-flip as a React component.
- [x] **Extract the base64 images to `/public`**, serve via `next/image`. The
      731 KB inline-image mistake is not repeated.
- [x] Fix the two failing greys — `#9A9284` → `quiet`, `#6D7A72` → `muted`
      (§1.1).
- [x] Keep the EN/DE toggle.
- [ ] Only now remove the root `index.html` — and only once the React port is
      verified live at `/handbook`.

**Done when:** the ported flip-book matches the published one; page weight is
a fraction of 731 KB; both greys pass AA; the old handbook URL still resolves.

**4e result** — `/handbook` is a static route (`/en/handbook`, `/de/handbook`).
Text is the published handbook's `data-en` / `data-de` strings, unchanged, in
`src/content/handbook.{en,de}.ts`; the ten faces are in
`src/components/Handbook/HandbookFaces.tsx`, converted from `index.html` by a
one-off script and edited by hand. The four inline base64 images are now files
under `public/handbook/` (author photo shrunk to 448px) served by `next/image`.
Measured on a production build, `/en/handbook` transfers ~410 KB in total,
of which ~137 KB is the three fonts, ~165 KB the framework and page JS and ~59 KB
the images (the published page was 731 KB in one file, with fonts fetched
separately). `npm run build`, lint, typecheck and vitest (25) pass; axe (jsdom)
clean; arrows disable at the cover and the back cover (tested). All five spreads
checked by hand in headless Chrome, EN and DE. Changes from the published page:
- The toolbar, page label and key hint are replaced by the site's arrows and
  dots (DESIGN.md §4.3); the page's own language switcher by the site toggle.
- Mouse-wheel page turning is not carried over (it hijacks scroll).
- Body copy is 11px, not 10px/9px (DESIGN.md §5.4); dense pages are still scaled to
  fit, so on-screen text is smaller than 11px there — same as the published page.
- `#9A9284` → `quiet`, `#6D7A72` → `muted`; the "— inside cover —" caption is now `quiet`.
- Only the two faces in view are focusable / exposed to assistive tech.
Not done, needs Kateryna:
- **`index.html` is not removed.** It is only to go once the port is verified live
  on Vercel, which cannot be checked from here. It is still the only copy of the
  published handbook.
- Mobile shows the whole spread scaled down, as the published page did, not one
  page at a time as DESIGN.md §3 asks. No Lighthouse run; no human look at 390 / 768.
- The gem portraits and author photo are the published page's; alt text for DE is new.
- A few colours still hardcoded as `--hb-*` (handbook-only creams/greys); shadows inside
  the pages are carried over as-is, not yet on tokens.

### Phase 4 gate

- [ ] Every route in `docs/DESIGN.md` §3 resolves.
- [ ] `/projects` data changes when a repo is pushed to.
- [ ] `/resume` prints a usable CV.
- [ ] `index.html` removed **only** after `/handbook` is verified live.
- [ ] axe zero violations across all routes; Lighthouse ≥ 95 on each.
- [ ] **Human review** after each sub-phase.

---

## Phase 5 — Keystatic

**Goal:** Kateryna adds an item in the browser; it commits to this repo and
appears everywhere with no code change.

- [ ] `@keystatic/core` + `@keystatic/next`, local mode in dev, GitHub mode in
      production.
- [ ] Collections: `items`, `journal`, `reading`.
- [ ] Schema mirrors the `PortfolioItem` type exactly — adding an item is a
      data entry, never a code change.
- [ ] GitHub App auth. Admin restricted to her account.
- [ ] **Verify the admin route is not publicly reachable on a preview deploy
      before production** (`docs/BUILD.md` Risks).

**Done when:** she adds an item through `/keystatic`, it commits to this repo,
and it appears in the stack, on the shelf and at its own route with no code
edit. `/keystatic` is unreachable when signed out. axe clean on public routes.

**Human review:** required — this one has a real security surface.

---

## Phase 6 — Gates

*`docs/BUILD.md` gives no "Done when" for this phase. This is it.*

**Blocked by:** D1 (domain/rename).

This phase **extends** the pipeline built in Phase 0 (lint, format, types,
test, build) with the heavy gates — it does not create CI from scratch.

- [ ] axe-core across **all** routes in CI, zero violations.
- [ ] Lighthouse CI enforcing the budget: ≥ 95 all four categories mobile,
      LCP < 3.0s, CLS < 0.05, INP < 200ms, JS to `/` < 160 KB.
- [ ] Playwright: carousel cycles both directions, `/resume` arrows disable at
      the ends, every route resolves, `prefers-reduced-motion` honoured,
      one-click pile navigation works.
- [x] `README.md` rewritten for the portfolio, done early (Phase 1) at
      Kateryna's request rather than blocked on the rest of this phase. Its
      original content — the handbook essay — moved to `docs/HANDBOOK.md` rather
      than being discarded; nothing else in it duplicated `docs/PLAN.md`,
      `docs/DESIGN.md` or `docs/BUILD.md`, so there was nothing to migrate there.
- [x] Resolve **D1** — repo renamed to `my-portfolio`, done early (Phase 1)
      at Kateryna's request. Relative paths throughout, so the move cost
      nothing.
- [ ] Retire the GitHub Pages deployment — only after the Vercel URL is
      confirmed serving correctly (`docs/BUILD.md` Vercel hosting §4).

**Done when:** CI is green on all three gates against a pull request; a
deliberately introduced violation fails the build (prove each gate bites);
`README.md` describes the portfolio, not the handbook.

---

## Not in scope

- **Phase 7 — AI drafting.** Requires 0–6 green and a separate decision.
- **Real copy.** Every `[BRACKET]` is Kateryna's. Sample data is enough to
  build; it is not enough to launch (`docs/BUILD.md` Blockers).
- **Writing German copy.** The i18n framework is built in Phase 1, but the
  German text itself is Kateryna's to write. Structure for it; never generate
  it.
- **Dark mode.** Decided against. No dark palette, no theme toggle, no
  `prefers-color-scheme` branches.
