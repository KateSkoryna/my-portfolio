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

**A single flat fill: `#F3EFE4`.** Every route uses it, desktop and mobile,
including `/about` (the newspaper prints on the same paper as the rest of the
site — it reads as a newspaper through its rules and columns, not a different
stock).

An earlier version layered two radial washes (a warm `#F0ECE0` top-left, a
cool `#EEF3EE` bottom-right). On large flat pages the two tints met in the
middle and read as a diagonal two-tone split — it looked like a broken screen.
Removed. Do not reintroduce a multi-stop background; if depth is wanted, a
single very subtle one-direction wash is the most that is acceptable.

**Book/paper interiors are all `#FFF7ED` (`cream`)** — resume, handbook and
journal pages alike. The journal once used a green-tinted stock (`#F3F8F4 →
#E8F0EA`); unified to cream so every opened book matches.

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
| 01 | Resume | `/resume` | Hardcover book | `#1F6F5F` | `#103C33` | 28px |
| 02 | My Projects | `/projects` | Glossy magazine | `#FF6F61` | `#B8453A` | **36px** |
| 03 | Dev Journal | `/journal` | Spiral-bound notebook | `#DCE9E2` | `#8FAE9F` | 20px |
| 04 | Off the Clock | `/about` | Folded newspaper | `#E9B44C` | `#A97C22` | 16px |
| 05 | Prompting Handbook | `/handbook` | Field guide | `#155246` | `#08241E` | 24px |

**Thickness is editorial weight, not page count.** The projects magazine is
the thickest because it is what most visitors come for. The CV is second.
This ordering is deliberate and was corrected from an earlier version that
made the CV thickest.

**All thickness values are even and ≥ 16px** (Kateryna's call). Thickness is
the bar height of the spine-out slab (§2.2), so it is the only thing that
carries hierarchy edge-on — never hardcode a slab height per item, read it from
`thickness`. This set is canonical across the pile, the shelf and the closed row;
earlier the surfaces disagreed.

Item names: **"My Projects"** is set (was "Selected Work"). "Resume",
"Dev Journal" and "Off the Clock" are still placeholders Kateryna may rename.

### 2.1 Cover construction (face-on)

Sizes: **216 × 260** on `/shelf`; **244 × 340** for the
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
- **Magazine** — cream field. Coral masthead band 52px tall across the top,
  title at 21px reversed out, left-aligned at the same 18px inset every other
  cover kind's title uses (was centered — the one exception — until
  Kateryna's call to match). Issue line in emerald 8px/.22em. A 2×2 grid of
  46px article thumbnails (sage / emeraldDeep / mustard / sage). A 2.5px
  charcoal rule above a 13px Bricolage headline.
- **Notebook** — `linear-gradient(160deg, #DCE9E2, #C3D6CB)`, radius 9px all
  round. Ruled interior showing through: `repeating-linear-gradient(180deg,
  rgba(31,111,95,.11) 0 1px, transparent 1px 20px)`. **Spiral binding down the
  left edge**: a column of 22px-wide × 7px-tall wire coils, one every 20px to
  sit on the ruling, `emeraldDeep`, each with a 2px highlight along its top
  edge, the coil overhanging the cover's left edge by 8px; a punched hole (5px,
  `rgba(21,82,70,.35)`) sits under each coil. The cover's left radius is square
  where the coils bind it. **The 15px dark-green elastic band stays on the
  right** (`right: 32px`, gradient `#123F36 → #1F6F5F 45% → #123F36`, 12px past
  the top and bottom) — a closure strap, spiral on one side and band on the
  other (see §6). A coral ribbon marker **18px** wide (was 11px — Kateryna's
  call, it read too thin) at `right: 76px` (clears the band by 29px), notched with `clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)`,
  75px tall from the top — short, like a bookmark poking out, not the full
  height of the cover (Kateryna's call, halved once more from an already-
  shortened first pass; it read as a stripe at full length).
  **On the landing page's floating book** (§2.1 hero, and its mobile back) the
  notebook carries a 34px **page-edge strip** where the others have a spine
  slab, so all five have the same 322px footprint: the cover's own sage
  (`#DCE9E2`) with a rule and a 5px punched hole (`rgba(21,82,70,.4)`) at every coil,
  on the cover's own pitch, same long-axis volume as the spine, the gold coils
  overhanging onto it. It
  is the stacked page edges of the pad, not a bound slab — so it is still not
  a hardcover.
  Title in **Caveat** 37px — the one cover where the display face is the
  handwriting. A `coverFoot` line (`item.coverFoot`, existing content, not
  previously surfaced here) sits bottom-left in the same hand at 15px — a
  scribbled note under the title, not a second heading. Was missing entirely;
  every other cover kind already prints its `coverFoot`.
