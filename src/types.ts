export type ThemeMode = 'light' | 'dark';

export type VariablePrimitive = string | number | boolean | null;
export type VariableValue =
  | VariablePrimitive
  | VariablePrimitive[]
  | Record<string, VariablePrimitive | VariablePrimitive[]>;

export interface BarVisualState {
  kind: 'bars';
  values: number[];
  compare: number[];
  swap: number[];
  pivot: number | null;
  sorted: number[];
  active: number[];
  labels?: string[];
}

export interface ArrayVisualState {
  kind: 'array';
  values: number[];
  active: number[];
  found: number | null;
  range: [number, number] | null;
}

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  label?: string;
}

export interface GraphEdge {
  from: string;
  to: string;
  weight?: number;
  directed?: boolean;
}

export interface GraphVisualState {
  kind: 'graph';
  nodes: GraphNode[];
  edges: GraphEdge[];
  activeNodes: string[];
  activeEdges: [string, string][];
  visitedNodes: string[];
  visitOrder: string[];
  frontierNodes: string[];
  pathNodes: string[];
}

export interface TreeNodeVisual {
  id: string;
  value: string;
  x: number;
  y: number;
  parentId?: string;
}

export interface TreeVisualState {
  kind: 'tree';
  nodes: TreeNodeVisual[];
  activeNodes: string[];
  visitedNodes: string[];
}

export interface HashVisualState {
  kind: 'hash';
  buckets: string[][];
  activeBucket: number | null;
  op: string;
}

export interface LinkedListVisualState {
  kind: 'linked-list';
  nodes: string[];
  active: number | null;
  pointer: number | null;
}

export interface StackVisualState {
  kind: 'stack';
  items: string[];
  activeIndex: number | null;
}

export interface QueueVisualState {
  kind: 'queue';
  items: string[];
  activeIndex: number | null;
}

export interface TrieVisualNode {
  id: string;
  value: string;
  x: number;
  y: number;
  parentId?: string;
  terminal?: boolean;
}

export interface TrieVisualState {
  kind: 'trie';
  nodes: TrieVisualNode[];
  activeNodes: string[];
  currentWord: string;
}

export interface UnionFindVisualState {
  kind: 'union-find';
  parents: number[];
  ranks: number[];
  activePair: [number, number] | null;
}

export type VisualState =
  | BarVisualState
  | ArrayVisualState
  | GraphVisualState
  | TreeVisualState
  | HashVisualState
  | LinkedListVisualState
  | StackVisualState
  | QueueVisualState
  | TrieVisualState
  | UnionFindVisualState;

export interface AlgorithmStep {
  line: number;
  variables: Record<string, VariableValue>;
  callStack: string[];
  visual: VisualState;
  note?: string;
}

export interface AlgorithmDefinition {
  id: string;
  name: string;
  group: string;
  summary: string;
  source: string[];
  thumbnailGradient: string;
  thumbnailGlyph: string;
  createGenerator: () => Generator<AlgorithmStep, void, void>;
}
