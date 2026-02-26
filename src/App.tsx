import { useEffect, useMemo, useState } from 'react';
import SplashScreen from './components/SplashScreen';
import { buildAlgorithmSteps, getAlgorithmById, algorithmCatalog } from './algorithms';
import { AlgorithmGallery } from './components/AlgorithmGallery';
import { CallStackPanel } from './components/CallStackPanel';
import { CanvasStage } from './components/CanvasStage';
import { CodePanel } from './components/CodePanel';
import { Controls } from './components/Controls';
import { VariableInspector } from './components/VariableInspector';
import { usePlayback } from './hooks/usePlayback';
import type { ThemeMode } from './types';

const defaultAlgorithmId = 'quick-sort';

const resolveInitialTheme = (): ThemeMode => {
  const saved = localStorage.getItem('code-cinema-theme');
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

function App() {
  const [selectedId, setSelectedId] = useState(defaultAlgorithmId);
  const [theme, setTheme] = useState<ThemeMode>(() => resolveInitialTheme());

  const selectedAlgorithm = useMemo(() => getAlgorithmById(selectedId), [selectedId]);
  const steps = useMemo(() => buildAlgorithmSteps(selectedAlgorithm), [selectedAlgorithm]);

  const playback = usePlayback(steps.length);
  const currentStep = steps[playback.index] ?? steps[0];
  const previousStep = playback.index > 0 ? steps[playback.index - 1] : undefined;

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('code-cinema-theme', theme);
  }, [theme]);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable = target
        ? target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
        : false;

      if (isEditable) {
        return;
      }

      if (event.code === 'Space') {
        event.preventDefault();
        playback.toggle();
        return;
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        playback.stepForward();
        return;
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        playback.stepBack();
        return;
      }

      if (event.key === 'Home') {
        event.preventDefault();
        playback.reset();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [playback.reset, playback.stepBack, playback.stepForward, playback.toggle]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  };

  return (
    <SplashScreen>
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--bg-header)]/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-300 bg-clip-text text-xl font-black tracking-tight text-transparent sm:text-2xl">
              Code Cinema
            </h1>
            <p className="text-xs text-[var(--muted)] sm:text-sm">
              Interactive algorithm visualizations with step-time control and state introspection.
            </p>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-lg border border-[var(--border)] bg-[var(--panel)] px-3 py-2 text-xs font-semibold text-[var(--text)]"
          >
            {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}
          </button>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-[1500px] gap-4 px-4 py-4 sm:px-6 lg:grid-cols-[340px_1fr] lg:px-8 lg:py-6">
        <AlgorithmGallery
          algorithms={algorithmCatalog}
          selectedId={selectedAlgorithm.id}
          onSelect={(id) => setSelectedId(id)}
        />

        <section className="space-y-4">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-[var(--shadow)]">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold sm:text-xl">{selectedAlgorithm.name}</h2>
                <p className="mt-1 max-w-3xl text-sm text-[var(--muted)]">{selectedAlgorithm.summary}</p>
              </div>
              <div className="rounded-full bg-[var(--chip)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                {selectedAlgorithm.group}
              </div>
            </div>
          </div>

          {currentStep ? <CanvasStage step={currentStep} speed={playback.speed} theme={theme} /> : null}

          <Controls playback={playback} totalSteps={steps.length} />

          {currentStep ? (
            <div className="grid gap-4 lg:grid-cols-3">
              <VariableInspector
                variables={currentStep.variables}
                previousVariables={previousStep?.variables}
                note={currentStep.note}
              />
              <CallStackPanel callStack={currentStep.callStack} />
              <CodePanel source={selectedAlgorithm.source} activeLine={currentStep.line} />
            </div>
          ) : null}
        </section>
      </main>
    </div>
    </SplashScreen>
  );
}

export default App;
