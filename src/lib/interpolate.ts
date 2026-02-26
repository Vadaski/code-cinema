import type {
  AlgorithmStep,
  ArrayVisualState,
  BarVisualState,
  GraphVisualState,
  HashVisualState,
  LinkedListVisualState,
  QueueVisualState,
  StackVisualState,
  TreeVisualState,
  TrieVisualState,
  UnionFindVisualState,
  VisualState,
} from '../types';
import { lerp } from './easing';

const interpolateNumbers = (from: number[], to: number[], t: number): number[] => {
  const size = Math.min(from.length, to.length);
  const result = new Array<number>(size);
  for (let i = 0; i < size; i += 1) {
    result[i] = lerp(from[i], to[i], t);
  }
  return result;
};

const interpolateBars = (from: BarVisualState, to: BarVisualState, t: number): BarVisualState => ({
  kind: 'bars',
  values: interpolateNumbers(from.values, to.values, t),
  compare: t < 0.55 ? from.compare : to.compare,
  swap: t < 0.55 ? from.swap : to.swap,
  pivot: t < 0.5 ? from.pivot : to.pivot,
  sorted: t < 0.6 ? from.sorted : to.sorted,
  active: t < 0.5 ? from.active : to.active,
  labels: to.labels,
});

const interpolateArray = (from: ArrayVisualState, to: ArrayVisualState, t: number): ArrayVisualState => ({
  kind: 'array',
  values: interpolateNumbers(from.values, to.values, t),
  active: t < 0.5 ? from.active : to.active,
  found: t < 0.5 ? from.found : to.found,
  range:
    t < 0.5
      ? from.range
      : to.range,
});

const interpolateGraph = (from: GraphVisualState, to: GraphVisualState, t: number): GraphVisualState => ({
  kind: 'graph',
  nodes: to.nodes,
  edges: to.edges,
  activeNodes: t < 0.5 ? from.activeNodes : to.activeNodes,
  activeEdges: t < 0.5 ? from.activeEdges : to.activeEdges,
  visitedNodes: t < 0.65 ? from.visitedNodes : to.visitedNodes,
  visitOrder: t < 0.65 ? from.visitOrder : to.visitOrder,
  frontierNodes: t < 0.5 ? from.frontierNodes : to.frontierNodes,
  pathNodes: t < 0.65 ? from.pathNodes : to.pathNodes,
});

const interpolateTree = (from: TreeVisualState, to: TreeVisualState, t: number): TreeVisualState => ({
  kind: 'tree',
  nodes: to.nodes,
  activeNodes: t < 0.5 ? from.activeNodes : to.activeNodes,
  visitedNodes: t < 0.6 ? from.visitedNodes : to.visitedNodes,
});

const interpolateHash = (from: HashVisualState, to: HashVisualState, t: number): HashVisualState => ({
  kind: 'hash',
  buckets: to.buckets,
  activeBucket: t < 0.5 ? from.activeBucket : to.activeBucket,
  op: t < 0.5 ? from.op : to.op,
});

const interpolateLinkedList = (
  from: LinkedListVisualState,
  to: LinkedListVisualState,
  t: number,
): LinkedListVisualState => ({
  kind: 'linked-list',
  nodes: to.nodes,
  active: t < 0.5 ? from.active : to.active,
  pointer: t < 0.5 ? from.pointer : to.pointer,
});

const interpolateStack = (from: StackVisualState, to: StackVisualState, t: number): StackVisualState => ({
  kind: 'stack',
  items: to.items,
  activeIndex: t < 0.5 ? from.activeIndex : to.activeIndex,
});

const interpolateQueue = (from: QueueVisualState, to: QueueVisualState, t: number): QueueVisualState => ({
  kind: 'queue',
  items: to.items,
  activeIndex: t < 0.5 ? from.activeIndex : to.activeIndex,
});

const interpolateTrie = (from: TrieVisualState, to: TrieVisualState, t: number): TrieVisualState => ({
  kind: 'trie',
  nodes: to.nodes,
  activeNodes: t < 0.5 ? from.activeNodes : to.activeNodes,
  currentWord: t < 0.5 ? from.currentWord : to.currentWord,
});

const interpolateUnionFind = (
  from: UnionFindVisualState,
  to: UnionFindVisualState,
  t: number,
): UnionFindVisualState => ({
  kind: 'union-find',
  parents: interpolateNumbers(from.parents, to.parents, t).map((v) => Math.round(v)),
  ranks: interpolateNumbers(from.ranks, to.ranks, t).map((v) => Math.round(v)),
  activePair: t < 0.5 ? from.activePair : to.activePair,
});

export const interpolateVisualState = (from: VisualState, to: VisualState, t: number): VisualState => {
  if (from.kind !== to.kind) {
    return to;
  }

  switch (to.kind) {
    case 'bars':
      return interpolateBars(from as BarVisualState, to, t);
    case 'array':
      return interpolateArray(from as ArrayVisualState, to, t);
    case 'graph':
      return interpolateGraph(from as GraphVisualState, to, t);
    case 'tree':
      return interpolateTree(from as TreeVisualState, to, t);
    case 'hash':
      return interpolateHash(from as HashVisualState, to, t);
    case 'linked-list':
      return interpolateLinkedList(from as LinkedListVisualState, to, t);
    case 'stack':
      return interpolateStack(from as StackVisualState, to, t);
    case 'queue':
      return interpolateQueue(from as QueueVisualState, to, t);
    case 'trie':
      return interpolateTrie(from as TrieVisualState, to, t);
    case 'union-find':
      return interpolateUnionFind(from as UnionFindVisualState, to, t);
    default:
      return to;
  }
};

export const interpolateStep = (from: AlgorithmStep, to: AlgorithmStep, t: number): AlgorithmStep => ({
  line: t < 0.5 ? from.line : to.line,
  variables: t < 0.5 ? from.variables : to.variables,
  callStack: t < 0.5 ? from.callStack : to.callStack,
  note: t < 0.5 ? from.note : to.note,
  visual: interpolateVisualState(from.visual, to.visual, t),
});
