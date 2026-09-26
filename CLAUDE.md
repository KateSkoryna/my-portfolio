# CLAUDE.md

Repository conventions for Claude Code sessions working in this repo.

## What this repo is

The personal portfolio site of Kateryna Skoryna — a stack of physical objects
(a book, a magazine, a notebook, a newspaper, a field guide) that the visitor
flips through. Each object is a route.

It currently contains one finished artifact: `index.html`, the published
Developer's Prompting Handbook, a page-flip book served from GitHub Pages. That
file is **live**. Do not modify or delete it until Phase 4 of `BUILD.md`
explicitly ports it.

## Before writing any UI code

Read **`DESIGN.md`** in full. It is the design contract: tokens, object
construction with exact pixel values, motion timings, the accessibility
contract, and a log of decisions with the reasoning behind them — including
several that were wrong the first time. It exists so those mistakes are not
repeated.

Read **`BUILD.md`** for the phase plan, task breakdown and per-phase
definition of done. Work one phase at a time. Do not start a later phase
because an earlier one looks finished — check its acceptance criteria.

## Stack (decided, do not substitute)

| | |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript, `strict: true` |
| UI | React 19 |
| Styling | CSS Modules + CSS custom properties from tokens |
| Content | Keystatic (git-based, writes to this repo) |
| Hosting | Vercel |
| Data | GitHub REST API, ISR, `revalidate: 3600` |

## Hard rules

1. **Never hardcode a colour, font size, radius, shadow or duration.** Import
   from `src/lib/design/tokens.ts`. If a value is missing, add it to tokens
   first.
2. **Never invent Kateryna's content.** Anything in `[SQUARE BRACKETS]` is a
   deliberate placeholder awaiting her input. Leave it bracketed. Do not write
   plausible-sounding job history, project descriptions, or biography.
3. **Accessibility is a build gate, not a polish pass.** See the accessibility
   contract in `DESIGN.md`. Interactive elements are real `<button>` and
   `<a href>`. Never `onClick` on a `div`. Every text colour must clear its
   stated contrast ratio.
4. **`prefers-reduced-motion` disables every transform**, not just some.
5. **No WebGL, no `<canvas>`, no animation library.** CSS transforms and
   transitions only. The performance budget in `BUILD.md` depends on this.
6. **Do not add a dependency** without stating what it replaces and why the
   platform cannot do it.

## Commands

```bash
npm run dev          # local dev server
npm run build        # production build — must pass before any push
npm run lint         # eslint
npm run typecheck    # tsc --noEmit
npm run test:a11y    # axe-core against built routes
```

Run `build`, `lint` and `typecheck` before pushing. A push that breaks the
Vercel build costs a deploy cycle.

## Working branch

Development happens on `claude/portfolio-book-stack-design-cetoc8`. Do not
push to `main` without being asked.

## Design source

The visual design exists as an interactive prototype on a Claude Design
canvas. `DESIGN.md` is the authoritative written extraction of it — build from
`DESIGN.md`, not from memory of the prototype. Where the two disagree,
`DESIGN.md` wins and should be corrected if it is wrong.
