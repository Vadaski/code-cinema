import { Fragment } from 'react';

interface CodePanelProps {
  source: string[];
  activeLine: number;
}

const keywordSet = new Set([
  'function',
  'const',
  'let',
  'var',
  'if',
  'else',
  'for',
  'while',
  'return',
  'new',
  'true',
  'false',
  'null',
  'undefined',
  'yield',
  'break',
  'continue',
]);

type TokenKind = 'comment' | 'string' | 'number' | 'keyword' | 'function' | 'plain';

interface Token {
  text: string;
  kind: TokenKind;
}

const tokenPattern =
  /\/\/.*$|"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|`(?:\\.|[^`])*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][A-Za-z0-9_$]*\b|[^\sA-Za-z0-9_$]+|\s+/g;

const tokenizeLine = (line: string): Token[] => {
  const parts = line.match(tokenPattern) ?? [line];
  return parts.map((part) => {
    if (part.startsWith('//')) {
      return { text: part, kind: 'comment' as const };
    }
    if (
      (part.startsWith('"') && part.endsWith('"')) ||
      (part.startsWith("'") && part.endsWith("'")) ||
      (part.startsWith('`') && part.endsWith('`'))
    ) {
      return { text: part, kind: 'string' as const };
    }
    if (/^\d/.test(part)) {
      return { text: part, kind: 'number' as const };
    }
    if (keywordSet.has(part)) {
      return { text: part, kind: 'keyword' as const };
    }
    if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(part)) {
      return { text: part, kind: 'function' as const };
    }
    return { text: part, kind: 'plain' as const };
  });
};

const tokenColor = (kind: TokenKind): string => {
  switch (kind) {
    case 'comment':
      return 'text-slate-400';
    case 'string':
      return 'text-emerald-300';
    case 'number':
      return 'text-amber-300';
    case 'keyword':
      return 'text-sky-300 font-semibold';
    case 'function':
      return 'text-cyan-200';
    default:
      return 'text-slate-200';
  }
};

export const CodePanel = ({ source, activeLine }: CodePanelProps) => {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-[var(--shadow)]">
      <h3 className="mb-3 text-sm font-semibold tracking-wide text-[var(--muted)] uppercase">Source</h3>
      <div className="max-h-[32vh] overflow-auto rounded-xl border border-[var(--border)] bg-[#0b1220] p-2">
        {source.map((line, index) => {
          const lineNumber = index + 1;
          const isActive = lineNumber === activeLine;
          const tokens = tokenizeLine(line);

          return (
            <div
              key={`${lineNumber}-${line}`}
              className={`grid grid-cols-[0.35rem_2.3rem_1fr] items-start gap-2 rounded-md px-2 py-1 text-xs font-['JetBrains_Mono',ui-monospace,monospace] ${
                isActive ? 'bg-cyan-300/10 text-slate-100' : 'text-slate-300'
              }`}
            >
              <span className={`mt-[2px] h-[1.1rem] rounded-full ${isActive ? 'bg-cyan-300' : 'bg-transparent'}`} />
              <span className={`text-right ${isActive ? 'text-cyan-200' : 'text-slate-500'}`}>{lineNumber}</span>
              <span className="whitespace-pre">
                {tokens.map((token, tokenIndex) => (
                  <Fragment key={`${lineNumber}-${tokenIndex}`}>
                    <span className={tokenColor(token.kind)}>{token.text}</span>
                  </Fragment>
                ))}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
