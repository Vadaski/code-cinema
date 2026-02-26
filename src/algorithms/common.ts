import type {
  AlgorithmDefinition,
  AlgorithmStep,
  ArrayVisualState,
  BarVisualState,
  GraphEdge,
  GraphNode,
  GraphVisualState,
  HashVisualState,
  LinkedListVisualState,
  QueueVisualState,
  StackVisualState,
  TreeNodeVisual,
  TreeVisualState,
  TrieVisualNode,
  TrieVisualState,
  UnionFindVisualState,
} from '../types';

const createSeededRng = (seed: number): (() => number) => {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 0x100000000;
  };
};

export const createSampleNumbers = (length: number, seed = 42): number[] => {
  const rng = createSeededRng(seed);
  const values: number[] = [];
  for (let i = 0; i < length; i += 1) {
    values.push(10 + Math.floor(rng() * 90));
  }
  return values;
};

export const createSortedNumbers = (length: number): number[] => {
  const values: number[] = [];
  for (let i = 0; i < length; i += 1) {
    values.push(i * 2 + 4);
  }
  return values;
};

export const barsVisual = (
  values: number[],
  options?: Partial<Pick<BarVisualState, 'compare' | 'swap' | 'pivot' | 'sorted' | 'active' | 'labels'>>,
): BarVisualState => ({
  kind: 'bars',
  values: [...values],
  compare: options?.compare ? [...options.compare] : [],
  swap: options?.swap ? [...options.swap] : [],
  pivot: options?.pivot ?? null,
  sorted: options?.sorted ? [...options.sorted] : [],
  active: options?.active ? [...options.active] : [],
  labels: options?.labels ? [...options.labels] : undefined,
});

export const arrayVisual = (
  values: number[],
  options?: Partial<Pick<ArrayVisualState, 'active' | 'found' | 'range'>>,
): ArrayVisualState => ({
  kind: 'array',
  values: [...values],
  active: options?.active ? [...options.active] : [],
  found: options?.found ?? null,
  range: options?.range ?? null,
});

export const graphVisual = (
  nodes: GraphNode[],
  edges: GraphEdge[],
  options?: Partial<
    Pick<GraphVisualState, 'activeNodes' | 'activeEdges' | 'visitedNodes' | 'visitOrder' | 'frontierNodes' | 'pathNodes'>
  >,
): GraphVisualState => ({
  kind: 'graph',
  nodes,
  edges,
  activeNodes: options?.activeNodes ? [...options.activeNodes] : [],
  activeEdges: options?.activeEdges ? [...options.activeEdges] : [],
  visitedNodes: options?.visitedNodes ? [...options.visitedNodes] : [],
  visitOrder: options?.visitOrder ? [...options.visitOrder] : [],
  frontierNodes: options?.frontierNodes ? [...options.frontierNodes] : [],
  pathNodes: options?.pathNodes ? [...options.pathNodes] : [],
});

export const treeVisual = (
  nodes: TreeNodeVisual[],
  options?: Partial<Pick<TreeVisualState, 'activeNodes' | 'visitedNodes'>>,
): TreeVisualState => ({
  kind: 'tree',
  nodes,
  activeNodes: options?.activeNodes ? [...options.activeNodes] : [],
  visitedNodes: options?.visitedNodes ? [...options.visitedNodes] : [],
});

export const hashVisual = (
  buckets: string[][],
  options?: Partial<Pick<HashVisualState, 'activeBucket' | 'op'>>,
): HashVisualState => ({
  kind: 'hash',
  buckets: buckets.map((bucket) => [...bucket]),
  activeBucket: options?.activeBucket ?? null,
  op: options?.op ?? 'idle',
});

export const linkedListVisual = (
  nodes: string[],
  options?: Partial<Pick<LinkedListVisualState, 'active' | 'pointer'>>,
): LinkedListVisualState => ({
  kind: 'linked-list',
  nodes: [...nodes],
  active: options?.active ?? null,
  pointer: options?.pointer ?? null,
});

export const stackVisual = (
  items: string[],
  options?: Partial<Pick<StackVisualState, 'activeIndex'>>,
): StackVisualState => ({
  kind: 'stack',
  items: [...items],
  activeIndex: options?.activeIndex ?? null,
});

export const queueVisual = (
  items: string[],
  options?: Partial<Pick<QueueVisualState, 'activeIndex'>>,
): QueueVisualState => ({
  kind: 'queue',
  items: [...items],
  activeIndex: options?.activeIndex ?? null,
});

export const trieVisual = (
  nodes: TrieVisualNode[],
  options?: Partial<Pick<TrieVisualState, 'activeNodes' | 'currentWord'>>,
): TrieVisualState => ({
  kind: 'trie',
  nodes,
  activeNodes: options?.activeNodes ? [...options.activeNodes] : [],
  currentWord: options?.currentWord ?? '',
});

export const unionFindVisual = (
  parents: number[],
  ranks: number[],
  options?: Partial<Pick<UnionFindVisualState, 'activePair'>>,
): UnionFindVisualState => ({
  kind: 'union-find',
  parents: [...parents],
  ranks: [...ranks],
  activePair: options?.activePair ?? null,
});

export const collectSteps = (generator: Generator<AlgorithmStep, void, void>): AlgorithmStep[] => {
  const steps: AlgorithmStep[] = [];
  for (const step of generator) {
    steps.push(step);
  }
  return steps;
};

export const materializeSteps = (definition: AlgorithmDefinition): AlgorithmStep[] =>
  collectSteps(definition.createGenerator());

export const rainbowGradient = (index: number): string => {
  const palettes = [
    'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
    'linear-gradient(135deg, #ff6a00 0%, #ee0979 100%)',
    'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    'linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)',
    'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
    'linear-gradient(135deg, #4158d0 0%, #c850c0 46%, #ffcc70 100%)',
  ];

  return palettes[index % palettes.length];
};
