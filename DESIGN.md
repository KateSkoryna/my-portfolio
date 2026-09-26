# DESIGN.md — the design contract

Everything needed to build the portfolio without seeing the prototype. Exact
values, not descriptions. Where a number appears here, use that number.

The palette and typefaces are inherited from the published Prompting Handbook
(`index.html`) so the new site and the existing artifact read as one product.

---

## 1. Tokens

### 1.1 Colour

| Token | Hex | Role |
|---|---|---|
| `emerald` | `#1F6F5F` | Primary. Buttons, spines, links, rules. |
| `emeraldDeep` | `#155246` | Primary pressed / gradient end / handbook cover. |
| `coral` | `#FF6F61` | Accent. Underline squiggles, item numbers, magazine masthead. |
| `mustard` | `#E9B44C` | Secondary accent. Selection rings, kickers, bookmark ribbon. |
| `sage` | `#DCE9E2` | Tinted surface. Chips, callout panels, toggle backgrounds. |
| `cream` | `#FFF7ED` | Paper surface. Page interiors, reversed-out text. |
| `paper` | `#F3EFE4` | Page background base. |
| `charcoal` | `#232323` | Headings. |
| `ink` | `#2B2B2B` | Default body text. |
| `bodyText` | `#485349` | Long-form paragraph text on cream. |
| `muted` | `#5C6B64` | Secondary text. **4.86:1** on `paper`. |
| `quiet` | `#6F6656` | Tertiary text, URLs, captions. **4.93:1** on `paper`. |
| `placeholder` | `#6F6244` | `[BRACKETED]` placeholder labels. **5.22:1** on `paper`. |
| `labelInk` | `#46524C` | Titles printed on closed-book page blocks. **7.6:1** on white. |

**Do not use `#9A9284` or `#6D7A72`.** Both were inherited from the handbook
and both fail WCAG AA on `paper` — 2.68:1 and 3.91:1 respectively. They were
replaced by `quiet` and `muted`. The same bug still exists in the live
`index.html` and should be fixed when it is ported.

### 1.2 Page background

Not a flat fill. Two radial washes over the base:

```css
background:
  radial-gradient(1200px 700px at 12% -14%, #F0ECE0 0%, transparent 60%),
  radial-gradient(1000px 800px at 108% 116%, #EEF3EE 0%, transparent 55%),
  #F3EFE4;
```

Scale the radii down proportionally on mobile (roughly 500px/460px at 390px
viewport width).

### 1.3 Type

Three families, three jobs. Load via `next/font/google`, self-hosted, `swap`.

| Family | Weights | Job |
|---|---|---|
| **Bricolage Grotesque** | 600, 700, 800 | Display. Headings, cover titles, page numbers, counters. Optical sizing — holds up at 8px and at 46px. |
| **Manrope** | 400–800 | Body and UI. Every paragraph, label, chip, button. Uppercase at 800 with wide tracking does all eyebrow work. |
| **Caveat** | 500–700 | Margin notes only. Annotations and asides. **Never** for anything a reader must be able to read. |

Recurring type patterns:

```
eyebrow       Manrope 800 / 10px / letter-spacing .24em / uppercase / emerald
sectionLabel  Manrope 800 / 9.5px / letter-spacing .20em / uppercase / muted
h1            Bricolage 800 / 38–46px / line-height 1.0 / letter-spacing -.025em
h2            Bricolage 800 / 34px / line-height 1.02 / letter-spacing -.02em
cardTitle     Bricolage 800 / 16–17px
body          Manrope 400 / 12.5–13px / line-height 1.6 / bodyText
caption       Manrope 700 / 11–11.5px / muted
route         Manrope 700 / 11.5px / letter-spacing .04em / quiet, path in emerald
marginNote    Caveat 600 / 17–21px / emerald
```

### 1.4 Radius, shadow, motion

```
radius.pill      22–26px      buttons and chips
radius.card      9–12px
radius.book      2px 9px 9px 2px    (spine edge sharp, fore-edge rounded)
radius.closed    4px 2px 2px 4px

shadow.rest      0 18px 32px -22px rgba(20,40,30,.45)
shadow.raised    0 30px 46px -20px rgba(20,40,30,.60)
shadow.closed    0 10px 18px -14px rgba(20,40,30,.60)
shadow.button    0 10px 20px -10px rgba(31,111,95,.70)

ease             cubic-bezier(.2,.72,.18,1)
duration.turn    420ms   carousel advance, page turn
duration.select  320ms   selection change
duration.hover   300ms   hover scale
```

Every one of these is disabled under `prefers-reduced-motion: reduce`.

