interface CallStackPanelProps {
  callStack: string[];
}

export const CallStackPanel = ({ callStack }: CallStackPanelProps) => {
  const stack = callStack.length > 0 ? callStack : ['(empty)'];

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-[var(--shadow)]">
      <h3 className="mb-3 text-sm font-semibold tracking-wide text-[var(--muted)] uppercase">Call Stack</h3>
      <div className="space-y-2">
        {[...stack].reverse().map((frame, index) => (
          <div
            key={`${frame}-${index}`}
            className={`rounded-lg border px-3 py-2 text-xs font-mono ${
              index === 0
                ? 'border-[var(--accent)] bg-[var(--accent-soft)]/15 text-[var(--text)]'
                : 'border-[var(--border)] bg-[var(--chip)] text-[var(--muted)]'
            }`}
          >
            {frame}
          </div>
        ))}
      </div>
    </section>
  );
};
