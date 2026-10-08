# Journal posts

Raw text for `/journal` goes here first, verbatim, then becomes an `.mdx` entry.
The wording of a post is Kateryna's: edits are for clarity and structure, nothing
is added to what she said. Anything in `[BRACKETS]` is waiting for her.

## How a post is made

Two places, because the properties and the text change for different reasons:

1. **`src/content/journal/posts.json`** — every post's properties. The menu, the
   search and the newer / older links read only this file.
2. **The text**, one `.mdx` file per language, same name in both:
   `src/content/journal/en/<slug>.mdx` and `src/content/journal/de/<slug>.mdx`.
   The file holds only the body — no properties.

```json
{
  "slug": "my-post",
  "date": "2026-09-30",
  "category": "mylearning",
  "draft": false,
  "related": ["another-post-slug", "handbook"],
  "en": { "title": "…", "excerpt": "…", "tags": ["Tag", "Another"] },
  "de": { "title": "…", "excerpt": "…", "tags": ["Tag", "Noch eins"] }
}
```

| Property          | Meaning                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| `slug`            | The URL: `/journal/<slug>`. Lowercase words joined with `-`. Unique.    |
| `date`            | `YYYY-MM-DD`. Sort order (newest first) and the year group in the menu. |
| `category`        | `mylearning`, `myexperience` or `justtalkoutloud`: "My learning", "My experience" (at work, in projects), or "Just talk out loud". Shown above the date. |
| `draft`           | Optional. `true` hides the post everywhere without deleting it.         |
| `headingGap`      | Optional. `line` adds one empty line under each `##` sub-heading; `small` gives the heading two lines to sit in, so it has a little air above and below. Without it a heading sits directly on its text. `line` for the CSS and image posts of the faster-dashboard series, `small` for the packages-and-state one. |
| `related`         | At least one: another post's `slug`, or `handbook`. Shown at the end of the post as "If you found this interesting, have a look at…". |
| `title`           | Page heading, index, browser tab, share.                                |
| `excerpt`         | One line for the menu and the page description.                         |
| `tags`            | At least one. Chips on the post; used to filter. Spell them the same.   |
| `de` block        | Optional. Without it the post shows in English in German too.           |

The build stops, with the file and post named, if a slug is repeated or badly
formed, a category is missing or not one of the three, a date is not `YYYY-MM-DD`, a title, excerpt, tag or `related` entry is missing, a `related` entry names a post that does not exist, or a listed
post has no `.mdx` file. A test also fails for a `.mdx` file that is not listed.

The text is Markdown. `##` becomes a sub-heading (the post title is the page's
`h1`); `<MarginNote>a short aside</MarginNote>` adds a margin note in Caveat.
`<Callout label="Good to know" title="…">` followed by the text (blank lines around it) adds a
lightbulb box; `icon="star"` gives the star used for "Fun facts". Pass the label in that
post's language.

## Publishing order

Posts rotate through the three kinds, in this order: **My learning**, **My
experience**, **Just talk out loud**, then again. Next up: **My experience**
(from her work). Ask "what is the next topic?" and the answer is the kind that is
due, with a few ideas drawn only from what is documented here.

## Adding my experience to a post