---

## 2. The five objects

Each item is a different physical thing so it stays identifiable both face-on
and edge-on.

| # | Item | Route | Object | Cover | Back cover | Thickness |
|---|---|---|---|---|---|---|
| 01 | Resume | `/resume` | Hardcover book | `#1F6F5F` | `#103C33` | 26px |
| 02 | Selected Work | `/projects` | Glossy magazine | `#FF6F61` | `#B8453A` | **34px** |
| 03 | Dev Journal | `/journal` | Softcover notebook | `#DCE9E2` | `#8FAE9F` | 19px |
| 04 | Off the Clock | `/about` | Folded newspaper | `#E9B44C` | `#A97C22` | 14px |
| 05 | Prompting Handbook | `/handbook` | Field guide | `#155246` | `#08241E` | 22px |

**Thickness is editorial weight, not page count.** The projects magazine is
the thickest because it is what most visitors come for. The CV is second.
This ordering is deliberate and was corrected from an earlier version that
made the CV thickest.

Titles ("Resume", "Dev Journal") are placeholders Kateryna may rename.

### 2.1 Cover construction (face-on)

Sizes: **216 × 260** on `/shelf` and `/colophon`; **244 × 340** for the
floating item on the landing page, with a separate 28px spine slab to its left
(`left: 0; top: 7px; height: 326px; radius 5px 0 0 5px`), the cover offset
`left: 24px` and given `transform: perspective(900px) rotateY(-3deg);
transform-origin: left center`.

A 7px fore-edge strip runs down the cover's right edge:
`repeating-linear-gradient(180deg, rgba(255,247,237,.85) 0 1px, rgba(190,175,150,.45) 1px 3px)`.

Per-object cover art, at 216 × 260:

- **Book** — `linear-gradient(150deg, #1F6F5F, #155246)`. Coral circle 138px
  bleeding off the top-right (`right/top: -46px`); sage circle 102px at
  `left: -38px; bottom: -42px; opacity .26`. Kicker "CURRICULUM VITAE" in
  mustard at 8px/.24em. Title 35px Bricolage in cream. Foot: name and year,
  9px, `rgba(255,247,237,.85)`.
- **Magazine** — cream field. Coral masthead band 52px tall across the top
  holding the title at 21px reversed out. Issue line in emerald 8px/.22em.
  A 2×2 grid of 46px article thumbnails (sage / emeraldDeep / mustard / sage).
  A 2.5px charcoal rule above a 13px Bricolage headline.
- **Notebook** — `linear-gradient(160deg, #DCE9E2, #C3D6CB)`, radius 9px all
  round. Ruled interior showing through: `repeating-linear-gradient(180deg,
  rgba(31,111,95,.11) 0 1px, transparent 1px 20px)`. A 15px vertical elastic
  band at `right: 32px`, gradient `#123F36 → #1F6F5F 45% → #123F36`, extending
  12px past the top and bottom. A coral ribbon marker 11px wide at
  `right: 76px`, notched with `clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)`.
  Title in **Caveat** 37px — the one cover where the display face is the
  handwriting.
- **Newspaper** — newsprint `#FBF6EA`. A 16px vertical centre crease made of a
  soft dark gradient. Masthead between double rules (2px + 1px above, 1px +
  2px below), title 21px centred, dateline 6.5px/.22em. A 14.5px headline,
  then a three-column grid of hairline "text" (`repeating-linear-gradient(180deg,
  rgba(35,35,35,.24) 0 1px, transparent 1px 6px)`) with one mustard photo block.
- **Field guide** — the existing handbook cover, unchanged so it stays
  recognisable: emerald gradient, coral circle top-right, mustard circle,
  sage circle bottom-left, a 14px sage dot grid, "FIELD NOTES" kicker, four-line
  title at 27px, Caveat strapline.

### 2.2 Closed-book construction (edge-on) — the important one

This is the object that appears in the landing pile, the `/shelf` bottom row
and the `/colophon` edge row. It went through three wrong versions. The rules:

Given `h` = thickness, `cover`, `coverDark`:

