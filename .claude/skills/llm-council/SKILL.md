---
name: llm-council
description: Consult an "LLM Council" — send a question to multiple LLMs via OpenRouter, have them anonymously rank each other's answers, and synthesize a final answer with a Chairman model. Use when the user wants multiple model opinions, a model comparison on a question, or explicitly asks for the LLM council. Based on karpathy/llm-council.
---

# LLM Council

Instead of asking a single LLM, the question is sent to a council of models which then
review and rank each other's (anonymized) answers, and a Chairman model produces the
final synthesized response.

The three stages (from karpathy/llm-council):

1. **First opinions** — the user query is sent to all council models in parallel.
2. **Review** — each model receives the other models' answers, anonymized as
   "Response A/B/C...", and ranks them by accuracy and insight.
3. **Final response** — the Chairman model synthesizes everything into one answer.

## Requirements

- `OPENROUTER_API_KEY` must be set in the environment (get one at https://openrouter.ai).
  If it is missing, tell the user to set it and stop.
- Network access to `openrouter.ai`.

## How to run

Run the bundled script with the user's question as the argument:

```bash
python3 .claude/skills/llm-council/scripts/council.py "QUESTION HERE"
```

Options:

- `--models openai/gpt-5.1 anthropic/claude-sonnet-4.5 ...` — override council members
  (any OpenRouter model IDs). Defaults: `openai/gpt-5.1`, `google/gemini-3-pro-preview`,
  `anthropic/claude-sonnet-4.5`, `x-ai/grok-4`.
- `--chairman google/gemini-3-pro-preview` — override the Chairman model.
- `--json` — emit raw JSON of all stages instead of markdown.

The script prints a markdown report: each model's individual answer, each model's
ranking of the anonymized answers, the aggregate ranking table, and the Chairman's
final synthesized answer.

## Presenting results

- Lead with the Chairman's final answer — that is the deliverable.
- Then show the aggregate ranking (which model's answer the council rated best).
- Offer the individual responses/rankings as detail; don't paste all of them unless
  the user asked to compare models side by side.
- If some models fail (e.g. not available on the user's OpenRouter plan), report which
  failed and continue with the rest — the script already does this.