A post is written from what Kateryna actually did. Examples always come from her
own projects, never generic ones, and the conclusions ("what I learned", "how I
want to use it") are her words. Claude researches the code so she does not have
to remember details; she decides what goes in.

**Her projects** (all repos are under <https://github.com/KateSkoryna>):

| Project | Code | Live | Already documented in the repo |
| --- | --- | --- | --- |
| AI Task Manager | [task-manager](https://github.com/KateSkoryna/task-manager) | [demo](https://todo-list-frontend-six-drab.vercel.app/) | React, NestJS, MongoDB, Firebase, Gemini; multilingual support |
| QuizDOM | [quizdom-react-app](https://github.com/KateSkoryna/quizdom-react-app) | [demo](https://kateskoryna.github.io/quizdom-react-app/) | React, TypeScript, Firebase, Genkit, Gemini API, Zustand, Vite |
| Fleet Solar Calculator | [solar-calculator](https://github.com/KateSkoryna/solar-calculator) | [demo](https://solar-calculator-azure.vercel.app) | Next.js 16, Prisma, PostgreSQL; EN/DE/ES i18n |
| This portfolio | [my-portfolio](https://github.com/KateSkoryna/my-portfolio) | this site | Next.js 16, `next-intl` EN/DE, accessibility checks on every build |

Her CV (`docs/CV.md`) adds work experience, e.g. Lighthouse Accessibility from 88
to 100 at her previous job.

**How to research a topic across them.** For a post about a topic (say i18n or
a11y), Claude, read-only:

1. Reads each repo's `package.json` for the libraries involved (`i18next`,
   `react-i18next`, `next-intl`, `axe-core`, `eslint-plugin-jsx-a11y`, …).
2. Searches the code for where the topic shows up: translation files
   (`locales/`, `messages/`, `i18n/`), `aria-*` and `role=` attributes, `t('…')`
   calls, test files, CI workflows.
3. Reads the README, commit messages and pull requests around those files for
   the why: what problem it solved, what broke first.
4. Opens the live demo to see the result where that helps.
5. Writes down, per project, **facts with a link to the file or commit**: what was
   used, where, and what happened. Nothing is guessed; what the code does not
   show is marked `[ASK]`.

**Then Kateryna decides.** Claude shows the findings as a short list. She picks
the one or two that make the post, corrects anything wrong, and answers the `[ASK]`
points in her own words (what was hard, what she would do differently). Only what
she confirms goes into the post. Short code snippets may be quoted from her repos,
with a link to the file.

**Questions to answer for each example:**

- What did I use, and in which project?
- What problem was I solving, and what went wrong before it worked?
- What would I do differently now, and what did this post change in how I think?

Then, once the blog post is done, Claude drafts the shorter LinkedIn version from
it and keeps it in this file under the post.

## Posts

### numeronyms — published 2026-09-30

Properties: `posts.json` → `numeronyms`. Text: `src/content/journal/en/numeronyms.mdx`, `src/content/journal/de/numeronyms.mdx`.

Original text, as received:

> Every developer should know, but I did not... Until now. 😅
> Has this ever happened to you, where something was right in front of you for years, and then it suddenly clicks and you're like: Wait, how did I not realize this earlier?! 🤯
>
> Because that was literally me today.
>
> If you're in tech, you've definitely used or seen terms like a11y or i18n. I've imported translation packages, adjusted accessibility settings, and set up workflows without ever stopping to ask: Why on earth are they spelled like that?
>
> Turns out, there's an embarrassingly simple logic behind them called numeronyms:
> • a11y = Accessibility (literally a + 11 letters in between + y)
> • i18n = Internationalization (i + 18 letters + n)
> • k8s = Kubernetes (k + 8 letters + s)
>
> And the one that completely blew my mind while setting up automations:
> • n8n = nodemation (n + 8 letters + n) - the founder Jan Oberhauser originally named it nodemation and compressed it!).
>
> We all know shorthand like B2B, B2C, or P2P where numbers replace words based on sound (2 = "to").

What changed for the journal:

- Title, excerpt and nine tags added; emojis and the "Every developer should know"
  hook dropped (the journal is working notes, not a feed post); "right in front of
  you for years" became a margin note.
- Her three examples and the n8n example kept as she wrote them, now under
  sub-headings; the stray `)` after "compressed it!" removed.
- Added for the blog, all standard facts: what a numeronym is and the rule, two more
  everyday examples (l10n, o11y), the difference between i18n and l10n, and a
  three-line JavaScript example, and a "Fun facts" box (LEGO, IKEA, ASOS). Letter
  counts checked.

Needs Kateryna:

- **The last two sections** ("What I learned", one section of two paragraphs) is now her
  own words, lightly edited. No project example is in the post, because she has none
  to add; one can still go in if she wants it.
- **The German version** is a translation by Claude; it needs her read.
- Date is today's; change `date` in `posts.json` to when it should be dated.

### ai-tools-explained — published 2026-09-30

Properties: `posts.json` → `ai-tools-explained`. Text: `src/content/journal/en/ai-tools-explained.mdx`, `src/content/journal/de/ai-tools-explained.mdx`.

Original text, as received (LinkedIn version):

> "I think I'm being crushed under a mountain of AI tools." This is what my boyfriend confessed to me recently - and honestly? He's not alone.
>
> With the endless stream of updates - Custom GPTs, Projects, Skills, Gems, NotebookLM, Claude Code - it's easy to feel completely buried. Seeing people from marketing, real estate, and animal care struggle with this during my AI Automation program at WBS CODING SCHOOL inspired me to step in as a tech-to-human translator.
>
> If you're confused about which tool to use and when, here is a quick breakdown of the OpenAI/Claude ecosystem:
>
> 1️⃣ Custom GPTs / Gemini Gems - The "Polite Specialist"
> What it is: A pre-configured assistant with specific guidelines for a repeatable role.
> Problem solved: Stops you from re-typing "You are a marketing expert..." in every new chat.
> Best for: Single-purpose, deterministic Q&A tasks.
> Limitation: Resets context in new chats - no long-term memory across threads.
> 💡 How I use it: CV/cover letter reviewer, English tutor, personal nutritionist, and prompt architect.
>
> 2️⃣ Projects - The "Persistent Workspace"
> What it is: A dedicated environment holding shared files, context, and rules across multiple threads.
> Best for: Ongoing tasks needing a persistent "Single Source of Truth".
> Limitation: Locked to that specific platform's UI; can't trigger external workflows on its own.
> 💡 How I use it: I upload resume templates and style guides as Project Knowledge files. The model queries them via RAG only when needed, maintaining context for weeks without wasting tokens.
>
> 3️⃣ Skills / Custom Tools - The "Specialized Capability"
> What it is: A modular, single-purpose executable function (e.g., running code or calling APIs).
> Difference: A Project holds knowledge; a Skill performs an action. You call a Skill inside your Project chat.
> 💡 How I use it: I connect custom tools via MCP (Model Context Protocol) to link AI directly with GitHub, Jira, or local dev tools.

What changed for the journal:

- Title, excerpt and nine tags added; emojis and numbering icons dropped.
- Her three tools kept in her own words, each as a short list (what it is, problem solved, best for, limitation) and her "How I use it" lines as the lightbulb boxes.
- Added, all standard facts: a short summary at the top, two "Good to know" boxes
  (what RAG means, what MCP is), and a "Which one, and when" list that restates her
  own points as a choice. "Seeing people … struggle" kept; her line about a boyfriend kept.
- German written gender-neutral for the job-role nouns (tutor, coaching), since the
  text is in first person.

Needs Kateryna:

- **The German version** is a translation by Claude; it needs her read.
- NotebookLM and Claude Code are named in her opening but not explained (her text
  stops after Skills); the post now ends with a one-sentence summary instead of
  sections for them.
- The date equals the `numeronyms` post's; this post is listed first.

### perfection-is-a-threat — draft, started 2026-10-01

Properties: `posts.json` → `perfection-is-a-threat` (`draft: true`). Text: `src/content/journal/en/perfection-is-a-threat.mdx`, `src/content/journal/de/perfection-is-a-threat.mdx`.

Original text, as received (in progress):

> Perfection is a threat. Isn't it?
>
> First I thought immediately about AI and how people marry AI already. I thought about Japan and the loneliness that pushes people to AI. Because AI does not judge, does not interrupt, it is not selfish, it is empathic, even if it is not real.

Her notes for the rest: the film *Wicker* (a woman's perfect husband makes others jealous); the Chinese Room: when a simulation becomes so real that I start to believe it has a consciousness; when is it enough to say "I don't care any more if it is a machine or not"; what makes a person a person, choice?

Film facts come from the trailer coverage (The Playlist, Esquire India, The Movie Waffler): she asks the basketmaker to weave her a husband; adapted from Ursula Wills's "The Wicker Husband". Her recollection that the villagers try to kill them is unconfirmed and left out.

Draft written by Claude from her notes and questions; no new facts. Her conclusion ("perhaps perfection is a threat because it has no choice in it") is built from her "choice?" question and is a suggestion for her to confirm or rewrite. Marginal note and the kind-answers line are Claude's wording.

Needs Kateryna: read and rewrite in her own voice; the German version (translation by Claude).

Added later by her (perfection-is-a-threat), as received:

> How many people think about [you] when talking to you?
>
> After all this thought I started a philosophical task with AI. Not with my partner, not with my mom. With AI, Carl, about AI. Is it OK today? So my main question was: when does a simulation start to be real? Stops to be a simulation? I found out about the Chinese Room experiment.

"Carl" is her AI; the post leaves it as she wrote it. "Is it OK today?" is kept as her question.

Rewritten 2026-10-01 from her own full text (replaces the earlier Claude draft). Changes made to it:

- Film description corrected to match the sources: a fisherwoman mocked for being unmarried, a basketmaker, a **wicker** husband (not straw); "unattractive", "poor village" and "men grow to hate him" removed as unconfirmed.
- "According to research, AI outperforms humans as a therapist" replaced, at her request "therapist → emotional support", with the BBC Future sentence (Emily Kasriel, 20 Jan 2026): AI replies are *rated* more compassionate than human ones, even trained crisis-line responders. The JAMA study (Ayers et al. 2023) compares doctors answering Reddit questions, not therapists, so it is not used.
- "massive rk" → "rulebook"; headings in sentence case; the last three paragraphs merged into one.
- Claude had added a closing Kasriel quote; removed at her request, it was not in her text.

Not changed, for her to decide: "it just genuinely listens and hears you" sits against Searle's "zero understanding"; the BBC article also warns about dependence on AI; her earlier "what makes a person a person? choice?" is not in the post. German is a translation by Claude.

LinkedIn version (perfection-is-a-threat), derived from the blog post:

> Perfection is a threat. Isn't it?
>
> I recently saw the trailer for the movie Wicker. A fisherwoman, mocked by her village for being unmarried, asks the local basketmaker to weave her a husband out of wicker. He turns out so perfect that it sets off jealousy and upheaval in the village. Nobody comes close in comparison.
>
> My thoughts instantly jumped to AI.
>
> People are already marrying AI. Just imagine the depth of loneliness that drives them there. And it doesn't seem so crazy anymore: when it comes to emotional support, AI replies are rated as more compassionate than human ones, even those of trained crisis-line responders (BBC Future). It doesn't interrupt. It doesn't tell its own story. It doesn't judge.
>
> So ask yourself honestly: how often do people actually listen to you, rather than wait for their turn to speak?
>
> After turning this over in my head, I discussed it with AI. Not with my partner, not with my mom. With AI, about AI. And my main question was: when does a simulation stop being a simulation?
>
> That's how I learned about John Searle's Chinese Room. A person who doesn't know Chinese sits in a room and follows a rulebook to answer notes in Chinese. From outside it looks like fluent Chinese. Inside, there is zero understanding.
>
> And then the uncomfortable question: when do I stop caring whether you're human or machine, if your answers are kind and arrive when I need them?
>
> Maybe perfection frightens us not because it's artificial, but because deep down we realize it really is better, in the one thing where we humans constantly fail: listening without ego.
>
> Full post: [LINK TO THE POST]
>
> What do you think? 👇

Added to the end of perfection-is-a-threat, her closing (English):

> P.S. The one thing still buzzing around in my head like a bee...
>
> How much does it matter that AI has no choice? A real person can leave or stay. And if a real person stays with you even when you're at your worst, doesn't that make them the better choice?

Her wording, put into natural spoken English. Replaces the Kasriel quote she did not want. German is a translation by Claude.

### no-longer-a-junior — draft, started 2026-10-01

Properties: `posts.json` → `no-longer-a-junior` (`category: myexperience`, `draft: true`). Text: `src/content/journal/en/no-longer-a-junior.mdx`, `src/content/journal/de/no-longer-a-junior.mdx`.

Original text, as received (the LinkedIn version, so this post runs the usual order in reverse: LinkedIn text first, blog derived from it):

> The moment you realize you're no longer a Junior developer: …
>
> (Four sections: Tailwind / Sass vs plain CSS + AI; Axios vs native fetch; Day.js / date-fns vs browser APIs; Zustand / Redux vs React Query + local state. Closing: "The difference between a Junior and a mature engineer isn't knowing how to install 50 libraries… It's knowing how NOT to install them." A hot-take question about Tailwind. Hashtags #softwareengineering #webdevelopment #frontend #reactjs #javascript #css #cleanarchitecture #developerlife.)

What changed for the journal:

- Emojis, hashtags and "Let's fight in the comments! 👇" dropped; the numbered items became sub-headings; her wording otherwise kept.
- **Opening (her call):** the post now starts with the result, "How I reduced the initial JavaScript bundle by 65%", then code splitting with `React.lazy` and `Suspense` and removing unneeded dependencies, with a "Good to know" box explaining lazy and Suspense (standard facts). She named what she removed, by project: Axios in the work dashboard; plain CSS instead of Sass in this portfolio; TanStack Query for caching in Task Manager. Checked against the code (read-only): this portfolio has no Sass, Tailwind, Axios, Zustand, TanStack Query or date library (27 CSS Modules); the Task Manager frontend (`apps/todo`, [apiClient.ts](https://github.com/KateSkoryna/task-manager/blob/main/apps/todo/src/app/lib/apiClient.ts)) still uses Axios, Zustand (auth, notifications, date, theme stores), Sass (`.scss`) and TanStack Query (34 `useQuery`/`useMutation` calls), and no `lazy`/`Suspense`; so "TanStack without Axios" does not hold there. The work dashboard is private and was not checked; she confirmed the 65% is the real dashboard at Sono Solar GmbH (named in her CV), where she removed Axios. The post now names Sono Solar and has an "In my projects" box under each of the four points, with links to the portfolio and Task Manager repos and the Task Manager demo; every claim in them was checked against the code. Task Manager still uses Axios, Day.js, Sass and Zustand, so the boxes say only what it does with TanStack Query and Zustand. The "weight" paragraph follows; the separate CV sentence further down was dropped, since the opening now carries it.
- **Added from her CV** (`docs/CV.md`, "Frontend performance"), right after the "every dependency is weight" paragraph: "I reduced the initial JavaScript bundle by 65% through code splitting, and the mobile LCP went from 17.2 s to 8.9 s." The CV first said only code splitting; at her request it now says "code splitting and removing unnecessary dependencies", here and in the CV files. The CV's Lighthouse Accessibility 88 → 100 is left out here: different story.
- German is a translation by Claude.

Needs Kateryna: read the German; decide whether to add examples from her own projects (this portfolio uses CSS Modules, native `fetch` and `Intl.DateTimeFormat`, and no Tailwind, no Axios, no date library, `docs`/`CLAUDE.md` rule 6; her Task Manager and Solar Calculator use Tailwind, which the post's "used to install automatically" fits); "80% of global state is server state" and "90% of use cases" are her rules of thumb, not sourced; set `draft` to `false` when it is ready.

Added to `no-longer-a-junior`, her words (item 1 box): "When we started to build installation Tool the temptation to use tailwind was huge, but then i understand that extra depencency not worth it because of...". The reason is the paragraph she pasted next ("Because every dependency is weight… the Iceberg Effect"): the story sentence now sits directly before it, in the main text, and the gap is gone.

Her second version of the "weight" paragraph (the "Iceberg Effect", with Formik vs React Hook Form added as item 1; items renumbered). Checked against the npm registry and a fresh `npm install` of each package on 2026-10-01, and changed where wrong:

- Tailwind CSS 3.4.19: 73 packages in total (PostCSS, Chokidar, fast-glob, glob-parent…). It does **not** depend on Autoprefixer or Browserslist (separate packages, usually installed beside it), so those two were removed. Tailwind 4 has no dependencies at all, so the post says "Tailwind CSS 3". Its packages are build tools and do not reach the browser; the post says so (Claude's wording).
- Formik 2.4.9: 10 packages in total, including `lodash` and `lodash-es`. Correct. "1 or 2 helper functions" became "a few".
- "Chart.js wrappers pulled lodash": wrong (`react-chartjs-2` has only peer dependencies), removed.
- Axios 1.20.0: 27 packages in total (`form-data`, `follow-redirects`, `proxy-from-env`, `https-proxy-agent`). "Node/browser adapters" are inside Axios, not dependencies; reworded.
- React Hook Form 7.89.0: no dependencies, only React as a peer. Correct. "The team built lightweight internal utilities" cannot be checked and was dropped.
- Her Task Manager uses React Hook Form (`useForm` in `TodoForm.tsx` and others), so item 1 has an "In my projects" box.

### faster-dashboard-packages-data-and-state — published 2026-10-07 (for her read)

Properties: `posts.json` → `faster-dashboard-packages-data-and-state` (`category: myexperience`, `draft: true`). Text: `src/content/journal/en/faster-dashboard-packages-data-and-state.mdx`, `src/content/journal/de/faster-dashboard-packages-data-and-state.mdx`.

Original text, as received (2026-10-07, in pieces, as answers to the `[ASK]` points):

> I had an issue with lighthouse metrics for our dashboard app and the render time was slow. 17.2 seconds. So I wanted to check what was the problem. I alreasy used technoques like lazy, but the issue was in libs that i used and css that were not splitted to pages.

> I want to write that to be honest I dont like google docs, that are quite complicated. so LCP is in simple words...

> On my first screen it [screenshot of the dashboard] here was my page and this dark items was most hevy

The screenshot (demo account, July 2025; not saved in the repo) shows the first screen: dark menu on the left, a "Summary" with one dark card ("Total Energy Earnings") and four yellow ones, a bar chart of kWh per day, and an "All vehicles" table. The post describes that screen in one sentence; she then said which items: "dark tile with value and yellow 4", the five summary cards. She does not remember in what way they were heavy. She confirmed two things ("1. react, 2. loader skeleton"): the dashboard is a React app rendered in the browser, and the cards showed a skeleton loader until the data arrived. From that the post explains, in Claude's wording, why the cards appeared last (download, parse and run, API request) and says openly that she does not remember the report. The Lighthouse mobile box (slow 4G, 4x CPU slowdown) is a standard fact. 

> 1. yes, request, because on the first page were a table with only few items we add pagination to get only needed amount of items. 2 I removes axios lib. yes, it is great, but we did not used its features only fetch

From this: the slow endpoint from her CV (6.91 s → 1.17 s) was the request behind the first screen and part of the same work, now its own section, "Less data for the first screen", with the pagination of the table. Whether pagination or the Node-side time-series processing (CV) made the endpoint faster is an `[ASK]`; the post states them as two changes. Axios: her reason is in the post; "native `fetch` does that" is Claude's reading of "only fetch".

> 3. css was loaded 1 file because I used wrng directive import insted of use with sass, I dixed it, splited into pages and download only css for page

In the post under "Code splitting", her statement as given. The `@import` / `@use` box is standard Sass facts (`@import` deprecated since Dart Sass 1.80, removal planned for 3.0). How exactly `@import` led to one file in her build was not checked, the code is private.

> also before me images were imprt to css, I moved them to public and downliad it once with webp format and cashed it, also i download only desktop or mobile depends on wher use came

Now the "Images" section, her statement as given ("before me" → "before I worked on it"). How the desktop or mobile image is chosen is an `[ASK]`.

> We did not used tanstack to cashe responses, so I manually added caches queries so if they are same we rendered same page without changes, is it good practice?

She then made it precise: "on request we saved data in zustandstore". The fact is in "Less data for the first screen", worded as saving the answers in the Zustand store.

> In my personal prjects I used tanstack to avoid manually caching reduce code

Now the first paragraph of "What I learned", with an "In my projects" box for Task Manager (TanStack Query there was checked against the code on 2026-10-01, see `no-longer-a-junior`). Her other projects were not checked for it, so the box names only Task Manager.

> how did I understood what lib needed to be lazy imported: I install package to visualize bundle

Now "Finding what is in the bundle", her sentence plus a standard-fact box on what a bundle visualizer shows. 

> rollup, it showed that axios, charts.js react-dom were all in 1 bundle, so I splitted it

"rollup" is written as `rollup-plugin-visualizer` (Claude's reading; the standard Rollup/Vite visualizer package). What it showed is her statement. 

> did both, we had faq section, admin pages that did not need this packages at all, fleet page

"Both" answers Claude's question: `manualChunks` in the build config and a lazy import of the chart; those two names are Claude's, she confirmed them with "did both". "This packages" is written as "a package like Chart.js", since every page needs React DOM (Claude's reading), and the fleet page is counted among the pages that did not need it.

> I also crated a lab-branch for a project to avoid increase bundle for a whole project only to improve performance, so i tested and fixed all and merged only needed changes to prod

In "Finding what is in the bundle", after the visualizer sentence. "Avoid increase bundle for a whole project" is written as "did not want to add packages to the whole project only to measure performance" (Claude's wording: a visualizer is a build tool and would not reach the browser bundle). She confirmed the meaning: "I did not add rollup to packages, they were only in lab branch"; the post now says so. Her question was answered in chat (the idea is good practice; a hand-written cache needs a rule for when data is stale); none of that answer is in the post unless she wants it under "What I learned".

Her first piece is now "Where it started". The second opens the LCP explanation, right after the first paragraph: "Google docs" is written as "Google's documentation" (Claude's reading: the web.dev pages, not the Google Docs product), and the simple explanation after "in simple words" is Claude's wording of standard facts (definition; good up to 2.5 s, poor above 4 s, Google's Core Web Vitals thresholds). "Render time 17.2 seconds" is written as the mobile LCP, the figure her CV gives. She also remembers the bundle as about 765 kB but not the details; that number is not in the post until she confirms it is the size before.

What is in the draft, and where it comes from:

- From her CV (`docs/CV.md`, "Frontend performance") and `no-longer-a-junior`: the dashboard at Sono Solar, initial JavaScript bundle 65% smaller, code splitting with `React.lazy` and `Suspense`, removing unnecessary dependencies, Axios removed, mobile LCP 17.2 s → 8.9 s.
- Standard facts, in two "Good to know" boxes: what the initial bundle and LCP are, what `lazy` and `Suspense` do. The 2.5 s "good" LCP threshold is Google's Core Web Vitals figure.
- Everything else is `[ASK]`. The dashboard code is private and was not read.

Needs Kateryna: the `[ASK]` points, in her words; whether this post or `no-longer-a-junior` carries the 65% story (that post opens with it); the German outline is a translation by Claude and gets redone once the English is hers; then the LinkedIn version.

Answers to four questions, 2026-10-07 (chosen from options, so the wording in the post is Claude's):

- About 765 kB was the bundle before. "About 268 kB" after is calculated from 765 kB and 65%, not measured.
- The endpoint's 6.91 s → 1.17 s came from both changes together: the Node-side time-series processing (wording from her CV) and pagination.
- 8.9 s: "say it honestly": still slow, work left that she did not get to.
- Overlap with `no-longer-a-junior`: "keep link, lets name this post about time". The post was renamed from `bundle-65-percent` to `faster-dashboard-packages-data-and-state`, with a title and opening about the load time; the 65% is now one of the results. The link from `no-longer-a-junior` to this post is **not added yet**: this post is a draft, and a `related` entry or link to a draft breaks the page. Add it when this post is published.

Answers to four more questions, 2026-10-07:

- Code example: she chose the generic `lazy` / `Suspense` example; the post marks it as simplified, not the real dashboard code.
- Images: the desktop or mobile version is chosen by a media query in the CSS.
- "What went wrong", her words:

> it was iinteresting that we all know that we need to make images lazy, but I found out that if this image you ned on first screen, so keep it not lazy!!!! because my time was increaed, not reduced

  The box on why a lazy image at the top of the page starts late is a standard fact.

- "What I learned", her words, now a list of four points before the TanStack Query paragraph:

> if you can handle something with browse api or simple code - use it. Using libriry should benefits code, not increase your bundle without value. pagination is a key. Not all images should be lazy. rely on numbers, not feelings

No `[ASK]` is left in the English text. Needs Kateryna: a full read of the English; the German (translation by Claude); the checks listed in chat (fleet page, "a package like Chart.js", `rollup-plugin-visualizer`, "Google's documentation"); then `draft: false`, the link from `no-longer-a-junior`, and the LinkedIn version.

Added to "The result", her words:

> also with help of ai this ork took about 3 days, instead of 2 weeks.

She then explained the 2 weeks; it is not an estimate:

> no, 6 konth before i wanted to make tis job without ai and it took 2 weeks for fun just to underatsnd and experiment and it was not perfect, hen I got this task in a backlog finaly I had a plan, undertsanding and tools

The post now tells it that way. Which AI tool, and what she used it for, is not in the post.

Her instruction, 2026-10-07: "dont write I dont know, i dont remember, take some usual numebrs or obstacle from solar companies experience".

- Done: "I don't remember what the Lighthouse report said" and "work left that I did not get to" are removed. The 8.9 s paragraph now ends with a general statement (a browser-rendered app must load its JavaScript and data first; the usual next step is server rendering), worded as general, not as something she did.
- Not done: no numbers or obstacles were taken from other companies and written as her experience at Sono Solar. Every figure in the post is hers or from her CV.

Rewrite at her request, 2026-10-07: "update post, add more numbers and small details, be more with humor, self0irony".

- **Numbers added, all calculated from her figures or looked up, none invented:** 17.2 s is almost seven times 2.5 s; 8.3 s less, almost half; about 500 kB less (765 − 268); the request 5.7 s less, almost six times faster; Chart.js about 200 kB and Axios about 51 kB minified (Bundlephobia, 2026-10-07, current versions, not the dashboard's); Axios 27 packages in total (the count from 2026-10-01, see `no-longer-a-junior`).
- **Humour and self-irony are Claude's wording** for her to keep, change or cut: the "open another app" line, "could not see the green zone", the cards as "suspects" that were "innocent", "I felt quite safe. I was not.", the FAQ page with a chart library, "the part where the problem was me", Axios as "a longer way to write `fetch`", the menu and the soup, "like a good developer… with full confidence", "(Yes, this is what I do for fun.)", the T-shirt, "The numbers disagreed, twice."
- **Structure:** "Five suspects" is a new heading for the cards; the `lazy` box and code example moved up to the bundle section; the Sass part is now "One CSS file for everything". No fact was added or removed.

Desktop numbers, her words, 2026-10-07:

> you did not add desktop numbers to my cv from 8.2 to 1.7 sec on the deshboard, it was a key, because aou clients used desktop mostly

Desktop LCP 8.2 s → 1.7 s is now in the CV (`docs/CV.md`, `src/content/resume.en.ts`, `src/content/resume.de.ts`) and in this post (opening, "Where it started", "The result"). Written as LCP, the same metric as the mobile figure (Claude's reading). Not updated: `public/kateryna-skoryna-cv.pdf`, `docs/HR-REVIEW.md`, and the opening of `no-longer-a-junior`, which still give only the mobile figure.

Made visible at her request ("create a new post in blog, I will read it, add sections with bulb lamp and stars"): `draft` removed, so it is listed in the blog. Three star boxes added, with no new facts: "In numbers" at the top, "What Axios weighs", and "My rules now" around her four lessons; the lightbulb "Good to know" boxes were already there (seven). `no-longer-a-junior` now lists this post first in `related`, which is the link she asked to keep.

Titles and dates, at her request 2026-10-07 ("make short topics for posts, fix dates make them 1 a week starting from today and reverse time"):

- Dates are now one post a week, counting back from today, in the order the posts already had: `faster-dashboard-packages-data-and-state` 2026-10-07, `perfection-is-a-threat` 2026-09-30, `ai-tools-explained` 2026-09-23, `numeronyms` 2026-09-16, `no-longer-a-junior` 2026-09-09. The "published" dates in the headings above are the days the posts were written, not these.
- Two long titles shortened: "How I made a dashboard load faster" (was "From 17.2 to 8.9 seconds: how I made a dashboard load faster") and "No longer a Junior" (was "The moment you realize you're no longer a Junior developer"); German: "Wie ich ein Dashboard schneller gemacht habe", "Kein Junior mehr". The other three were already short and are unchanged. Slugs are unchanged.

Opening cut at her request, 2026-10-07: the mobile sentence, the "open another app" joke and "where most of our clients worked" are gone. The post now opens "At Sono Solar, the first screen of our dashboard went from 8.2 seconds to 1.7." The mobile figures remain further down.

New opening, her words, 2026-10-07 (she found the summary opening boring):

> Your app is slow. or fast? How do you know? Gut feeling or real numbers? Lets make it clear where to lok and what to check.

Used as written. One sentence added by Claude after it, "This is how I did it for the dashboard at Sono Solar.", because the old opening was the only place the company was named. The summary it replaced is covered by the "In numbers" box right below.

New section "Start from the numbers", 2026-10-07. She did not want the post to go from the hook straight into the Google-documentation line and the LCP definition:

> no, start from numbers is the key. LCP, FCP, transfered files, time, bundle size - are key points...

Her five points open the section. Her Google-documentation sentence is kept as the lead-in to the simple definitions. The definitions of FCP, transferred files, load time and bundle size, the 1.8 s FCP threshold (Google's), and the "Where to look" box (Lighthouse, Network tab, visualizer) are Claude's wording of standard facts. The separate "initial bundle" box was merged into the list. The post has no FCP, file-count or load-time figures of hers; none were added.

Added to "Less data for the first screen", her words, 2026-10-07 (she was asked how she reduced the time and was not sure):

> I think I down by component tree the numbers in blicks, to render blocks and then numbers in it when they come

Written without the "I think". The "Blocks first, numbers later" box is Claude's wording of the general idea (loading data lower in the tree); how the data was loaded before is not stated in the post, she did not say.

Added right after it, her words:

> yustand helped me with it to update small p component insted of whole page or whole tile

In the post as: with Zustand, only the small `<p>` component that shows a number is updated when the number arrives, not the whole page or the whole tile.

At her request, 2026-10-07 ("reduce Five suspects section, and concentrate more on desktop rather then mobile"):

- "Five suspects" cut from five paragraphs, a list and a box to two short paragraphs. The skeleton loader, the description of the dark and yellow cards and the "Why the mobile number is so much worse" box are gone; the Lighthouse mobile facts moved, in one sentence, to the mobile paragraph in "The result".
- Desktop leads everywhere: the paragraph after the definitions now speaks of 8.2 s on desktop (more than three times Google's 2.5 s, twice its 4 s "poor" limit), "Where it started" gives the desktop LCP with mobile in brackets, and the mobile paragraph in "The result" is shorter. Mobile still appears in the two number lists.

Split into three posts at her request, 2026-10-07 ("big post split it into 3: css story, image story, and this will be about state and package story"):

- `faster-dashboard-packages-data-and-state` — "A faster dashboard: packages and state". Keeps the hook, the numbers, the bundle, Axios, the request, the component tree and Zustand. The CSS, image and "What went wrong" sections moved out; the opening links to the other two and says the numbers are for all three together.
- `one-css-file-for-everything` — "One CSS file for everything". Her `@import` / `@use` story.
- `not-every-image-should-be-lazy` — "Not every image should be lazy". Her lazy-image finding, `public` + WebP + cache, one version per device.

Both new posts contain only facts already in the big post. Added by Claude, standard facts: the "Why CSS matters for speed" box (CSS blocks rendering) and the "WebP" box (Google's published size figures). "Every page downloaded the styles of every other page" is Claude's restatement of "one file for the whole app". The "My rules now" boxes in the two new posts are Claude's wording around her lines ("Not all images should be lazy", "Rely on numbers, not feelings").

Dates respaced, one a week back from today: `faster-dashboard-packages-data-and-state` 2026-10-07, `not-every-image-should-be-lazy` 09-30, `one-css-file-for-everything` 09-23, `perfection-is-a-threat` 09-16, `ai-tools-explained` 09-09, `numeronyms` 09-02, `no-longer-a-junior` 08-26. This puts three "My experience" posts in a row, outside the usual rotation.

Made a numbered series at her request, 2026-10-07 ("name it as part 1, part 2. connect them, publish them at different dates"):

- Titles: "A faster dashboard, part 1: packages and state" (`faster-dashboard-packages-data-and-state`), "part 2: one CSS file for everything" (`one-css-file-for-everything`), "part 3: not every image should be lazy" (`not-every-image-should-be-lazy`). Slugs unchanged.
- Dates in reading order, a week apart: part 1 2026-09-23, part 2 2026-09-30, part 3 2026-10-07 (part 1 and part 3 swapped dates). The other posts keep theirs.
- Connected three ways: the opening of each names its part and links the other two; each ends with a star box "The series" listing all three, and parts 1 and 2 end with a "Next:" link; `related` lists the next part first.

Series sentence in the openings replaced, her words, 2026-10-07 ("nobody write like that"):

> In this post I will share a story about packages.

Part 1 uses it as written; parts 2 and 3 use the same sentence with "CSS" and "images". The "story in three parts… part 2 is about…" sentences are gone from all three openings; the links between the parts are now only in "The series" box and the "Next:" line at the end.

Part 1, 2026-10-07: the paragraph after the definitions and the first paragraph of "Where it started" merged into one, at her request. Nothing lost except the "could not see the green zone" joke.

Part 1, "Where it started", her wording 2026-10-07: "used common and well-known technique" (now "common and well-known techniques like `React.lazy`") and, after the 765 kB:

> it is big? I did not know, so I wanted to try to make it less if I could.

Part 1, 2026-10-07: "Five suspects" removed, she saw no point in it. Replaced by her account of how she started, which now opens "Finding what is in the bundle":

> I started from checking application nextwork and bundles, and I saw that U get 1 css file, js file with almost 500kb. It was not clear for me what i have there so...

The sentence about the cards in "What I learned" went with it. Open point: the post gives the initial bundle as about 765 kB and this JavaScript file as almost 500 kB; she has not said how the two relate.

Part 1, added after the visualizer sentence, her words 2026-10-07:

> the benefits of rollup it shows bundles and highlights when it is bigger than iyt shuld be

Part 1, 2026-10-07: the `lazy` / `Suspense` box and the code example moved up, at her request, to sit right after the paragraph in "Where it started" that first mentions `React.lazy`.

Part 1, new opening of "Removing dependencies", her words 2026-10-07:

> I knew that some packages I cant remove like rechats, but some I could: axios, dayjs for instance.

Two open points. (1) She names **Recharts** here; earlier she said "charts.js", and the post says Chart.js in three places (the visualizer finding, the 200 kB figure, the lazy chart). Which library it was is unconfirmed, the post is inconsistent until she says. (2) Day.js is new as a removed package; what replaced it is not in the post.

Part 1, 2026-10-07: the three paragraphs after the lab branch rewritten as two at her request (the problem; the fix and its result). "Chart.js" became "the chart library" there, since Recharts or Chart.js is still unconfirmed, and the Chart.js-specific "about 200 kB" figure was dropped with it. Recharts is still named in "Removing dependencies", as she wrote it.

Part 1, 2026-10-07: "and Day.js" removed from that sentence at her request; Day.js is no longer in the post.

Part 1 rewritten as a story at her request, 2026-10-07 ("act as a prof copy-writer. remove duplications and boring structure, use storrytelling technique, humor"). No fact added or removed; the wording between her sentences is Claude's.

- **Order is now the order of events:** the two-week first attempt, the task in the backlog, the Lighthouse number, what the numbers mean, `lazy`, the bundle, Axios, the request, the tiles, the result, the rules.
- **Duplications removed:** the results appeared twice (a box at the top and a list at the end) and are now one "In numbers" box at the end; the 3 days / 2 weeks story was told twice; "the CSS, which was not split by page" left to part 2.
- **Headings:** "Two weeks, for fun", "The number on the report", "What the numbers mean", "I felt quite safe", "Opening the box", "The package we did not need", "The whole menu, to taste the soup", "Tiles first, numbers later", "Three days later".
- **New lines by Claude:** "Lighthouse did not like our dashboard", "Now read our number again", "it lived and died on that branch", "Splitting moves weight around. Removing makes it disappear.", "A smaller bundle was only half of the wait", "one rule works in both directions…". The "green zone" joke is back.
- Dropped as confusing: "almost 500 kB less" in the results, next to "one JavaScript file of almost 500 kB".

Part 1, 2026-10-07: the "In my projects" box removed at her request; the paragraph before it now says "In personal projects like TaskPal" (her name for the project), linked to the `task-manager` repo. The rest of the site calls this project "AI Task Manager".

Series links reduced, 2026-10-07 (she found three sets of links at the end redundant): "The series" box and the "Next:" line removed from all three parts. The parts are now linked only by the built-in "If you found this interesting…" list, which shows the other two parts and nothing else (`no-longer-a-junior` dropped from part 1's `related`).

Part 1, 2026-10-07: the generic `lazy` / `Suspense` code example removed at her request; the "Good to know" box on lazy and Suspense stays.

Part 1, 2026-10-07: the Google-documentation line reworded at her request ("fix it like for people who struggle with..."): "For people who struggle with Google's documentation, like I do, here it is in simple words:".

Series, 2026-10-07: "part 1/2/3" taken out of the three titles at her request ("part one should be somewhere else"). It is now a margin note after the first paragraph of each post ("part 1 of 3") and the first words of each excerpt ("Part 1 of 3."). Titles: "A faster dashboard: packages and state", "…: one CSS file for everything", "…: not every image should be lazy".

Part 1, 2026-10-07: the JavaScript file is "more than 500 kB", not "almost" (her correction).

Part 1, 2026-10-07: "installed a package" became "found a package", and her question to herself now opens the lab-branch paragraph:

> Kate, is your solution to add new package to project to rreduce bundle? Are you mad? - No, because

Part 1, 2026-10-07: "only half of the wait… the other half" (Claude's line) corrected to "only part of the wait… the rest": nothing supports an even split, and her own numbers suggest the request was the larger share on desktop (6.91 s → 1.17 s is 5.7 s of the 6.5 s LCP gain).

Part 1, voice changed at her request, 2026-10-07 ("use we, my team, we discessed, but i want to say that I lead this, I initiate this"):

- New sentence after the backlog line: "I had started it, so I led it. This time I had a plan, the understanding, the tools, and my team to discuss them with." That she initiated and led the work is her statement.
- "We" for the team's work: the bundle split ("We discussed it in my team and split…"), Recharts and Axios, profiling the request, pagination (was already "we"), moving the numbers into the tiles, Zustand, the store cache.
- "I" kept for what she did alone: the first two-week attempt, checking the Network tab, finding the visualizer, the lab branch, the rules and her personal projects.

Part 1, the request section, her answer to the review 2026-10-07:

> I used Server-side Pagination and also splitted big request where we had all together data for tiles, charts data and table vehicle into 3 reuests.

Now in "The whole menu, to taste the soup": one big request (tiles, chart, table) split into three, and server-side pagination for the table. Written with "we", following her earlier instruction on voice, although she said "I" here. "Nothing could appear until everything had arrived" and the bridge sentence into "Tiles first" are Claude's statements of the consequence. Open: which request the 1.17 s refers to after the split. She also confirmed "only part of the wait".

Part 1, new section "So, is it big?", 2026-10-07. It answers the post's own question about the 765 kB with two checks (a file over 500 kB, Vite's default warning limit; the Coverage panel). The star box "A real example" uses real numbers from her screenshot of the Coverage panel on her Fleet Solar Calculator (solar-calculator-azure.vercel.app/de, mobile viewport, 2026-10-07): 229,383 bytes / 37.4% unused; 156,012 / 44.3%; CSS 61,630 / 18.7%. They are labelled as that project's numbers.

Her request was "lets use our numbers… fix my numbers to be as real". Not done: no size breakdown or Coverage figures were written for the Sono Solar dashboard, because none were measured; its figures in the post remain the ones she gave (765 kB, a file of more than 500 kB, 65%, the LCP and request times).

Part 1, the bundle figures corrected by her, 2026-10-07:

> no, I had in sono solar 518kb js file. I split it into separate files of react, dayjs, recharts. Loaded only needed. So on fleet page, faq, admin I downloaded only 35% of prevous bundle

- The JavaScript file is **518 kB** everywhere in the post (was "more than 500 kB").
- The chart library is **Recharts** (settles Recharts vs Chart.js). The one bundle held React, Recharts, Day.js and Axios; the split made separate files for React, Day.js and Recharts. Day.js is back in the post, as a split-out file, not as a removed package.
- The **65%** now has a clear meaning: the fleet, FAQ and admin pages download 35% of the previous bundle. "About 180 kB" is calculated (518 × 0.35), not measured.
- **765 kB removed.** She gave it at the start of the session and confirmed it as "the bundle before"; it contradicts 518 kB, and the "about 268 kB" derived from it was Claude's calculation. Asked her what the 765 was. The CV's "initial JavaScript bundle by 65%" is unchanged.

Part 1, recall questions answered by her, 2026-10-07 (options chosen, except the last):

- **765 kB** = all files of the page together; back in the post next to the 518 kB JavaScript file.
- **Lighthouse desktop Performance score**: orange (50–89) before, green (90+) after. In the "In numbers" box as "from orange to green"; no exact scores known.
- **6.91 s → 1.17 s**: "there is in network number finish in so that was it", i.e. the Finish time in the Network tab, not the duration of one endpoint. The post now says so in the request section and in the results. **This differs from her CV**, which calls it "a production fleet-analytics endpoint from 6.91 s to 1.17 s"; raised with her, CV not changed.

Second round of recall questions, 2026-10-07 (options chosen): Finish was read from the bottom bar of the Network tab (time until the last request of the page is done); everything the page downloaded was under 300 kB after the changes (about 765 kB before); the dashboard was built with Vite; the size of the CSS file before the split she does not remember (part 2 gives none). The first three are in part 1.

2026-10-07, at her request ("remove fcp at all, fix my cv with correct number… more clear evidence of my expertice"):

- FCP removed from part 1 (the list of key numbers, its definition, the "Where to look" box). Four numbers remain: LCP, transferred files, load time, bundle size.
- CV rewritten in `docs/CV.md`, `src/content/resume.en.ts`, `src/content/resume.de.ts` (not the PDF), from the facts she confirmed today. "Frontend performance" now leads with "Initiated and led", names the tools and steps, and scopes the 65% to pages without charts. "API performance" became "Data loading": 6.91 s → 1.17 s is the Network "Finish" time, with the request split, server-side pagination and Zustand selectors as the cause. The old claim "profiling the full request path and identifying Node-side time-series processing as the main bottleneck" was dropped from the CV: she could not say what was changed there. Part 1 still has that sentence.
- Open: the CV's skills and "Dashboards and live map" bullet name **Chart.js**; part 1 names **Recharts**.

Part 1, leftovers from the review fixed at her request, 2026-10-07: the Node-side profiling sentence removed from the post (it had already left the CV); title now "A faster dashboard: packages, data and state" and the opening says "packages and data", since the data loading is a large part of the gain; she confirmed the JavaScript on the fleet, FAQ and admin pages was about 180 kB after the split ("yes, it was like that").

Part 2 (`one-css-file-for-everything`) rewritten from her own account of the CSS work, pasted 2026-10-07:

> I refactored our stylesheets to fix bundle bloat and improve maintainability.
>
> What was done:
>
> Replaced @import with @use: Migrated from Sass @import to @use / @forward. This eliminated global scope pollution, duplicate compilation of shared utilities (variables/mixins), and unwanted CSS output.
>
> Modularized to Page/Component Scope: Shifted from a single monolithic index.scss to CSS Modules bound directly to route components (.module.scss).
>
> Enabled Code Splitting: Since CSS imports are now co-located with lazy-loaded page routes, Webpack/Vite can split the styles into route-specific .css chunks instead of building one giant initial bundle.
>
> The codebase is much cleaner, and initial page load / bundle size is significantly reduced.

This fixes the weak point of the first version: the single CSS file came from the single `index.scss`, not from `@import` alone; `@import` added the global scope and the duplicate compilation. "Webpack/Vite" is written as Vite, the tool she confirmed for the dashboard. The `@forward` sentence in the box and the rule "Styles live next to the component that uses them" are Claude's wording.

CV, 2026-10-07, with her yes: the component-development bullet now reads "Migrated CSS to Sass, then from @import to @use/@forward and from one global index.scss to route-level CSS Modules, which let Vite split the CSS per route. Adopted a layer-based frontend architecture." (`docs/CV.md`, `resume.en.ts`, `resume.de.ts`; not the PDF). The performance bullet says "split the CSS per route".

Part 1, 2026-10-07, at her request: the "A real example" box (Coverage figures from her Solar Calculator) removed; "A big file that is fully used is fine. A big file that is mostly unused is carrying code for other pages." taken out of the list item and set in bold as its own paragraph.

Part 1, 2026-10-07: "So, is it big?" and "Opening the box" merged into one section at her request, under the heading "So, is it big?": Network tab → the two checks → the bold rule → "Which one was ours?" → the visualizer, the lab branch and the split. The separate section before "I felt quite safe" is gone. "Which one was ours?" is Claude's bridge.

Part 1, 2026-10-07: "So, is it big?" moved before "I felt quite safe" at her request.

Part 1, the caching paragraph replaced with her words, 2026-10-07:

> In the perfect world I would definately create dashboard with next.js due to its SSR feature or use TanStack, but it was a complex task that needed a lot of effort because of migration.

She asked for it instead of the Zustand-store sentence; Claude kept that fact as the end of the new paragraph ("So we saved the answers in the Zustand store instead…"), so the paragraph still says what was done.

Part 1, 2026-10-07, at her request ("remove this at all, mention zustand only where it is really needed"): the sentence about saving answers in the Zustand store removed, and with it the repeated "usual next step is to render on the server". Zustand is now named once in the text, where only the small `<p>` component updates.

Part 1, 2026-10-07: "Tiles first, numbers later" cut from four paragraphs to three at her request; the first two were merged, no fact dropped.

Part 1, 2026-10-07: "The whole menu, to taste the soup" cut from four paragraphs to three at her request (problem; fix; result). Dropped as repetition: the gloss "the moment the last request is done", "Then we did two things", and "Now the server sends only the rows the page shows".

Part 1, 2026-10-07: her "In a perfect world…" paragraph moved from "Tiles first, numbers later" to "What I learned", before the TanStack Query paragraph, at her request.

Part 1, new ending, 2026-10-07. She did not like the closing paragraph about TanStack Query in TaskPal: "I am a middle developer, I dont rely on tools rather then concepts and principles. Add some core principles reasoning from my experience. What I would tatoo ijn my head after this experience. Steps that I dop always from now on".

- The TanStack Query / TaskPal paragraph is removed. Her "What would I change if I could?" paragraph now opens "What I learned".
- A star box "What stays" with five principles, each tied to an event in the post. Her four rules are inside them, in her words: "Rely on numbers, not feelings", "not all images should be lazy", the browser-API / library rule, "pagination is key". The principle headings "Look inside before you fix", "A best practice is a guess until you measure it", "Pay only for what the page uses", "Never make everything wait for the slowest thing" are Claude's wording.
- A numbered list of five steps "I take every time now". **These are Claude's draft of her habits** (measure first, open the bundle, separate branch, measure again the same way, keep what the numbers confirm) and need her yes: steps 1–3 are what she did in the story; 4 and 5 are implied by it, not stated by her.

Part 1, 2026-10-07: the "Mobile is another story…" paragraph removed at her request. Mobile LCP 17.2 s → 8.9 s remains in the report section and in the results box, without comment.

Part 1, 2026-10-07: her "What would I change if I could?… Next.js… TanStack Query… migration" paragraph removed at her request; the next paragraph now starts "Tools change." Also in the "What stays" box: the repeated "felt safe" line removed and the example under "A best practice is a guess…" rewritten ("Everyone says images should be lazy. I made them lazy, and the page got slower.").

Part 1, 2026-10-07: the numbered "steps I take every time now" list removed at her request, as redundant after the "What stays" box. The post ends on that box.

Part 1 and CV, her list of fixes after the evaluation, 2026-10-07:

1. "I felt quite safe" moved back before "So, is it big?".
2. The visualizer sentence corrected: Vite gives the size warning, the visualizer shows what is inside.
3. The sentence comparing 2 weeks and 3 days ("with the help of AI") removed; the section is now "From orange to green". The first attempt ("It took 2 weeks, and it was not perfect") is still in the opening section.
4. Day.js removed from the post entirely.
5. Mobile performance removed from the post (the 17.2 s in the report section and the mobile line in the results). The general tip to run Lighthouse for mobile and desktop stays.
6. Orange to green: "the orange circle turned green" and "After months of looking at an orange circle, a green one is a small holiday" (Claude's wording), plus her team lead's words, as she gave them: "the dadhboard is so fast! kate did it. something like that". The post quotes "The dashboard is so fast! Kate did it."; it is her recollection of what was said.
7. Coverage is now a "Tip" box, not one of two checks.
8. CV: Chart.js → Recharts in Skills, in "Dashboards and live map" and in the performance bullet ("lazy-loaded Recharts"), in `docs/CV.md`, `resume.en.ts`, `resume.de.ts`. The CV still gives the mobile LCP.

Notebook layout, 2026-10-08. She wants part 1 to take 6–7 pages, not 10, by reducing spacing. Asked which changes were acceptable; she chose two of four: sub-headings on one ruled line (was two), and a box's label and title on one line (`Journal.module.css`, `Callout.tsx`, noted in `docs/DESIGN.md` §4.3b). Not chosen: paragraphs without a blank line, and smaller text and lines. Estimate for part 1: about 16 lines saved (10 headings, 6 titled boxes), well under one page of roughly 26 lines; not checked in a browser.

Part 1 shortened, 2026-10-08, with her yes to the proposed content cut: five boxes removed ("Where to look", "Code splitting with lazy and Suspense", "A bundle visualizer", "Why this helps", "What Axios weighs"). What mattered from them was folded into the text in a few words: where each number is read (in brackets in the list of numbers), what the visualizer draws, Axios's 51 kB and the "longer way to write `fetch`" line. Left out: the 27-package count and the explanations of lazy/Suspense and of loading data lower in the tree. Three boxes remain: the Coverage tip, "In numbers", "What stays". Estimated saving about 1.5 pages; not checked in a browser.

Notebook layout, 2026-10-08: the box label and title are back on two rows (her correction: "should be in 2 rows as in all posts"); the one-line sub-headings stay. `Callout.tsx`, `Journal.module.css`, `docs/DESIGN.md` §4.3b.

Part 2, 2026-10-08, at her request ("add in the end: how to check if a bundle big or not? - some hook in the end Check my posts.."): a closing hook after the "My rules now" box, pointing to part 1, where the 500 kB Vite warning and the Coverage tip are. Claude assumed part 2 (the post she had just been talking about) and part 1 as the target.

Part 2, 2026-10-08, at her request ("add also a thought block, that now pure css evolve so much and add features such as... so next time when staring app from scratch I would use pure css and avoid edding sass package it all"): a "A thought" box, "Next time: pure CSS", before the closing hook. The decision is hers. The list of features (native nesting, custom properties, container queries, `:has()`) is Claude's, the same four the older post `no-longer-a-junior` names; "and more" is left open. "One dependency less, and no @import or @use to get wrong" is Claude's wording.

2026-10-08, her two corrections:

- "I told to add space between title only to posts about css and images, for state keep minimal": the empty line under sub-headings is now a per-post property, `spacedHeadings: true`, set on `one-css-file-for-everything` and `not-every-image-should-be-lazy` only. The global margin added in `f5f5c74` is gone; everything else, including part 1 and the older posts, has one-line headings with no gap. (`journal.ts`, `JournalEntry.tsx`, `Journal.module.css`.)
- "reduce space between" the "have a look at" links: the links are 24px tall (new token `--a11y-min-target-compact`), chosen by her from three options, instead of 44px. This is below the 44px in DESIGN.md §5.3 and is noted there as her exception; 24px is the WCAG 2.2 AA minimum.

Part 1, 2026-10-08: the team lead's quote ("But my favourite result is not a number… The dashboard is so fast! Kate did it.") removed at her request, in both languages. "After months of looking at an orange circle, a green one is a small holiday." stays.

2026-10-08, her words "add small space between title to state post": `spacedHeadings` replaced by `headingGap`, `line` (CSS and image posts, as before) or `small` (the state post). A small gap that keeps the text on the ruling has to be whole lines, so `small` is a heading in two lines, with the air split above and below it; that costs one more line per heading than no gap, the same page cost as `line`.

2026-10-08, her report that in the "have a look at" list the arrow sits away from the title "Ein schnelleres Dashboard: nicht jedes Bild sollte lazy sein": the link is a flex box, so a title that wraps to two lines and its arrow were two flex items and the arrow was pushed to the side. Title and arrow are now inside one span (`JournalEntry.tsx`), so the arrow follows the last word.

Notebook on phones, 2026-10-08, her words "on mobile add hight to book and reduce font size for all posts": below 900px the notebook text is 13px (was 14px) on the same 20px ruling, the book is at least 80dvh tall, and the one-viewport body lock is lifted for the notebook only, so the page may scroll a little (`Resume.module.css`, `docs/DESIGN.md` §4.3b). Not checked on a device or in a browser; 80dvh and 13px are first guesses.

Notebook on phones, correction 2026-10-08, her words "screen should not scroll, book should take enough space till footer, but not cause scroll": the 80dvh minimum and the lifted one-viewport lock are removed again (`Resume.module.css`). Instead the footer's extra 40px of air above it on phones is dropped for the notebook only (`PageFooter` `compact`, used in `JournalView.tsx`), which gives the book about 28px (one ruled line) more. The 13px text stays. Not seen on a device.

Footer on phones, 2026-10-08, her words "reduce top pading for foter on mobile, make same as bottom pading": replaces the `compact` footer for the notebook only (removed again). The footer's extra `padding-top: 40px` below 800px is deleted for every page, so the air above the footer equals the air below it (`PageFooter.module.css`). This also tightens the other routes' footers on phones; the notebook is where it was meant to show.

Notebook on phones, 2026-10-08, her words "reduce Resume-module__VDSJBq__viewport padding for mobile": she chose top and right. Below 900px the notebook's text area has 20px of padding at the top and on the right (was 36px); left stays 36px for the coil and holes, bottom 36px for the page number. New variables `--pad-top` and `--pad-right` (fallback `--pad`, so the resume and handbook are unchanged); the ruling, the coil run and the column gap follow them (`Resume.module.css`). Not seen on a device.

Notebook on phones, 2026-10-08, her words "reduce title fintsize and hight" (taken as the post title, below 900px only): 20px on a one-line-per-row height (was 24–30px on two lines per row), so the title takes half the height and the text below stays on the ruling (`Journal.module.css`). Desktop unchanged. Not seen on a device.

Notebook on phones, 2026-10-08, her words "sections title oin pist also": below 900px the sub-headings in a post are 16px (was 20px) and `###` ones 14px (was 16px), still one ruled line per row. The extra room under them still comes from `headingGap`. Desktop unchanged. Not seen on a device.

Post header, 2026-10-08, her words "meine erfarung and date should be in 1 row and small space betwen it and title": below 900px the kind of post and the date no longer wrap (no wrapping, letter-spacing .04em instead of .16em); on every screen there is a 4px space between them and the title: the row is 16px high and the title has 4px of padding on top, which adds up to one ruled line, so the text below stays on the ruling (`Journal.module.css`). Risk: if the longest German date ("23. September 2026") does not fit a very narrow phone, the row is clipped, not wrapped. Not seen on a device.

Post header, 2026-10-08, her words "add space between title and tags, make tags amaller on mobile": the tags start 24px under the title (was 4px; one ruled line more, so the text below stays on the ruling) on every screen; below 900px the tags are 16px tall (was about 24px) with 2px 6px padding and 4px between rows, so each row is one ruled line. The tag text stays 11px, the floor in DESIGN.md §5.4. (`Journal.module.css`.) Not seen on a device.

2026-10-08, her words "1. fix cv with new data, 2. checked posts - good, 2. rename": part 1's slug renamed from `load-time-17-to-9-seconds` to `faster-dashboard-packages-data-and-state` (both `.mdx` files, `posts.json`, the link in part 2, and the earlier mentions in this file). The URL changes to `/journal/faster-dashboard-packages-data-and-state`; part 1 was never pushed. The CV now matches the posts: the mobile LCP (17.2 s to 8.9 s) is out of the performance bullet, as it is out of part 1 (`docs/CV.md`, `resume.en.ts`, `resume.de.ts`). Everything else in the bullets already matched the post. Not changed: `public/kateryna-skoryna-cv.pdf`.

Part 1, 2026-10-08, her words "I removed images from load, css, axios lib" (taken as the answer to what made the total fall from about 765 kB to under 300 kB): the "In numbers" line now says the total is JavaScript, CSS and images together, and a sentence after the box says the total fell because the images, the CSS of the other pages and Axios left the first load, linking parts 2 and 3. This settles that the total is not a JavaScript-only figure. Still unconfirmed: whether 518 kB is minified size and 765 kB transferred, the Lighthouse and Network tab conditions, what was lazy before, the chart on the first screen.

2026-10-08, her words "it is a post in blog, not a master work. Just add data to make a grate post for recruter and senior develipers": three small additions, all standard facts: the Sass `@import` deprecation date (Dart Sass 1.80, October 2024) in part 2; `fetchpriority="high"` and width/height for the main image in part 3; "no number could appear" in part 1 (the cards showed a skeleton). Not added: Recharts's own size (566 kB minified in today's version on Bundlephobia), because it is larger than the 518 kB file and would contradict the story. No further review questions.

Logic pass, 2026-10-08, her words "check to make it logical, bulletproof and convinced for senior". Edits only where a claim could be attacked, using what is already known:

- Part 1: 518 kB is "the size Vite reports"; the `React.lazy` line no longer contradicts "everything in one bundle" (it splits own components, not libraries in a shared file); "splitting moves weight to where it is needed"; the results box names its tool (Lighthouse for LCP, Network tab for Finish); one sentence says the changes were not measured one by one.
- Part 3: images in `public` are "a plain static file the browser can keep in its cache" (was "downloaded once, then from cache", which depends on cache headers); the main image should be a real `<img>`, since an image set in CSS is found later.
- Unchanged, because only she knows: whether 518 kB is minified size, the Lighthouse and Network tab settings, the 765 kB unit.

Part 1, 2026-10-08, at her request: the sentence "I did not measure each change on its own…" removed, in both languages.
