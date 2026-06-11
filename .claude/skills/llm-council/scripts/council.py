#!/usr/bin/env python3
"""LLM Council: 3-stage multi-model deliberation over OpenRouter.

Adapted from https://github.com/karpathy/llm-council (backend/council.py)
as a standalone, stdlib-only CLI.

Stage 1: all council models answer the question in parallel.
Stage 2: each model ranks the anonymized answers of the others.
Stage 3: the Chairman model synthesizes the final answer.
"""

import argparse
import json
import os
import re
import sys
import urllib.request
import urllib.error
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor

OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions"

DEFAULT_COUNCIL_MODELS = [
    "openai/gpt-5.1",
    "google/gemini-3-pro-preview",
    "anthropic/claude-sonnet-4.5",
    "x-ai/grok-4",
]
DEFAULT_CHAIRMAN_MODEL = "google/gemini-3-pro-preview"


def query_model(api_key, model, messages, timeout=120):
    """Query one model via OpenRouter. Returns content string or None on failure."""
    payload = json.dumps({"model": model, "messages": messages}).encode()
    req = urllib.request.Request(
        OPENROUTER_API_URL,
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            data = json.loads(resp.read())
        return data["choices"][0]["message"]["content"]
    except (urllib.error.URLError, KeyError, IndexError, json.JSONDecodeError, TimeoutError) as e:
        print(f"[warn] {model} failed: {e}", file=sys.stderr)
        return None


def query_models_parallel(api_key, models, messages):
    with ThreadPoolExecutor(max_workers=len(models)) as pool:
        futures = {m: pool.submit(query_model, api_key, m, messages) for m in models}
        return {m: f.result() for m, f in futures.items()}


def stage1_collect_responses(api_key, models, user_query):
    messages = [{"role": "user", "content": user_query}]
    responses = query_models_parallel(api_key, models, messages)
    return [
        {"model": m, "response": r}
        for m, r in responses.items()
        if r is not None
    ]


RANKING_PROMPT = """You are evaluating different responses to the following question:

Question: {user_query}

Here are the responses from different models (anonymized):

{responses_text}

Your task:
1. First, evaluate each response individually. For each response, explain what it does well and what it does poorly.
2. Then, at the very end of your response, provide a final ranking.

IMPORTANT: Your final ranking MUST be formatted EXACTLY as follows:
- Start with the line "FINAL RANKING:" (all caps, with colon)
- Then list the responses from best to worst as a numbered list
- Each line should be: number, period, space, then ONLY the response label (e.g., "1. Response A")
- Do not add any other text or explanations in the ranking section

Example of the correct format for your ENTIRE response:

Response A provides good detail on X but misses Y...
Response B is accurate but lacks depth on Z...
Response C offers the most comprehensive answer...

FINAL RANKING:
1. Response C
2. Response A
3. Response B

Now provide your evaluation and ranking:"""


def stage2_collect_rankings(api_key, models, user_query, stage1_results):
    labels = [chr(65 + i) for i in range(len(stage1_results))]
    label_to_model = {
        f"Response {label}": result["model"]
        for label, result in zip(labels, stage1_results)
    }
    responses_text = "\n\n".join(
        f"Response {label}:\n{result['response']}"
        for label, result in zip(labels, stage1_results)
    )
    prompt = RANKING_PROMPT.format(user_query=user_query, responses_text=responses_text)
    messages = [{"role": "user", "content": prompt}]
    responses = query_models_parallel(api_key, models, messages)
    stage2_results = [
        {"model": m, "ranking": r, "parsed_ranking": parse_ranking_from_text(r)}
        for m, r in responses.items()
        if r is not None
    ]
    return stage2_results, label_to_model


CHAIRMAN_PROMPT = """You are the Chairman of an LLM Council. Multiple AI models have provided responses to a user's question, and then ranked each other's responses.

Original Question: {user_query}

STAGE 1 - Individual Responses:
{stage1_text}

STAGE 2 - Peer Rankings:
{stage2_text}

Your task as Chairman is to synthesize all of this information into a single, comprehensive, accurate answer to the user's original question. Consider:
- The individual responses and their insights
- The peer rankings and what they reveal about response quality
- Any patterns of agreement or disagreement

Provide a clear, well-reasoned final answer that represents the council's collective wisdom:"""


def stage3_synthesize_final(api_key, chairman, user_query, stage1_results, stage2_results):
    stage1_text = "\n\n".join(
        f"Model: {r['model']}\nResponse: {r['response']}" for r in stage1_results
    )
    stage2_text = "\n\n".join(
        f"Model: {r['model']}\nRanking: {r['ranking']}" for r in stage2_results
    )
    prompt = CHAIRMAN_PROMPT.format(
        user_query=user_query, stage1_text=stage1_text, stage2_text=stage2_text
    )
    response = query_model(api_key, chairman, [{"role": "user", "content": prompt}])
    return {
        "model": chairman,
        "response": response or "Error: Unable to generate final synthesis.",
    }


def parse_ranking_from_text(ranking_text):
    if "FINAL RANKING:" in ranking_text:
        ranking_section = ranking_text.split("FINAL RANKING:")[1]
        numbered = re.findall(r"\d+\.\s*Response [A-Z]", ranking_section)
        if numbered:
            return [re.search(r"Response [A-Z]", m).group() for m in numbered]
        return re.findall(r"Response [A-Z]", ranking_section)
    return re.findall(r"Response [A-Z]", ranking_text)


def calculate_aggregate_rankings(stage2_results, label_to_model):
    model_positions = defaultdict(list)
    for ranking in stage2_results:
        for position, label in enumerate(ranking["parsed_ranking"], start=1):
            if label in label_to_model:
                model_positions[label_to_model[label]].append(position)
    aggregate = [
        {
            "model": model,
            "average_rank": round(sum(p) / len(p), 2),
            "rankings_count": len(p),
        }
        for model, p in model_positions.items()
        if p
    ]
    aggregate.sort(key=lambda x: x["average_rank"])
    return aggregate


def main():
    parser = argparse.ArgumentParser(description="Run the LLM Council on a question.")
    parser.add_argument("query", help="The question to ask the council")
    parser.add_argument("--models", nargs="+", default=DEFAULT_COUNCIL_MODELS,
                        help="OpenRouter model IDs for council members")
    parser.add_argument("--chairman", default=DEFAULT_CHAIRMAN_MODEL,
                        help="OpenRouter model ID for the Chairman")
    parser.add_argument("--json", action="store_true", help="Emit raw JSON")
    args = parser.parse_args()

    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        sys.exit("OPENROUTER_API_KEY is not set. Get a key at https://openrouter.ai")

    print(f"[stage 1] querying {len(args.models)} council models...", file=sys.stderr)
    stage1 = stage1_collect_responses(api_key, args.models, args.query)
    if not stage1:
        sys.exit("All council models failed to respond.")

    print("[stage 2] collecting peer rankings...", file=sys.stderr)
    stage2, label_to_model = stage2_collect_rankings(api_key, args.models, args.query, stage1)
    aggregate = calculate_aggregate_rankings(stage2, label_to_model)

    print(f"[stage 3] chairman ({args.chairman}) synthesizing...", file=sys.stderr)
    stage3 = stage3_synthesize_final(api_key, args.chairman, args.query, stage1, stage2)

    if args.json:
        print(json.dumps({
            "stage1": stage1,
            "stage2": stage2,
            "stage3": stage3,
            "label_to_model": label_to_model,
            "aggregate_rankings": aggregate,
        }, indent=2, ensure_ascii=False))
        return

    print(f"# LLM Council\n\n**Question:** {args.query}\n")
    print("## Final Answer (Chairman: {})\n".format(stage3["model"]))
    print(stage3["response"])
    print("\n## Aggregate Rankings (lower is better)\n")
    print("| Rank | Model | Avg. position | Votes |")
    print("|------|-------|---------------|-------|")
    for i, entry in enumerate(aggregate, start=1):
        print(f"| {i} | {entry['model']} | {entry['average_rank']} | {entry['rankings_count']} |")
    print("\n## Stage 1: Individual Responses\n")
    for r in stage1:
        print(f"### {r['model']}\n\n{r['response']}\n")
    print("## Stage 2: Peer Reviews\n")
    for r in stage2:
        print(f"### Review by {r['model']}\n\n{r['ranking']}\n")
    print("## Anonymization Key\n")
    for label, model in label_to_model.items():
        print(f"- {label}: {model}")


if __name__ == "__main__":
    main()
