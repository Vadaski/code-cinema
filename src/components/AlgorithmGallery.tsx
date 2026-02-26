import type { AlgorithmDefinition } from '../types';

interface AlgorithmGalleryProps {
  algorithms: AlgorithmDefinition[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const makeSeed = (id: string): number => {
  let value = 0;
  for (let i = 0; i < id.length; i += 1) {
    value = (value * 33 + id.charCodeAt(i)) >>> 0;
  }
  return value;
};

const SortingPreview = ({ id }: { id: string }) => {
  const seed = makeSeed(id);
  const gradientId = `sortingBg-${id}`;
  const bars = Array.from({ length: 12 }, (_, index) => 18 + ((seed + index * 37) % 42));
  return (
    <svg viewBox="0 0 240 96" className="h-full w-full">
      <rect x="0" y="0" width="240" height="96" fill={`url(#${gradientId})`} />
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>
      {bars.map((height, index) => {
        const x = 14 + index * 18;
        const y = 86 - height;
        const fill =
          index >= bars.length - 3 ? '#22c55e' : index === 4 || index === 5 ? '#ef4444' : index === 2 ? '#facc15' : '#38bdf8';
        return <rect key={index} x={x} y={y} width="12" height={height} rx="3" fill={fill} opacity="0.95" />;
      })}
    </svg>
  );
};

const GraphPreview = () => {
  const points: Record<string, [number, number]> = {
    A: [34, 24],
    B: [80, 14],
    C: [126, 24],
    D: [56, 66],
    E: [110, 66],
    F: [166, 54],
    G: [194, 28],
  };
  const edges: [string, string][] = [
    ['A', 'B'],
    ['A', 'D'],
    ['B', 'C'],
    ['B', 'E'],
    ['C', 'F'],
    ['C', 'G'],
    ['D', 'E'],
    ['E', 'F'],
  ];
  return (
    <svg viewBox="0 0 240 96" className="h-full w-full">
      <rect x="0" y="0" width="240" height="96" fill="#0b1220" />
      {edges.map(([from, to], index) => (
        <line
          key={`${from}-${to}`}
          x1={points[from][0]}
          y1={points[from][1]}
          x2={points[to][0]}
          y2={points[to][1]}
          stroke={index === 1 || index === 6 ? '#facc15' : '#334155'}
          strokeWidth={index === 1 || index === 6 ? 2.4 : 1.8}
        />
      ))}
      {Object.entries(points).map(([id, [x, y]], index) => (
        <g key={id}>
          <circle cx={x} cy={y} r="9" fill={index < 3 ? '#22c55e' : '#1d4ed8'} />
          <text x={x} y={y + 3} textAnchor="middle" fontSize="8" fill="white" fontWeight="700">
            {id}
          </text>
        </g>
      ))}
    </svg>
  );
};

const SearchPreview = () => {
  return (
    <svg viewBox="0 0 240 96" className="h-full w-full">
      <rect x="0" y="0" width="240" height="96" fill="#101a2f" />
      {Array.from({ length: 9 }, (_, index) => {
        const x = 14 + index * 24;
        return (
          <g key={index}>
            <rect x={x} y="34" width="20" height="28" rx="6" fill={index === 4 ? '#facc15' : '#1e40af'} />
            <text x={x + 10} y="52" textAnchor="middle" fontSize="9" fill="white" fontWeight="700">
              {index * 2 + 4}
            </text>
          </g>
        );
      })}
      <path d="M118 22 L118 30" stroke="#facc15" strokeWidth="2" />
      <circle cx="118" cy="20" r="4" fill="#facc15" />
    </svg>
  );
};

const DataStructurePreview = ({ id }: { id: string }) => {
  if (id.includes('tree') || id.includes('trie')) {
    return (
      <svg viewBox="0 0 240 96" className="h-full w-full">
        <rect x="0" y="0" width="240" height="96" fill="#0b1220" />
        <line x1="120" y1="20" x2="76" y2="48" stroke="#334155" strokeWidth="2" />
        <line x1="120" y1="20" x2="164" y2="48" stroke="#334155" strokeWidth="2" />
        <line x1="76" y1="48" x2="52" y2="74" stroke="#334155" strokeWidth="2" />
        <line x1="76" y1="48" x2="98" y2="74" stroke="#334155" strokeWidth="2" />
        <line x1="164" y1="48" x2="142" y2="74" stroke="#334155" strokeWidth="2" />
        <line x1="164" y1="48" x2="188" y2="74" stroke="#334155" strokeWidth="2" />
        {[['120', '20'], ['76', '48'], ['164', '48'], ['52', '74'], ['98', '74'], ['142', '74'], ['188', '74']].map(
          ([x, y], index) => (
            <circle key={index} cx={x} cy={y} r="8" fill={index % 2 === 0 ? '#22c55e' : '#1d4ed8'} />
          ),
        )}
      </svg>
    );
  }

  if (id.includes('hash')) {
    return (
      <svg viewBox="0 0 240 96" className="h-full w-full">
        <rect x="0" y="0" width="240" height="96" fill="#101a2f" />
        {Array.from({ length: 4 }, (_, index) => (
          <g key={index}>
            <rect x="14" y={14 + index * 20} width="24" height="14" rx="4" fill={index === 1 ? '#facc15' : '#1e40af'} />
            <rect x="44" y={14 + index * 20} width="182" height="14" rx="4" fill="#1e293b" />
          </g>
        ))}
      </svg>
    );
  }

  if (id.includes('linked-list')) {
    return (
      <svg viewBox="0 0 240 96" className="h-full w-full">
        <rect x="0" y="0" width="240" height="96" fill="#0b1220" />
        {Array.from({ length: 4 }, (_, index) => {
          const x = 16 + index * 54;
          return (
            <g key={index}>
              <rect x={x} y="34" width="36" height="24" rx="6" fill={index === 2 ? '#facc15' : '#1d4ed8'} />
              {index < 3 ? <path d={`M${x + 38} 46 L${x + 50} 46`} stroke="#64748b" strokeWidth="2" /> : null}
            </g>
          );
        })}
      </svg>
    );
  }

  if (id.includes('stack')) {
    return (
      <svg viewBox="0 0 240 96" className="h-full w-full">
        <rect x="0" y="0" width="240" height="96" fill="#101a2f" />
        {[0, 1, 2, 3].map((level) => (
          <rect
            key={level}
            x="86"
            y={68 - level * 14}
            width="68"
            height="12"
            rx="4"
            fill={level === 3 ? '#facc15' : '#1d4ed8'}
          />
        ))}
      </svg>
    );
  }

  if (id.includes('queue')) {
    return (
      <svg viewBox="0 0 240 96" className="h-full w-full">
        <rect x="0" y="0" width="240" height="96" fill="#0b1220" />
        {Array.from({ length: 5 }, (_, index) => (
          <rect key={index} x={24 + index * 40} y="36" width="30" height="22" rx="6" fill={index === 0 ? '#facc15' : '#1d4ed8'} />
        ))}
        <text x="24" y="30" fill="#94a3b8" fontSize="8">
          front
        </text>
      </svg>
    );
  }

  if (id.includes('union-find')) {
    return (
      <svg viewBox="0 0 240 96" className="h-full w-full">
        <rect x="0" y="0" width="240" height="96" fill="#101a2f" />
        {Array.from({ length: 6 }, (_, index) => (
          <g key={index}>
            <rect x={18 + index * 36} y="22" width="26" height="14" rx="4" fill="#1e40af" />
            <rect x={18 + index * 36} y="44" width="26" height="14" rx="4" fill={index % 2 === 0 ? '#22c55e' : '#facc15'} />
          </g>
        ))}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 240 96" className="h-full w-full">
      <rect x="0" y="0" width="240" height="96" fill="#0b1220" />
      <circle cx="120" cy="48" r="18" fill="#1d4ed8" />
      <circle cx="120" cy="48" r="8" fill="#facc15" />
    </svg>
  );
};

const ThumbnailPreview = ({ algorithm }: { algorithm: AlgorithmDefinition }) => {
  if (algorithm.group === 'Sorting') {
    return <SortingPreview id={algorithm.id} />;
  }
  if (algorithm.group === 'Graph') {
    return <GraphPreview />;
  }
  if (algorithm.group === 'Search') {
    return <SearchPreview />;
  }
  return <DataStructurePreview id={algorithm.id} />;
};

export const AlgorithmGallery = ({ algorithms, selectedId, onSelect }: AlgorithmGalleryProps) => {
  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4 shadow-[var(--shadow)]">
      <div className="mb-3 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-[var(--muted)] uppercase">Algorithm Gallery</h2>
        <span className="rounded-full bg-[var(--chip)] px-2 py-1 text-xs font-medium text-[var(--muted)]">
          {algorithms.length} presets
        </span>
      </div>

      <div className="grid max-h-[58vh] grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-1">
        {algorithms.map((algorithm) => {
          const active = selectedId === algorithm.id;

          return (
            <button
              key={algorithm.id}
              type="button"
              onClick={() => onSelect(algorithm.id)}
              className={`group overflow-hidden rounded-xl border text-left transition-all duration-200 ${
                active
                  ? 'border-[var(--accent)] bg-[var(--panel-strong)] ring-2 ring-[var(--accent-soft)]'
                  : 'border-[var(--border)] bg-[var(--panel)] hover:border-[var(--accent-soft)] hover:bg-[var(--panel-hover)]'
              }`}
            >
              <div className="relative h-24 w-full overflow-hidden" style={{ background: algorithm.thumbnailGradient }}>
                <div className="absolute inset-0">
                  <ThumbnailPreview algorithm={algorithm} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/10" />
                <div className="absolute right-3 bottom-2 text-xl font-bold text-white/85">{algorithm.thumbnailGlyph}</div>
                <div className="absolute left-3 top-2 rounded-full bg-black/30 px-2 py-0.5 text-[10px] font-medium tracking-wide text-white">
                  {algorithm.group}
                </div>
              </div>

              <div className="space-y-1 p-3">
                <p className="text-sm font-semibold text-[var(--text)]">{algorithm.name}</p>
                <p className="text-xs text-[var(--muted)]">{algorithm.summary}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
