import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/*
  Markdown — tiny dependency-free renderer for the blog's markdown content.
  Supports: #/##/###/#### headings, paragraphs, **bold**, *italic*, `inline code`,
  [links](), images ![](), ul/ol, blockquote, hr and pipe tables — RTL aware.
*/

const SITE_ORIGIN = "https://propfirmpayless.com";

function MdLink({ href, children }: { href: string; children: React.ReactNode }) {
  const cls =
    "font-semibold text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:text-secondary hover:decoration-secondary/50";
  if (href.startsWith(SITE_ORIGIN)) {
    const to = href.slice(SITE_ORIGIN.length) || "/";
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    );
  }
  if (href.startsWith("/")) {
    return (
      <Link to={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
      {children}
    </a>
  );
}

/* ------------------------- inline parsing ------------------------- */

const INLINE_PATTERNS: { type: "code" | "img" | "bold" | "link" | "em"; re: RegExp }[] = [
  { type: "code", re: /`([^`\n]+)`/ },
  { type: "img", re: /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/ },
  { type: "bold", re: /\*\*(.+?)\*\*/ },
  { type: "link", re: /\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/ },
  { type: "em", re: /\*([^*\n]+)\*/ },
];

export function parseInline(text: string): React.ReactNode {
  const nodes: React.ReactNode[] = [];
  let rest = text;
  let k = 0;

  while (rest.length) {
    let best: { idx: number; m: RegExpMatchArray; type: string } | null = null;
    for (const p of INLINE_PATTERNS) {
      const m = rest.match(p.re);
      if (m && m.index !== undefined && (best === null || m.index < best.idx)) {
        best = { idx: m.index, m, type: p.type };
      }
    }
    if (!best) {
      nodes.push(rest);
      break;
    }
    if (best.idx > 0) nodes.push(rest.slice(0, best.idx));
    const m = best.m;
    switch (best.type) {
      case "code":
        nodes.push(
          <code
            key={k++}
            dir="ltr"
            className="rounded-md border border-white/10 bg-white/[0.07] px-1.5 py-0.5 font-mono text-[0.88em] text-primary"
          >
            {m[1]}
          </code>
        );
        break;
      case "img":
        nodes.push(
          <img
            key={k++}
            src={m[2]}
            alt={m[1]}
            loading="lazy"
            className="my-7 w-full rounded-2xl border border-white/10"
          />
        );
        break;
      case "bold":
        nodes.push(
          <strong key={k++} className="font-bold text-foreground">
            {parseInline(m[1])}
          </strong>
        );
        break;
      case "link":
        nodes.push(
          <MdLink key={k++} href={m[2]}>
            {parseInline(m[1])}
          </MdLink>
        );
        break;
      case "em":
        nodes.push(<em key={k++}>{parseInline(m[1])}</em>);
        break;
    }
    rest = rest.slice(best.idx + m[0].length);
  }
  return nodes;
}

/* ------------------------- block helpers ------------------------- */

const HEADING_CLS: Record<number, string> = {
  1: "mt-12 mb-6 text-3xl font-black leading-snug text-gradient-ice md:text-4xl",
  2: "mt-12 mb-5 text-2xl font-extrabold leading-snug text-gradient-gold md:text-3xl",
  3: "mt-10 mb-4 text-xl font-bold leading-snug md:text-2xl",
  4: "mt-8 mb-3 text-lg font-bold leading-snug md:text-xl",
};

function MdHeading({ level, text }: { level: number; text: string }) {
  const Tag = (["h2", "h2", "h3", "h4"][level - 1] || "h4") as "h2" | "h3" | "h4";
  return <Tag className={HEADING_CLS[level]}>{parseInline(text)}</Tag>;
}

function MdTable({ rows }: { rows: string[] }) {
  const toCells = (r: string) =>
    r
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => c.trim());
  const all = rows.map(toCells);
  const isSep = (cells: string[]) => cells.length > 0 && cells.every((c) => /^:?-+:?$/.test(c));

  let header: string[] | null = null;
  let body = all.filter((cells) => !isSep(cells));
  if (all.length > 1 && isSep(all[1])) {
    header = all[0];
    body = all.slice(2).filter((cells) => !isSep(cells));
  }

  return (
    <div className="glass my-8 overflow-x-auto rounded-2xl">
      <table dir="rtl" className="w-full min-w-[560px] text-right text-sm md:text-base">
        {header && (
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.04]">
              {header.map((c, i) => (
                <th key={i} className="px-4 py-3.5 text-sm font-bold text-secondary">
                  {parseInline(c)}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {body.map((cells, ri) => (
            <tr
              key={ri}
              className={cn(
                "border-b border-white/5 transition-colors last:border-0 hover:bg-primary/[0.05]",
                ri % 2 === 1 && "bg-white/[0.02]"
              )}
            >
              {cells.map((c, ci) => (
                <td key={ci} className="px-4 py-3.5 align-top leading-7 text-foreground/85">
                  {parseInline(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------- block parsing ------------------------- */

function parseBlocks(md: string): React.ReactNode[] {
  const lines = md.split(/\r?\n/);
  const out: React.ReactNode[] = [];
  let para: string[] = [];
  let key = 0;

  const flushPara = () => {
    if (!para.length) return;
    out.push(
      <p key={key++} className="my-5 leading-8 text-foreground/85">
        {parseInline(para.join(" "))}
      </p>
    );
    para = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();

    if (!t) {
      flushPara();
      continue;
    }

    const h = t.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      flushPara();
      out.push(<MdHeading key={key++} level={h[1].length} text={h[2]} />);
      continue;
    }

    if (/^(?:-{3,}|\*{3,}|_{3,})$/.test(t)) {
      flushPara();
      out.push(<hr key={key++} className="beam-divider my-10 border-0" />);
      continue;
    }

    if (t.startsWith("|")) {
      flushPara();
      const tbl: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tbl.push(lines[i].trim());
        i++;
      }
      i--;
      out.push(<MdTable key={key++} rows={tbl} />);
      continue;
    }

    if (t.startsWith(">")) {
      flushPara();
      const quote: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        quote.push(lines[i].trim().replace(/^>\s?/, ""));
        i++;
      }
      i--;
      out.push(
        <blockquote
          key={key++}
          className="glass my-7 rounded-xl border-r-4 border-secondary/60 px-6 py-5"
        >
          {quote
            .filter((q) => q.length > 0)
            .map((q, qi) => (
              <p key={qi} className="leading-8 text-foreground/90">
                {parseInline(q)}
              </p>
            ))}
        </blockquote>
      );
      continue;
    }

    if (/^[-*]\s+/.test(t)) {
      flushPara();
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      i--;
      out.push(
        <ul key={key++} className="my-5 list-disc space-y-2.5 pr-6 marker:text-secondary">
          {items.map((it, ii) => (
            <li key={ii} className="leading-8 text-foreground/85">
              {parseInline(it)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    if (/^\d+[.)]\s+/.test(t)) {
      flushPara();
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+[.)]\s+/, ""));
        i++;
      }
      i--;
      out.push(
        <ol
          key={key++}
          className="my-5 list-decimal space-y-2.5 pr-6 marker:font-bold marker:text-secondary"
        >
          {items.map((it, ii) => (
            <li key={ii} className="leading-8 text-foreground/85">
              {parseInline(it)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    if (/^!\[[^\]]*\]\([^)]+\)$/.test(t)) {
      flushPara();
      out.push(<figure key={key++}>{parseInline(t)}</figure>);
      continue;
    }

    para.push(t);
  }
  flushPara();
  return out;
}

export default function Markdown({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const nodes = useMemo(() => parseBlocks(content), [content]);
  return <div className={cn("mx-auto max-w-3xl", className)}>{nodes}</div>;
}
