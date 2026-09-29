import type { HandbookContent } from './handbook';

/**
 * English text of the Prompting Handbook, verbatim from the published `index.html`
 * (`data-en` attributes). Values are HTML — they carry `<b>`, `<em>`, `<code>` and
 * `<br/>` — and are rendered as-is; keys say where each one sits (`l2f` = leaf 2,
 * front face).
 */
export const handbookEn: HandbookContent = {
  l1f_kicker_1: 'Field Notes',
  l1f_h1_2: "The<br/>Developer's<br/>Prompting<br/>Handbook",
  l1f_sub_3: 'How I make LLM output predictable enough to put in production.',
  l1f_turnhint_4: 'Turn the page →',
  l1b_insideJoke_5:
    'I argued with an AI for an hour.<br/>Turns out we were both wrong, but it was more confident.',
  l1b_tiny_6: '— inside cover —',
  l2f_eyebrow_7: '<span class="num">01</span> Foundations <span class="rule"></span>',
  l2f_title_8: 'The anatomy of a good prompt',
  l2f_lead_9:
    "Before any of my own tricks, this is the foundation nearly every guide agrees on. A strong prompt is built from a few named parts. You don't need all of them — the <b>task</b> is the only non‑negotiable — but the more you make explicit, the less the model has to guess.",
  l2f_block_10:
    '<span class="k">Persona</span><span class="d">Tell it who to be. Sets vocabulary, depth, tone. <span class="aside">On frontier models this shifts tone &amp; format more than raw accuracy.</span></span>',
  l2f_block_11:
    '<span class="k req">Task</span><span class="d">The one thing it must do. The only required part.</span>',
  l2f_block_12:
    '<span class="k">Context</span><span class="d">Purpose, audience, constraints. Where most weak prompts fail.</span>',
  l2f_block_13:
    '<span class="k">Format</span><span class="d">Exactly how you want output: JSON, bullets, a table, a length.</span>',
  l2f_block_14:
    '<span class="k">Examples</span><span class="d">One or two input→output samples. Showing beats describing.</span>',
  l2f_block_15:
    '<span class="k">Reasoning</span><span class="d">For anything complex, ask it to think step by step <em>before</em> answering.</span>',
  l2f_tip_16:
    '<b>Ordering</b> — no single correct order, but put the context/data first and the instruction last, so the model acts after it has read everything.',
  l2f_head_17: '<span class="badge">✦</span><span>Worked example</span>',
  l2f_prow_18: '<b>Persona:</b> Senior full‑stack engineer (React + Express), performance‑focused.',
  l2f_prow_19:
    '<b>Context:</b> Page loads slowly — the index bundle got bloated with libs not needed on first paint.',
  l2f_prow_20:
    '<b>Task:</b> Refactor imports in <code>&lt;code&gt;</code> to trim the initial bundle (lazy‑load / code‑split), without changing public props.',
  l2f_prow_21:
    '<b>Format:</b> Return only corrected code in <code>&lt;answer&gt;</code>; one‑line comment noting what moved out.',
  l2b_eyebrow_22: '<span class="num">02</span> My rules <span class="rule"></span>',
  l2b_title_23: 'My rules — and the failures that taught them',
  l2b_lead_24:
    'The fundamentals get a decent prompt; these habits make output <b>reliable enough to build on</b>. My mindset: a prompt is production code — versioned, tested, revised against real failures.',
  l2b_colhead_25: '<span class="chip">What I do</span>',
  l2b_sg_26: 'Set it up right',
  l2b_li_27:
    '<b>Align on the task first.</b> I clarify until the model’s understanding matches mine.',
  l2b_li_28:
    '<b>Persist stable rules</b> in a system prompt / Gem / Project — and tell it who <em>you</em> are.',
  l2b_li_29:
    '<b>Reuse — build entities.</b> Gems ≈ Projects ≈ custom GPTs; a meta‑prompt drafts new ones.',
  l2b_sg_30: 'Be precise',
  l2b_li_31: '<b>Exact length</b> ("3 bullets, ≤12 words"), never "short".',
  l2b_li_32: "<b>Name things by name or number</b> — it doesn't see your screen.",
  l2b_li_33: '<b>Isolate inputs</b> — data ≠ commands.',
  l2b_sg_34: 'Work it like code',
  l2b_li_35: '<b>Temperature = variety</b>, not quality.',
  l2b_li_36: "<b>Fix the prompt &amp; regenerate</b> — don't argue with the output.",
  l2b_li_37: '<b>Small rule set</b>, no contradictions.',
  l2b_colhead_38: '<span class="chip b">Where I learned it</span>',
  l2b_fail_39:
    '<span class="arrow">→</span> Temp <code>1.2</code> invented a false fact → dropped to <code>0.9</code> <b>plus</b> an explicit <b>FACTUAL ACCURACY</b> rule. <span class="paren">(defense in depth)</span>',
  l2b_fail_40:
    '<span class="arrow">→</span> A free‑text field let users inject anything → a narrow <b>CONTENT MODERATION</b> override <b>plus</b> a permanent regression test.',
  l2b_fail_41:
    '<span class="arrow">→</span> "Advanced" meant nothing concrete → one example question per level. <span class="paren">(a one‑shot anchor beats an adjective)</span>',
  l2b_handnote_42:
    "None of these came from a guide. I read real output, traced each failure to a gap, closed it, and wrote a test so it stays closed. That's the whole skill.",
  l3f_eyebrow_43: '<span class="num">03</span> Modalities <span class="rule"></span>',
  l3f_title_44: 'The same thinking, across three kinds of output',
  l3f_lead_45:
    "Prompting isn't just chat. Here's where I apply all of this — and the one tip that matters most for each.",
  l3f_t_46: 'Code',
  l3f_line_47:
    '<span class="lbl">Use case:</span> Generating &amp; grading dev quizzes in quizdom — typed JSON (Zod‑validated) plus a second "judge" model that scores the first.',
  l3f_line_48:
    '<span class="lbl tip">Tip</span> Force <b>structured output against a schema</b>, so a mismatch is a caught error at the call site — not a crash three components downstream.',
  l3f_t_49: 'Presentations',
  l3f_line_50:
    '<span class="lbl">Use case:</span> Engineering design reviews and technical architecture explainers.',
  l3f_line_51:
    '<span class="lbl tip">Tip</span> <b>Make it interview me first</b> — end with "ask me any clarifying questions before you generate anything." Then outline‑first, one idea per slide, an exact count ("8 slides").',
  l3f_t_52: 'Infographics',
  l3f_line_53:
    '<span class="lbl">Use case:</span> Turning a spec or doc into a clean visual for non‑technical people.',
  l3f_line_54:
    '<span class="lbl tip">Tip</span> It\'s <b>source‑grounded</b> (clean sources in = good visual out) &amp; renders via Nano Banana Pro. Write the image prompt like a director\'s brief — purpose → subject → style → composition → lighting → palette → format — and say what you want, not what you don\'t ("an empty street," never "no cars").',
  l3b_eyebrow_55: '<span class="num">04</span> My Gems <span class="rule"></span>',
  l3b_title_56: 'The specialists I built once and reuse',
  l3b_gt_57: '<span class="dia"></span>Gem Architect',
  l3b_row_58:
    '<span class="k">Purpose —</span> writes first‑draft instructions for <em>other</em> Gems (meta‑prompting, no blank page).',
  l3b_row_59:
    '"You are a prompt engineer. When I describe an assistant, ask clarifying questions, then output a full Gem set: role, rules, tone, output format, two example interactions."',
  l3b_row_60:
    '<span class="k">Benefit —</span> "I want a Gem that does X" → ready‑to‑paste config in one step.',
  l3b_gt_61: '<span class="dia"></span>Personal Nutritionist',
  l3b_row_62:
    '<span class="k">Purpose —</span> personalized nutrition without restating my situation every time.',
  l3b_row_63:
    '"You are my nutritionist. My goal is to keep myself fit. Practical, specific suggestions; ask before assuming; realistic for a busy schedule."',
  l3b_row_64:
    '<span class="k">Benefit —</span> consistent, tailored answers — the context lives in the Gem.',
  l3b_gt_65: '<span class="dia"></span>Senior Full‑Stack Architect',
  l3b_row_66:
    '<span class="k">Purpose —</span> a sounding board for design decisions without re‑explaining my stack.',
  l3b_row_67:
    '"…ask clarifying questions first, then propose 2–3 approaches with tradeoffs before recommending one. Flag scaling risks &amp; over‑engineering. Stack: React/Next + Node.js."',
  l3b_row_68:
    '<span class="k">Benefit —</span> a second opinion that catches blind spots &amp; over‑engineering early.',
  l3b_pattern_69:
    '<b>The pattern:</b> role + rules + context + output format — drafted fast with the Architect, then refined as you use it.',
  l4f_eyebrow_70: '<span class="num">05</span> Cheat sheet <span class="rule"></span>',
  l4f_title_71: 'The whole handbook on one page',
  l4f_modelNote_72:
    '<b>Choose the model for the task.</b> I first decide whether I need a quick fix or a complex solution. Then I select the model accordingly: fast and lightweight for simple work, stronger reasoning for ambiguity, trade-offs, or multiple steps.',
  l4f_check_73:
    '<span class="box"></span><span>Covered the basics — <b>persona, task, context, format</b>?</span>',
  l4f_check_74:
    '<span class="box"></span><span>Gave <b>context and the why</b>, not just the task?</span>',
  l4f_check_75:
    '<span class="box"></span><span>Stable rules live in a <b>system prompt / Gem / Project</b>?</span>',
  l4f_check_76:
    '<span class="box"></span><span>Every length <b>an exact number</b>, never "short"?</span>',
  l4f_check_77:
    '<span class="box"></span><span>Pointed to things by <b>explicit name or number</b>?</span>',
  l4f_check_78:
    '<span class="box"></span><span>Untrusted data <b>isolated in its own tag</b>, marked data‑not‑commands?</span>',
  l4f_check_79:
    '<span class="box"></span><span><b>Temperature matched</b> to the task (hot = variety, cold = repeatable)?</span>',
  l4f_check_80:
    '<span class="box"></span><span>Output <b>schema‑validated</b> where it feeds code?</span>',
  l4f_check_81:
    '<span class="box"></span><span>When wrong, <b>editing the prompt &amp; regenerating</b> — not arguing?</span>',
  l4f_check_82:
    '<span class="box"></span><span>Each rule came from a <b>real failure</b> — and no rules contradict?</span>',
  l4f_closequote_83:
    '<span>"Every failure teaches me twice: I teach the model, and while teaching it, I teach myself. It’s a continuous loop — integrate, deliver, learn, repeat."</span>',
  l4b_insideJoke_84: 'I asked AI to write clean code.<br/>It gave me a blank file.',
  alt_gemArchitect: 'Gem Architect Gem portrait',
  alt_gemNutritionist: 'Personal Nutritionist Gem portrait',
  alt_gemFullstack: 'Senior Full-Stack Architect Gem portrait',
};