```
spineWidth = h < 18 ? 17 : 23
lip        = max(2, round(h * 0.085))

container  position relative; width W; height h; overflow hidden
           border-radius 4px 2px 2px 4px
           padding-left (spineWidth + 13)px
           display flex; align-items center
           background:
             repeating-linear-gradient(180deg,
               rgba(58,74,70,.20) 0 1px, transparent 1px 3px),
             linear-gradient(180deg, #FFFFFF 0%, #FDFAF4 50%, #F1EBDE 100%)
           box-shadow 0 10px 18px -14px rgba(20,40,30,.6)

spine      absolute; left 0; top 0; bottom 0; width spineWidth
           border-radius 4px 1px 1px 4px
           background linear-gradient(90deg,
             coverDark 0%, cover 38%, cover 64%, coverDark 100%)

hinge      absolute; left spineWidth; top 0; bottom 0; width 3px
           background linear-gradient(90deg,
             rgba(52,68,62,.22), transparent)

lipTop     absolute; left (spineWidth - 1); right 0; top 0; height lip
           background coverDark
lipBottom  absolute; left (spineWidth - 1); right 0; bottom 0; height lip
           background coverDark

label      position relative; z-index 2
           Manrope 800 / (h < 18 ? 7px : 8px) / letter-spacing .18em
           uppercase / labelInk (#46524C)

selected   box-shadow 0 0 0 2px #E9B44C, 0 13px 20px -12px rgba(20,40,30,.7)
```

**Four things that are easy to get wrong here:**

1. **The colour belongs on the spine, not in horizontal bands.** An earlier
   version filled the top 26% and bottom 18% with cover colour and left cream
   between. It read as a hamburger. The mass of colour must be vertical and at
   one end.
2. **Both cover lips are `coverDark`.** They were once different colours (lit
   top, shadowed bottom). At 2–3px there is not enough surface for that to
   read as lighting — it just looks like a book with two differently coloured
   boards.
3. **The page block is white, and the *lines* carry the texture.** A darkened
   cream fill looks like a second-hand paperback. New stock = white with a
   crisp top highlight, plus cool-toned (`rgba(58,74,70,…)`), tightly spaced
   (every 3px) lines. Age comes from warm, heavy, low-frequency texture;
   newness from cool, light, high-frequency texture.
4. **Titles are printed on the page block, not the spine.** Physically wrong,
   but a 14px spine cannot hold legible type and legibility wins.

### 2.3 Known weakness

**The newspaper is the weakest object edge-on.** At 14px with a 17px spine it
is nearly square, and a folded newspaper does not have a spine at all. It was
made wider than the others at one point to compensate, which broke column
alignment on `/shelf` and was reverted. If it still reads badly once built,
the correct fix is that `/about` should not be a newspaper — not more tweaking
of the slab.

---

## 3. Routes

| Route | Page | Rendering | Designed? |
|---|---|---|---|
| `/` | The stack. One item floats, four in the pile. | Static | **Yes** |
| `/shelf` | All five side by side, plus the closed row. | Static | **Yes** |
| `/resume` | The book opened, two spreads. | Static | **Yes** |
| `/colophon` | How the site was built: objects, palette, type. | Static | **Yes** |
| `/projects` | The magazine. Live GitHub repo data. | **ISR, 3600s** | No |
| `/journal` | The notebook. MDX entries. | Static | No |
| `/about` | The newspaper. | Static | No |
| `/handbook` | The existing flip-book, ported. | Static | No (exists as `index.html`) |
| `/keystatic` | Admin UI. | Client | N/A — library-provided |

Four routes still need designing. They are **not** blockers for Phases 0–3.

---

## 4. Mechanics

### 4.1 Landing carousel (`/`)

Three-column layout at 1440 × 900: identity block left (x 80, w 340), the
floating item centred (x 596, y 150, 268 × 340), the description panel right
(x 1040, w 320). Circular 56px arrow buttons at x 472 and x 932, y 292.

- `→` advances. The floating item **drops to the bottom of the pile** and the
  next rises into its place. `←` reverses.
- The pile below shows the other four, offset in x, rotated ±0.6–1.4°, each
  3px below the previous, tallest at the top of the stack.
- A suspension shadow — a 216 × 24 radial ellipse at 30% opacity — sits
  between the floating item and the pile. This is what sells "suspended".
- Clicking any closed book in the pile brings it to the front.
- A leader line runs from the floating item's top-right corner to the
  description panel: `M7 50 L56 50 C78 50 76 12 98 12 L178 12`, emerald
  1.4px, with a 3.6px coral dot at the book end.
- Keyboard: `←` `→` bound to the carousel. Not advertised in the UI — an
  earlier version drew keycap hints next to the visible arrow buttons and it
  read as a second, broken set of controls.

**The hard part is the return trip.** The item leaving the floating slot must
not appear to pass *through* the pile. The sequence: the pile lifts a few
pixels, the returning item slides in underneath from the front, the pile
settles. 420ms total on `cubic-bezier(.2,.72,.18,1)`.

### 4.2 Shelf (`/shelf`)

