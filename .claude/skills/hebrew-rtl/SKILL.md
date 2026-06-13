---
name: hebrew-rtl
description: >-
  Format Hebrew (or Hebrew-dominant) replies as right-to-left (RTL) and aligned
  to the right edge, while keeping English, numbers, URLs, file paths, and code
  left-to-right (LTR) — including mixed Hebrew/English text. Use whenever the
  user writes in Hebrew, asks for Hebrew output, or asks for RTL / right-aligned
  ("מוצמד לימין") text.
---

# Hebrew RTL formatting / עברית מימין לשמאל

מטרת הסקיל: כל תשובה שהיא בעיקר בעברית תוצג כ‑RTL ומיושרת לימין. אנגלית, מספרים,
קוד, קישורים ונתיבים נשארים LTR — גם כשהם משולבים בתוך משפט בעברית.

## When to apply

- Apply whenever your reply is **mostly Hebrew**, or the user is conversing in Hebrew.
- If the reply is **entirely English**, or it is only code / shell commands, do nothing — leave it LTR.
- **Mixed** reply: apply RTL to the Hebrew prose and keep the LTR runs (English words, numbers, URLs, paths, identifiers, code) flowing in the correct place inside it.

## Core techniques — use them together

### 1. Right-align with a direction wrapper (strong; for HTML-aware renderers)

Wrap the Hebrew content in an RTL container so the whole block aligns to the right edge:

```
<div dir="rtl">

טקסט בעברית כאן. שורות, רשימות, כותרות וטבלאות — הכול מיושר לימין.

</div>
```

- Keep a **blank line** right after `<div dir="rtl">` and right before `</div>`, otherwise the Markdown inside (lists, bold, links, tables) may not render.
- This produces right-alignment ("מוצמד לימין") **only in renderers that honor raw HTML**: GitHub, IDE Markdown previews, and a browser — i.e. in **files / artifacts you generate** (such as `index.html`).
- **Important — chat UI:** the Claude Code **web chat strips `dir` / `align` and lays every message out LTR** (verified). So this wrapper does **not** right-align chat replies there, and neither do Unicode marks. Block alignment in chat is set by the app's CSS and **cannot** be forced from message content. Use this wrapper for generated files, not to "fix" chat alignment.
- Do **not** wrap fenced code blocks inside the RTL div — keep them outside it (see below).

### 2. RTL reading order with Unicode marks (lightweight, invisible, always safe)

For short inline messages where you are not using a `<div>`, make sure each Hebrew line is *classified* as RTL so it reads and aligns correctly under a `dir="auto"` renderer:

- A line that already **starts with a Hebrew letter** is RTL automatically — nothing to do.
- If a line starts with a neutral or LTR character (a digit, `(`, a quote, an English word), insert a **Right-to-Left Mark** `U+200F` (RLM, the `‏` character) **after** any Markdown marker and **before** the text:
  - heading: `### ‏כותרת`
  - list item: `- ‏פריט ראשון`
  - quote: `> ‏ציטוט בעברית`
- **Never** place the RLM *before* a Markdown marker (`-`, `*`, `#`, `>`, `1.`) — that stops the line from being parsed as a heading/list/quote.

### 3. Isolate embedded LTR runs (mixed content)

Inside a Hebrew sentence, English words / numbers / code / URLs / paths usually flow correctly on their own via the Unicode BiDi algorithm. When an LTR run sits next to punctuation and lands in the wrong place, isolate it:

- Markdown / HTML renderer: `<span dir="ltr">value</span>`
- Plain text: wrap the run with **LRI … PDI**, `U+2066` … `U+2069`. Inline code with backticks also reads LTR, so `` `index.html` `` is an easy fix.
- Example: `הקובץ <span dir="ltr">index.html</span> נמצא בשורש הפרויקט.`

## Must stay LTR

- **Fenced code blocks** and their contents — place them *outside* the RTL `<div>`. Code is always left-to-right.
- **Inline code**, URLs, file paths, shell commands, package / variable / function names.
- For a **Hebrew table**, put the whole table inside a `<div dir="rtl">` so the columns order right-to-left; a code/English table stays LTR.

## Checklist before sending a Hebrew reply

1. Mostly Hebrew? → wrap the prose in `<div dir="rtl"> … </div>` (blank lines inside).
2. Any line starting with a non-Hebrew character? → add `‏` (RLM `U+200F`) **after** the Markdown marker.
3. Code blocks / shell commands → keep them **outside** the RTL wrapper.
4. Inline English / numbers reading out of order → isolate with `<span dir="ltr">…</span>` or backticks.
5. Pure-English or code-only reply → leave it LTR, do nothing.

## Note on the viewing client (read this)

Block **alignment** (snapping to the right edge) is decided by the app that renders
the Markdown — **not** by the text content. What a skill can and cannot do:

- **Generated files / artifacts** (`.html`, `.md` for GitHub, IDE previews, anything
  opened in a browser): `dir="rtl"` **is** honored → real right-alignment. ✅
- **Claude Code web chat**: strips `dir` / `align` and lays every message out LTR
  (verified by testing). No content-level trick — HTML wrapper, `align`, RLM, BiDi
  embedding — can right-align a chat reply there. ❌ The only ways to right-align the
  chat itself are app-level: a built-in RTL option in the app (if/when one exists),
  or browser CSS injected by the user. A ready userstyle for this lives at
  `claude-chat-rtl.user.css` in the repo root (install via the Stylus extension); it
  uses `unicode-bidi: plaintext` so each paragraph auto-picks its direction.
- **What the skill still does in chat:** keep correct RTL **reading order** and handle
  **mixed** Hebrew/English/number/code runs so nothing renders scrambled.

So: use technique 1 for files; rely on techniques 2–3 for clean mixed text in chat;
do not promise visual right-alignment of chat replies.
