import type { VariableValue } from '../types';

interface VariableInspectorProps {
  variables: Record<string, VariableValue>;
  previousVariables?: Record<string, VariableValue>;
  note?: string;
}

const renderValue = (value: VariableValue | undefined): string => {
  if (value === undefined) {
    return '—';
  }

  if (Array.isArray(value)) {
    return `[${value.join(', ')}]`;
  }

  if (value && typeof value === 'object') {
    return JSON.stringify(value);
  }

  return String(value);
};

const stableSerialize = (value: VariableValue | undefined): string => {
  if (value === undefined) {
    return '__undefined__';
  }

  if (value && typeof value === 'object' && !Array.isArray(value)) {
    const ordered = Object.entries(value).sort(([a], [b]) => a.localeCompare(b));
    return JSON.stringify(Object.fromEntries(ordered));
  }

  return JSON.stringify(value);
};

export const VariableInspector = ({ variables, previousVariables, note }: VariableInspectorProps) => {
  const keys = Array.from(new Set([...Object.keys(previousVariables ?? {}), ...Object.keys(variables)])).sort();

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-[var(--shadow)]">
      <h3 className="mb-3 text-sm font-semibold tracking-wide text-[var(--muted)] uppercase">Variables</h3>
      {note ? (
        <p className="mb-3 rounded-lg border border-[var(--accent-soft)] bg-[var(--accent-soft)]/10 px-3 py-2 text-xs text-[var(--text)]">
          {note}
        </p>
      ) : null}

      <div className="space-y-2">
        {keys.length > 0 ? (
          keys.map((key) => {
            const before = previousVariables?.[key];
            const after = variables[key];
            const beforeSerialized = stableSerialize(before);
            const afterSerialized = stableSerialize(after);

            const status =
              before === undefined && after !== undefined
                ? 'added'
                : before !== undefined && after === undefined
                  ? 'removed'
                  : beforeSerialized !== afterSerialized
                    ? 'changed'
                    : 'steady';

            const statusStyle =
              status === 'changed'
                ? 'bg-amber-400/10 border-amber-400/30 text-amber-300'
                : status === 'added'
                  ? 'bg-emerald-400/10 border-emerald-400/30 text-emerald-300'
                  : status === 'removed'
                    ? 'bg-rose-400/10 border-rose-400/30 text-rose-300'
                    : 'bg-[var(--chip)] border-[var(--border)] text-[var(--muted)]';

            return (
              <div key={key} className={`rounded-lg border px-3 py-2 text-xs ${statusStyle}`}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="font-semibold text-[var(--accent)]">{key}</span>
                  <span className="rounded-full border border-current/40 px-2 py-0.5 text-[10px] uppercase">{status}</span>
                </div>
                <div className="grid gap-1 text-[var(--text)]">
                  <div className="grid grid-cols-[3.5rem_1fr] gap-2">
                    <span className="text-[var(--muted)]">Before</span>
                    <span className="break-all font-mono">{renderValue(before)}</span>
                  </div>
                  <div className="grid grid-cols-[3.5rem_1fr] gap-2">
                    <span className="text-[var(--muted)]">After</span>
                    <span className="break-all font-mono">{renderValue(after)}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-xs text-[var(--muted)]">No tracked variables for this step.</p>
        )}
      </div>
    </section>
  );
};