Five covers at 216 × 260, 40px apart, spanning 1240px — all five visible, none
cut off. The closed row beneath uses the **same x positions and the same
widths**, so each closed book sits directly under its own cover. That
correspondence is the point of the page; do not let the two rows drift.

- Arrows move a **selection** along the shelf, wrapping at both ends. They do
  not scroll — everything is already visible.
- Selected: mustard ring on the cover, mustard ring on its closed book, title
  turns `emeraldDeep`. **No vertical movement** — all five covers stay on one
  line.
- Hover: `transform: scale(1.2)` with `transform-origin: center bottom`, so
  the book grows upward and stays planted on the shelf line. Raise its
  `z-index` so it passes in front of its neighbours.

### 4.3 Book spreads (`/resume`)

Two 500 × 640 pages side by side with inset spine shadows facing each other
(`inset ∓16px 0 26px -18px rgba(0,0,0,.4)`). 56px arrows at x 112 and x 1272,
y 442. Arrows **disable at the ends** — a book does not loop, unlike the
carousel. Indicator below: `Spread 1 of 2 · pages 2–3`, plus clickable dots.

---

## 5. Accessibility contract

Non-negotiable. This is a build gate.

1. **Contrast.** Body text ≥ 4.5:1, ≥ 3:1 at 24px+. Every colour in §1.1 has
   its ratio recorded. New colours must be measured before use.
2. **Real elements.** `<button>` and `<a href>`. Never `role`/`onClick` on a
   `div` or `span` — Tab skips it. Icon-only controls carry `aria-label`.
3. **Touch targets ≥ 44px.** *The prototype's pagination dots are 32px and
   are wrong.* Fix in the build.
4. **`prefers-reduced-motion: reduce` disables every transform** — carousel,
   hover scale, page turns, selection transitions.
5. **Keyboard.** Arrow keys drive the carousel and page turns. Visible
   `:focus-visible` ring on every interactive element — mustard, 3px, 2px
   offset.
6. **Colours that must be distinguished also differ in lightness**, not hue
   alone.
7. **axe-core: zero violations** across all routes in CI.

---

## 6. Decisions, and why

Kept so they are not re-litigated or re-broken.

- **Palette and typefaces carried over from the handbook**, unchanged. The
  two properties should read as one product.
- **The carousel is the landing page, not the shelf.** The shelf shows
  everything at once and is arguably better for a recruiter with twenty
  seconds — but the carousel is the idea worth having. `/shelf` is the
  secondary view, reachable from a "Go to shelf" button. *(Kateryna's call,
  made explicitly.)*
- **No placeholder items for content that does not exist.** An earlier version
  drew two dashed "reserved slots" for Education and Books-I-Read. Removed.
  The site shows what exists.
- **The projects magazine is the thickest object**, not the CV. An engineer
  looking at a developer's portfolio wants to see what was built; the CV is
  what they read once already interested.
- **Server rendering must be real.** "Next.js for SSR" on a portfolio with no
  dynamic data is a claim without a mechanism, and an interviewer asking
  "what was server-rendered, and why did it need to be?" gets no answer. The
  live GitHub data on `/projects` with `revalidate: 3600` is what makes
  ISR/SSR truthful on the CV. Without it, say SSG — which is accurate and
  perfectly respectable.
- **Keystatic over a custom admin + database.** A hand-built CMS with auth is
  a bigger CV story, but it is a *different project* bolted onto a portfolio —
  triple the scope, a real security surface, and ongoing maintenance on the
  one site recruiters will poke at. Keystatic gives the browser UI with no
  backend and keeps content in git.
- **The in-app AI agent is Phase 7, and it opens a pull request.** A chat box
  that writes content directly to the site is a wrapper around an API call and
  reads thin. AI drafting an entry that lands as a PR for human review is
  defensible, safe, and demonstrates judgement about where automation belongs.

### Open, for Kateryna

- **The repo name.** `github.io/prompting-handbook/resume` undercuts a
  portfolio link on a CV. A repo named `kateskoryna.github.io`, or a custom
  domain on Vercel, fixes it. Build with relative paths so the move is free.
- **Item names** — *Off the Clock*, *Dev Journal*, *Selected Work* are
  invented. Rename them.
- **Every `[BRACKET]`** is waiting on real content.
- **"What I am looking for"** on `/resume` page 5 is the section hiring
  managers actually read and the one that cannot be drafted for her.

---

## 7. Not yet designed

`/projects`, `/journal`, `/about`, `/handbook` interiors. Mobile layouts for
everything except the landing page. Dark mode (not currently planned — the
paper metaphor argues against it; decide before Phase 2 rather than retrofitting).
