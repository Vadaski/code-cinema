import type { PlaybackControls } from '../hooks/usePlayback';

interface ControlsProps {
  playback: PlaybackControls;
  totalSteps: number;
}

const fmtSpeed = (speed: number): string => `${speed.toFixed(2).replace(/\.00$/, '')}x`;

export const Controls = ({ playback, totalSteps }: ControlsProps) => {
  const progress = totalSteps > 1 ? playback.index / (totalSteps - 1) : 0;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-[var(--shadow)]">
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={playback.stepBack}
          disabled={!playback.canStepBack}
          className="touch-manipulation rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] px-3 py-2 text-sm text-[var(--text)] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          ◀ Step
        </button>

        <button
          type="button"
          onClick={playback.toggle}
          className="touch-manipulation rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow transition hover:brightness-110 active:scale-[0.98]"
        >
          {playback.isPlaying ? 'Pause' : 'Play'}
        </button>

        <button
          type="button"
          onClick={playback.stepForward}
          disabled={!playback.canStepForward}
          className="touch-manipulation rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] px-3 py-2 text-sm text-[var(--text)] transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Step ▶
        </button>

        <button
          type="button"
          onClick={playback.reset}
          className="touch-manipulation rounded-lg border border-[var(--border)] bg-[var(--panel-strong)] px-3 py-2 text-sm text-[var(--text)] transition active:scale-[0.98]"
        >
          Reset
        </button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <div className="mb-1 flex items-center justify-between text-xs text-[var(--muted)]">
            <span>
              Step {playback.index + 1} / {Math.max(totalSteps, 1)}
            </span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={Math.max(totalSteps - 1, 0)}
            value={playback.index}
            onChange={(event) => playback.seek(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[var(--chip)] accent-[var(--accent)] touch-manipulation"
          />
        </div>

        <div className="min-w-44">
          <div className="mb-1 flex items-center justify-between text-xs text-[var(--muted)]">
            <span>Speed</span>
            <span className="font-semibold text-[var(--text)]">{fmtSpeed(playback.speed)}</span>
          </div>
          <input
            type="range"
            min={0.25}
            max={4}
            step={0.25}
            value={playback.speed}
            onChange={(event) => playback.setSpeed(Number(event.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-[var(--chip)] accent-[var(--accent)] touch-manipulation"
          />
        </div>
      </div>

      <p className="mt-3 text-xs text-[var(--muted)]">Shortcuts: Space play/pause, ←/→ step, Home reset.</p>
    </section>
  );
};
