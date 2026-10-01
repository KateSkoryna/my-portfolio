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
| `draft`           | Optional. `true` hides the post everywhere without deleting it.         |
| `related`         | At least one: another post's `slug`, or `handbook`. Shown at the end of the post as "If you found this interesting, have a look at…". |
| `title`           | Page heading, index, browser tab, share.                                |
| `excerpt`         | One line for the menu and the page description.                         |
| `tags`            | At least one. Chips on the post; used to filter. Spell them the same.   |
| `de` block        | Optional. Without it the post shows in English in German too.           |

The build stops, with the file and post named, if a slug is repeated or badly
formed, a date is not `YYYY-MM-DD`, a title, excerpt, tag or `related` entry is missing, a `related` entry names a post that does not exist, or a listed
post has no `.mdx` file. A test also fails for a `.mdx` file that is not listed.

The text is Markdown. `##` becomes a sub-heading (the post title is the page's
`h1`); `<MarginNote>a short aside</MarginNote>` adds a margin note in Caveat.
`<Callout label="Good to know" title="…">` followed by the text (blank lines around it) adds a
lightbulb box; `icon="star"` gives the star used for "Fun facts". Pass the label in that
post's language.

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

Needs Kateryna: read and rewrite in her own voice; a source for the Japan example if she wants one; the German version (translation by Claude).

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