- **Newspaper** — newsprint `#FBF6EA`. No centre crease — dropped, briefly
  restored to match a reference mockup, dropped again for good (Kateryna's
  call both times; the mockup isn't the final word here). Two double rules
  sandwich the title/kicker block, one above and one below — was only one
  rule, between the title and kicker, until the reference mockup showed the
  masthead needs both. Title 21px centred, dateline 6.5px/.22em. A 14.5px
  headline (`item.coverFoot`: "Eleven things that never fit on a CV"), then a
  short (70px) three-column grid: two
  columns of hairline "text" (`repeating-linear-gradient(180deg,
  rgba(35,35,35,.24) 0 1px, transparent 1px 6px)`), and the **last** column a
  square mustard photo block, no hairlines (`aspect-ratio: 1/1`, top-aligned,
  not stretched to the text columns' full height) — a photo insert, not a
  fourth column of text.
- **Field guide** — the existing handbook cover, unchanged so it stays
  recognisable: emerald gradient, coral circle top-right, mustard circle,
  sage circle bottom-left, a 14px sage dot grid, "FIELD NOTES" kicker, four-line
  title at 27px, Caveat strapline.

### 2.2 Closed-book construction (edge-on) — the important one

This is the object that appears in the landing pile and the `/shelf` bottom row. **It is spine-out: the book faces the viewer
spine-first**, like a stack of books you read the spines of — not fore-edge or
top-edge on. (This reverses an earlier decision; see the note below and §6.)
The whole slab is the spine face. Its long dimension (`W`, roughly the book's
height) is horizontal; its short dimension (bar height) is `thickness`, so a
thicker book is a taller bar and the pile still shows its hierarchy.

Given `h` = thickness, `cover`, `coverDark`:

```
ink   = cover ∈ {#1F6F5F, #155246} → #FFF7ED   (cream, on the dark covers)
        cover = #DCE9E2            → #155246   (deep emerald, on sage)
        otherwise (#FF6F61,#E9B44C) → #232323   (charcoal, on coral & mustard)
band  = dark cover → rgba(255,247,237,.32)   light cover → rgba(35,35,35,.20)

container  position rel/abs; width W; height h; overflow hidden
           border-radius 3px
           padding 0 ~40px 0 ~16px   (room for the title and the bands)
           display flex; align-items center
           background: cover                      ← FLAT. No gradient (§6).
           box-shadow:                            ← volume is ALL shadow, no gradient
             inset 0 0 0 1px coverDark,                    (bound board edge)
             inset 0 3px 5px -3px rgba(255,255,255,.35),   (lit top curve)
             inset 0 -4px 6px -3px rgba(0,0,0,.32),        (shadowed bottom curve)
             0 2px 3px -1px rgba(20,40,30,.35),            (contact shadow onto book below)
             0 16px 24px -12px rgba(20,40,30,.55)          (drop)

edgeTop    absolute; left 0; right 0; top 0; height 1px
           background rgba(255,255,255,.30)        (crisp catch-light)
edgeBottom absolute; left 0; right 0; bottom 0; height 1px
           background coverDark                    (base board line)

bandA/B    absolute; right 30/23px; top 24%; bottom 24%; width 2px; radius 1px
           background band                         (two raised spine bands)
           EXCEPT the notebook: a spiral has no spine, so instead of the two
           bands it shows the coil edge — a row of 2px loops every 9px along
           the slab (`repeating-linear-gradient(90deg, band 0 2px, transparent
           2px 9px)`), same top/bottom 24% inset, same `band` colour.

label      position relative; z-index 2
           Manrope 800 / (h < 18 ? 7.5px : 8.5–9px) / letter-spacing .16–.18em
           uppercase / ink / white-space nowrap + ellipsis
           (the title now reads straight off the spine; it also shows larger on
            the standing cover above and in the description; see §5 on the
            11px floor — the spine label is decoration and sits under it)

selected   box-shadow: inset 0 0 0 1px coverDark,
                       inset 0 3px 5px -3px rgba(255,255,255,.35),
                       inset 0 -4px 6px -3px rgba(0,0,0,.32),
                       0 0 0 2px #E9B44C, 0 15px 22px -12px rgba(20,40,30,.6)
```

The floating hero book's spine slab gets the same idea on its long axis:
`inset 2px 0 3px -1px rgba(255,255,255,.20), inset -3px 0 5px -2px rgba(0,0,0,.28)`
over its flat cover, plus its existing drop shadow.

**Three things that are easy to get wrong here:**

1. **The fill is flat cover colour — no gradient, no page block. Volume comes
   from shadow, not colour.** The spine is one solid colour; the sense of a
   rounded, lit spine is built entirely from box-shadows — a `coverDark` inset
   ring, an inset white highlight along the top, an inset dark shadow along the
   bottom, a tight contact shadow onto the book below, and the drop. This is the
   distinction Kateryna drew: she removed the 90° colour bevel but asked for
   volume "with shadows" — so the volume is shadow, and the colour stays flat.
   The old cream page-block and left-hand spine strip are gone.
2. **Title ink is chosen for contrast, not brand.** Cream on the dark covers,
   charcoal on coral and mustard, deep emerald on sage. Do not reflexively put
   cream on coral — it is the magazine masthead treatment and fails contrast on
   a thin spine.
3. **Thickness is the only hierarchy signal edge-on.** Bar height = `thickness`.
   Do not normalise the heights "for tidiness" or the pile goes flat.

### 2.3 Known weakness

**The newspaper is still the odd object edge-on.** A folded newspaper does not
have a spine at all, so a 16px spine-out bar for `/about` is a polite fiction —
though at spine-out it reads far better than the old near-square top-edge slab,
because a thin, wide bar still holds a title cleanly. It was once made wider
than the others to compensate, which broke column alignment on `/shelf` and was
reverted. If it still reads badly once built, the correct fix is that `/about`
should not be a newspaper — not more tweaking of the slab.

---

## 3. Routes

Every route is now designed on the canvas, desktop **and** mobile. "Designed"
= a static mockup exists; the build still implements it fluid (see §6).

| Route | Page | Rendering | Designed? |
|---|---|---|---|
| `/` | The stack. One item floats, four in the pile. | Static | **Yes** (+ mobile) |
| `/shelf` | Five covers + the closed row (desktop); a vertical list (mobile). | Static | **Yes** (+ mobile) |
| `/resume` | The book opened. Two spreads (desktop); one page at a time (mobile). | Static | **Yes** (+ mobile) |
| `/projects` | The magazine. Live GitHub repo data. | **ISR, 3600s** | **Yes** (+ mobile) |
| `/journal` | The notebook. MDX entries, entry index + open entry. | Static | **Yes** (+ mobile) |
| `/about` | The newspaper. Multi-column (desktop); single column (mobile). | Static | **Yes** (+ mobile) |
| `/handbook` | The existing flip-book, ported. Spread (desktop); one page (mobile). | Static | **Yes** (+ mobile) |
| `/keystatic` | Admin UI. | Client | N/A — library-provided |

**Per-breakpoint content differences (not just reflow) the build must honour:**

- `/shelf` — desktop shows covers **and** the closed edge-on row; mobile shows
  a vertical list of covers **only** (five covers can't be legible side by side
  at 390px, and the pile already lives on the mobile landing), 21% larger than
  the 216px reference. Tablet (801–1279px) shows the covers only, two per row,
  each cover scaled to fill its column (measured, not a fixed size) with the
  caption running the full column width, and the odd fifth cover left-aligned
  on its own row *(Kateryna's call)*.
- `/resume`, `/handbook` — desktop is a two-page spread; mobile is one page at
  a time, so the indicator counts pages ("Page 2 of 5"), not spreads.
- `/about` — desktop is multi-column with a centre fold; mobile is single
  column, no fold.

---

## 4. Mechanics

### 4.1 Landing carousel (`/`)

Three-column layout at 1440 × 900: identity block left (x 80, w 340), the
floating item centred (x 596, y 150, 268 × 340), the description panel right
(x 1040, w 320). Circular 56px arrow buttons at x 472 and x 932, y 292.

- `→` advances to the next item, `←` reverses. **The new book is set
  down on top of the old one** (drops in, bounces once, settles; the old one
  stays underneath and is removed when it lands; `motion.swap`), and
  the counter number, type label, title and description are **typed out a character at a time** (the description much faster than the title), then the coral squiggle under the title is drawn (and at the start of a session the identity block on the left and the pile note are typed the same way); the leader line and the "/ 05" stay put. The pile is a queue in
  the stack's own order (the book after the selection on top, the one before
  it at the bottom): every pile book slides up one place, and the book that
  was floating **drops straight down into the bottom slot**, in front of the
  others until it lands (`pileArc`, 1.5 × `motion.swap`). `←` runs it the
  other way — the old book enters at the top.
- The pile below shows the other four, offset in x, rotated ±0.6–1.4°, each
  3px below the previous, tallest at the top of the stack.
- A suspension shadow — a 216 × 24 radial ellipse at 30% opacity — sits
  between the floating item and the pile. This is what sells "suspended".
- **Each book in the pile is a direct link to its own route.** Clicking a pile
  book navigates straight to that page — no "bring to front, then click again".
  The floating item also links to its route. This is the one-click-to-content
  path; the arrows are for browsing covers, not the only way in.
- A leader line runs from the floating item's top-right corner to the
  description panel: `M7 50 L56 50 C78 50 76 12 98 12 L178 12`, emerald
  1.4px, with a 3.6px coral dot at the book end.
- Keyboard: `←` `→` bound to the carousel. Not advertised in the UI — an
  earlier version drew keycap hints next to the visible arrow buttons and it
  read as a second, broken set of controls.

**DECIDED: the "drop to the bottom of the pile" return-trip animation will NOT
be built as specified** — it slid *under* the pile. **Superseded, Kateryna's
call:** the old book now drops straight down into the pile's bottom slot,
in front of the other books (see §4.1 above). An earlier spec described the floating item travelling down and
sliding in under the pile without passing through it — 420ms of hard,
risky motion on the critical path to content. Kateryna dropped it. The advance
is a plain reorder. This removes the single most failure-prone piece of the
build; do not reinstate it.

### 4.2 Shelf (`/shelf`)

A page heading above the shelf row itself — eyebrow "The shelf", `type.h1`
title "Everything, side by side", coral squiggle underline (same treatment as
the description panel's item title on `/`) — was missing from this section
and caught only once Kateryna reviewed the built page.

Five covers at 216 × 260, 40px apart, spanning 1240px — all five visible, none
cut off. Each cover is captioned below it: title, short blurb (`item.title` /
`.shortBlurb`, content the site already had, just not previously surfaced
here). A third caption line was tried twice — the route path (`/resume`,
read as a stray dev detail) and the item's metadata chips (implementation-
status text like "ISR · 1h", and empty for `resume`) — and dropped both
times; the caption is title + blurb only until Kateryna has a replacement.
Below that, a separator, an eyebrow + margin-note heading ("The same five,
closed — this is how they sit in the stack"), then the closed row itself,
then a closing paragraph. None of this — captions, separator, heading,
paragraph — was in this section originally; all caught only once Kateryna
reviewed the built page.

The closed row beneath uses the **same x positions and the same widths**, so
each closed book sits directly under its own cover. That correspondence is
the point of the page; do not let the two rows drift — a plain block-level
CSS grid defaults to packing its tracks to the *start* edge rather than
centering them as a block, which silently misaligned the two rows the first
time; `justify-content: center` on both fixes it, `justify-items` alone does
not.

- Arrows move a **selection** along the shelf, wrapping at both ends. They do
  not scroll. **Disabled while every item already fits the five-column grid**
  — with nothing off-screen to reveal, they have no job; they activate once
  the shelf holds more items than columns. *(Coupled to the CSS
  `repeat(5, ...)` and a `VISIBLE_COLUMNS` constant in `Shelf.tsx` — the two
  must change together if the grid ever grows past five.)*
- **Nothing is selected on arrival** — the ring/scale only appears once the
  visitor actually moves one, via the arrows or the arrow keys (Kateryna's
  call; an earlier version defaulted to book 1 selected on load, which had no
  reason to be picked). The first press lands on the natural end: `next`
  selects book 1, `prev` selects book 5.
- Selected: mustard ring on the cover, mustard ring on its closed book, title
  turns `emeraldDeep`, and the **same `scale(1.08)` hover carries over** — the
  selected book stays grown, not just ringed, so "this is the one you're on"
  reads the same way "this is the one you're about to click" does on hover.
  **No vertical movement** — all five covers stay on one line.
- Hover: `transform: scale(1.08)` with `transform-origin: center bottom`, so
  the book grows upward and stays planted on the shelf line. Raise its
  `z-index` so it passes in front of its neighbours. *(Turned down from the
  original 1.2 spec — Kateryna's call — once captions existed under each
  cover, 1.2 grew a hovered cover's caption text into its neighbour's.)*

### 4.3 Book spreads (`/resume`)

Two 500 × 640 pages side by side with inset spine shadows facing each other
(`inset ∓16px 0 26px -18px rgba(0,0,0,.4)`). 56px arrows at x 112 and x 1272,
y 442. Arrows **disable at the ends** — a book does not loop, unlike the
carousel.

**Indicator: dots only, no counter text.** Every book/carousel indicator on the
site (`/`, `/resume`, `/journal`, `/handbook`, mobile) is a bare dot row — the
active dot widens to coral, the rest are sage. The "Spread 1 of 2" / "Entry 2
of 4" text labels were removed for a cleaner look. **Consequence for the build:
put `aria-current="true"` (or `aria-current="page"`) on the active dot** so a
screen-reader user still gets a position cue; each dot already carries an
`aria-label` ("Go to spread 2"). Dots are `<button>`s with a ≥44px hit area
(12px vertical padding around an 8px dot).

`/resume` and `/handbook` are interactive in the mockup: the dots and the
page-arrows drive one shared `sel` state, and the folio numbers track it.

### 4.3b Journal (`/journal`) — the spiral notebook

Confirmed by Kateryna: a blog, spiral-bound. The notebook opens like `/resume`
(same `PagedBook`): two cream (`#FFF7ED`) ruled pages side by side, bound by a
**spiral down the centre gutter** instead of a hinge shadow. Each coil is two
thin **gold** wires (`mustard`, 1.5px, 4px apart) on a 20px pitch, ending in a
5px round punched hole in the page; wires and holes share one pitch and offset
so they line up, and the run starts half a coil below the text and is a whole
number of coils tall so none is cut. CSS gradients — no canvas, no images.

- **The book holds one post.** Its text flows across the pages exactly like the
  CV: columns, one per page, nothing scrolls. Arrows and dots turn the pages of
  *that post*; arrows disable at its first and last page.
- **Post navigation lives outside the book**, so the number of posts never
  changes the layout (100 posts cost the same as 2): an **"All posts" menu** in
  the header's centre cell — a button opening a panel of real links grouped by
  year, newest first, the open post `aria-current`; the list scrolls inside the
  panel only. There are no newer / older links: the menu is the way between posts.
  `/journal` is the newest post; every post also has `/journal/<slug>`.
- **Mobile:** one page at a time, coil down the left edge.
- Posts are `.mdx` (`docs/posts.md`): date, title (the page's `<h1>`), tag
  `Chip`s, body, a Caveat margin note for asides only (§1.3), then a "have a look at" pointer to at least one other post or the handbook (`related`
  in `posts.json`), and at the end a handwritten
  invitation ("Got a thought about this? Write me.") with LinkedIn and Gmail buttons —
  the same icon pills as the landing page's identity block (`SocialLink`).
- Page turn is the `/resume` hinged leaf, `duration.turn`, disabled under
  `prefers-reduced-motion`. Coils never animate.
- Entry text is Kateryna's; nothing is invented. Anything unfinished is marked in `[BRACKETS]`.

### 4.4 Shared page chrome (every route)

One header and footer structure on all 15 route boards, desktop and mobile.

- **Header, two rows.** Row 1 (top): the **language toggle**, alone, pinned
  right. Row 2 (below): back-arrow left, route label centred, the page's own
  action right (e.g. "Go to shelf", or the `/resume` "Download PDF" which sits
  above the book's top-right corner). The two rows separate a site-wide setting
  (language) from where-you-are navigation. They were once one cramped row.
- **Language toggle.** A sage pill track (`rgba(220,233,226,.55)`) with a soft
  drop shadow and a 1px inner top highlight, holding the **selected** language
  as a filled emerald **circle** (30px desktop / 26px mobile) with the
  nav-button shadow, and the other language as plain muted text beside it. Both
  are real `<button>`s with `aria-label`.
- **Buttons carry volume.** The circular nav arrows and the CTA pills already
  had shadows; the language toggle and its selected knob match, and the
  "Go to shelf" pill now carries the nav-button shadow + inner top
  highlight, no border — a border flattens it back down and fights the
  shadow *(Kateryna's call — reverses the earlier "stays flat" note below)*.
  The back-arrow **is** a flat outlined bar — same border/fill treatment as
  the identity block's GitHub/LinkedIn/Email pills, just without their
  shadow — not a bare text link; it had drifted to one with neither border
  nor fill until `/shelf` (the first route to actually render the back row)
  exposed it. Underlined text links stay flat by intent — a shadow on a
  text link looks wrong.
- **Footer** on every route: `© 2026 Kateryna Skoryna · All rights reserved`,
  centred, Manrope 700 / 10px / `quiet`. Sequential prev/next links (where a
  page has them) sit on the row above it. The top back-arrow is the escape
  hatch; the bottom links are the reading order — do not duplicate "back to the
  stack" in both.

### 4.5 Fold / page height

One-screen routes are a uniform **1440 × 960** (1920×1080 minus browser chrome
— the most common EU desktop). Long-form routes keep their natural height and
scroll: `/projects` 960 (fits), `/journal` 960, `/about` **1260 (scrolls — a
newspaper is allowed to run long)**. Every route's core lands
above ~744px (the 1536×864 laptop fold) — verified per page. Do **not** add a
visible fold guide to the artboards; a coral one was tried and read as a pink
screen-glitch.

---

## 5. Accessibility contract

Non-negotiable. This is a build gate.

1. **Contrast.** Body text ≥ 4.5:1, ≥ 3:1 at 24px+. Every colour in §1.1 has
   its ratio recorded. New colours must be measured before use.
2. **Real elements.** `<button>` and `<a href>`. Never `role`/`onClick` on a
   `div` or `span` — Tab skips it. Icon-only controls carry `aria-label`.
3. **Touch targets ≥ 44px.** The mockup still has sub-44px controls: the
   pagination dots (give them a 44px hit area, done via padding), the language
   toggle circles (30/26px), and thin closed-book edges. Widen all of these in
   the build with transparent hit-areas — do not shrink the visible art.
4. **Minimum 11px for any text that carries information.** The mockup was swept
   so every informational run — route labels, data labels, dates, percentages,
   section eyebrows, captions — is ≥ 11px. Text below 11px is **decoration
   only**: book-cover kickers, closed-book spine labels, and the newspaper's
   mock column rules. Each of those duplicates its information at a readable
   size elsewhere (the title is 27–42px, the route is in the description). Never
   put unique information below 11px.
5. **`prefers-reduced-motion: reduce` disables every transform** — carousel,
   hover scale, page turns, selection transitions.
6. **Keyboard.** Arrow keys drive the carousel and page turns. Visible
   `:focus-visible` ring on every interactive element — mustard, 3px, 2px
   offset.
7. **Colours that must be distinguished also differ in lightness**, not hue
   alone.
8. **axe-core: zero violations** across all routes in CI.

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

### Decisions locked in a second design pass

- **The carousel stays the primary landing view** — this is a portfolio, not an
  app. The earlier note that the shelf "is arguably better" is an observation,
  not a plan; the carousel is the landing, `/shelf` is secondary.
- **Pile books link straight to their routes** (§4.1) — the one-click path.
- **Return-trip animation dropped** (§4.1) — the carousel just reorders.
- **Closed books are spine-out** (§2.2). *Reverses the earlier "titles on the
  page block" decision.* The pile and the shelf's closed row now show each book spine-first — a flat cover-coloured bar with the
  title along the spine — instead of top-edge on with a cream page block. The
  spine face is long enough to hold the title, which is what forced the old
  page-block workaround; that reason is gone. *(Kateryna's call, made
  explicitly: "make books in the stack … spikes [spines] view, face to user.")*
- **Spines are flat-coloured; volume is shadow, not gradient.** The old
  `linear-gradient(90deg, coverDark → cover → coverDark)` bevel on every spine
  (closed books and the floating book) was removed at Kateryna's request. The
  fill stays a single flat cover colour; the rounded, lit-spine *volume* she
  then asked for is built entirely from box-shadows (inset highlight top, inset
  shadow bottom, contact + drop) plus the `coverDark` ring and two raised bands
  — never by reintroducing a colour gradient. See §2.2.
- **The journal is a spiral notebook** (§2.1, §4.3b). *(Kateryna's call.)* The
  softcover-with-elastic-band was a hardcover notebook in disguise; a spiral
  makes it read as a different object from the resume book both face-on and
  edge-on, and it needs only CSS gradients. The **dark-green elastic band is
  kept** on the cover's right edge (Kateryna's call, reversing my first
  proposal to drop it) and the coral ribbon is widened to 18px. Edge-on, the two spine bands become a
  row of coil loops (§2.2). This changes the shared `BookCover` and `ClosedBook`
  components, so it also changes the landing pile and `/shelf`.
- **`/about` scrolls** (1260px) — not forced to the uniform 960.
- **Even thickness, ≥ 16px** (§2), one canonical set everywhere.
- **Magazine renamed "My Projects."**
- **Single flat background `#F3EFE4`, all book interiors `#FFF7ED`** (§1.2).
- **Dots-only indicators** with `aria-current` on the active dot (§4.3).
- **11px floor for informational text** (§5.4); sub-11px is decoration only.
- **Build fluid, not fixed-pixel.** The mockup is two fixed breakpoints
  (1440 / 390) by necessity. The build must be genuinely fluid — `clamp()`,
  CSS grid/flex, container queries — so 1280 laptops and tablets are not
  stranded between the two. The mockup is a spec of intent, not of implementation.
- **Accessibility-first** is the build's top priority, not a final polish pass.

### Open, for Kateryna

- ~~**The repo name.** `github.io/prompting-handbook/resume` undercuts a
  portfolio link on a CV.~~ **RESOLVED:** renamed to `my-portfolio`
  (`github.io/my-portfolio/resume`) rather than the special-cased
  `kateskoryna.github.io` naming — GitHub Pages is being retired for Vercel
  anyway (`docs/BUILD.md` Phase 6), so the repo name doesn't need to double
  as the site's public host. Built with relative paths throughout, so the
  move cost nothing.
- **Item names** — *Off the Clock* and *Dev Journal* are still invented
  ("My Projects" is now set). Rename if you want.
- **Every `[BRACKET]`** is waiting on real content. **This is now the critical
  path**: the design is essentially done and the site is still empty. A
  recruiter hires for what the page *says*; start with `/resume` (experience +
  "what I'm looking for") and the three project descriptions.
- **"What I am looking for"** on `/resume` page 5 is the section hiring
  managers actually read and the one that cannot be drafted for her.
- **Which repos have a live demo.** The project cards link "Live demo" to
  `#demo` placeholders. Drop the link for any repo that is not actually
  deployed — a dead demo link costs more trust than its absence.

---

## 7. Design status

All content routes are designed on the canvas, desktop and mobile. The prototype lives on a Claude Design canvas;
this file is the authoritative written extraction — build from it, and correct
it here if the two ever disagree.

**Not designed / deferred:** the `/keystatic` admin UI (library-provided, no
custom design needed) and **dark mode** (not planned — the paper metaphor
argues against it; decide before Phase 2 rather than retrofitting).
