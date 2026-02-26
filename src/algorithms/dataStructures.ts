import type { AlgorithmDefinition, AlgorithmStep, TreeNodeVisual, TrieVisualNode } from '../types';
import {
  hashVisual,
  linkedListVisual,
  queueVisual,
  rainbowGradient,
  stackVisual,
  treeVisual,
  trieVisual,
  unionFindVisual,
} from './common';

const binaryTreeSource = [
  'function binaryTreeOps() {',
  '  insert(root, 65);',
  '  const found = search(root, 40);',
  '  const order = inorder(root);',
  '}',
];

const hashTableSource = [
  'function hashTableOps(table) {',
  '  table.set("kiwi", 32);',
  '  table.set("apple", 15);',
  '  table.set("grape", 20);',
  '  table.get("apple");',
  '  table.delete("kiwi");',
  '}',
];

const linkedListSource = [
  'function linkedListOps(list) {',
  '  list.append(12);',
  '  list.insert(1, 5);',
  '  list.remove(7);',
  '  list.traverse();',
  '}',
];

const stackSource = [
  'function stackOps(stack) {',
  '  stack.push("A");',
  '  stack.push("B");',
  '  stack.pop();',
  '  stack.push("C");',
  '}',
];

const queueSource = [
  'function queueOps(queue) {',
  '  queue.enqueue("A");',
  '  queue.enqueue("B");',
  '  queue.dequeue();',
  '  queue.enqueue("C");',
  '}',
];

const trieSource = [
  'function trieOps(trie) {',
  '  trie.insert("cat");',
  '  trie.insert("car");',
  '  trie.insert("dog");',
  '  trie.search("car");',
  '}',
];

const unionFindSource = [
  'function unionFindOps(uf) {',
  '  uf.union(0, 1);',
  '  uf.union(1, 2);',
  '  uf.union(3, 4);',
  '  uf.union(2, 4);',
  '  uf.find(4);',
  '}',
];

interface BstNode {
  id: string;
  value: number;
  left: string | null;
  right: string | null;
  parentId?: string;
}

const layoutBst = (nodes: Record<string, BstNode>, rootId: string): TreeNodeVisual[] => {
  const result: TreeNodeVisual[] = [];

  const walk = (id: string, depth: number, minX: number, maxX: number) => {
    const node = nodes[id];
    const x = (minX + maxX) / 2;
    const y = 0.12 + depth * 0.18;
    result.push({
      id,
      value: String(node.value),
      x,
      y,
      parentId: node.parentId,
    });

    if (node.left) {
      walk(node.left, depth + 1, minX, x);
    }
    if (node.right) {
      walk(node.right, depth + 1, x, maxX);
    }
  };

  walk(rootId, 0, 0.08, 0.92);
  return result;
};

const binaryTreeGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const stack = ['binaryTreeOps()'];
  const nodes: Record<string, BstNode> = {
    '50': { id: '50', value: 50, left: '30', right: '70' },
    '30': { id: '30', value: 30, left: '20', right: '40', parentId: '50' },
    '70': { id: '70', value: 70, left: '60', right: '80', parentId: '50' },
    '20': { id: '20', value: 20, left: null, right: null, parentId: '30' },
    '40': { id: '40', value: 40, left: null, right: null, parentId: '30' },
    '60': { id: '60', value: 60, left: null, right: null, parentId: '70' },
    '80': { id: '80', value: 80, left: null, right: null, parentId: '70' },
  };

  let rootId = '50';
  let tree = layoutBst(nodes, rootId);

  yield {
    line: 1,
    variables: { root: rootId, nodes: Object.keys(nodes).length },
    callStack: [...stack],
    visual: treeVisual(tree),
  };

  stack.push('insert(65)');
  let cursor: string | null = rootId;
  let parent: string | null = null;

  while (cursor) {
    parent = cursor;
    yield {
      line: 2,
      variables: { insertValue: 65, cursor },
      callStack: [...stack],
      visual: treeVisual(tree, { activeNodes: [cursor] }),
    };

    cursor = 65 < nodes[cursor].value ? nodes[cursor].left : nodes[cursor].right;
  }

  if (parent) {
    const newNode: BstNode = {
      id: '65',
      value: 65,
      left: null,
      right: null,
      parentId: parent,
    };
    nodes['65'] = newNode;
    if (65 < nodes[parent].value) {
      nodes[parent].left = '65';
    } else {
      nodes[parent].right = '65';
    }
    tree = layoutBst(nodes, rootId);
  }
  stack.pop();

  yield {
    line: 2,
    variables: { inserted: 65, parent },
    callStack: [...stack],
    visual: treeVisual(tree, { activeNodes: ['65'] }),
  };

  stack.push('search(40)');
  cursor = rootId;

  while (cursor) {
    yield {
      line: 3,
      variables: { target: 40, cursor },
      callStack: [...stack],
      visual: treeVisual(tree, { activeNodes: [cursor] }),
    };

    if (nodes[cursor].value === 40) {
      break;
    }
    cursor = 40 < nodes[cursor].value ? nodes[cursor].left : nodes[cursor].right;
  }
  stack.pop();

  const visited: string[] = [];
  const inorderResult: number[] = [];

  function* inorder(nodeId: string | null): Generator<AlgorithmStep, void, void> {
    if (!nodeId) {
      return;
    }
    yield* inorder(nodes[nodeId].left);
    visited.push(nodeId);
    inorderResult.push(nodes[nodeId].value);

    yield {
      line: 4,
      variables: { inorder: inorderResult.join(', ') },
      callStack: [...stack, 'inorder(root)'],
      visual: treeVisual(tree, { activeNodes: [nodeId], visitedNodes: [...visited] }),
    };

    yield* inorder(nodes[nodeId].right);
  }

  yield* inorder(rootId);

  yield {
    line: 5,
    variables: { status: 'done', inorder: inorderResult.join(', ') },
    callStack: [...stack],
    visual: treeVisual(tree, { visitedNodes: [...visited] }),
  };
};

const hashFn = (key: string, size: number): number => {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  return hash % size;
};

const hashTableGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const buckets: string[][] = Array.from({ length: 7 }, () => []);
  const stack = ['hashTableOps(table)'];

  const set = (key: string, value: number): number => {
    const idx = hashFn(key, buckets.length);
    const entry = `${key}:${value}`;
    const existing = buckets[idx].findIndex((item) => item.startsWith(`${key}:`));
    if (existing >= 0) {
      buckets[idx][existing] = entry;
    } else {
      buckets[idx].push(entry);
    }
    return idx;
  };

  let bucket = set('kiwi', 32);
  yield {
    line: 2,
    variables: { op: 'set', key: 'kiwi', value: 32, bucket },
    callStack: [...stack],
    visual: hashVisual(buckets, { activeBucket: bucket, op: 'set' }),
  };

  bucket = set('apple', 15);
  yield {
    line: 3,
    variables: { op: 'set', key: 'apple', value: 15, bucket },
    callStack: [...stack],
    visual: hashVisual(buckets, { activeBucket: bucket, op: 'set' }),
  };

  bucket = set('grape', 20);
  yield {
    line: 4,
    variables: { op: 'set', key: 'grape', value: 20, bucket },
    callStack: [...stack],
    visual: hashVisual(buckets, { activeBucket: bucket, op: 'set' }),
  };

  bucket = hashFn('apple', buckets.length);
  const found = buckets[bucket].find((entry) => entry.startsWith('apple:')) ?? null;
  yield {
    line: 5,
    variables: { op: 'get', key: 'apple', bucket, found: found ?? 'null' },
    callStack: [...stack],
    visual: hashVisual(buckets, { activeBucket: bucket, op: 'get' }),
  };

  bucket = hashFn('kiwi', buckets.length);
  buckets[bucket] = buckets[bucket].filter((entry) => !entry.startsWith('kiwi:'));
  yield {
    line: 6,
    variables: { op: 'delete', key: 'kiwi', bucket },
    callStack: [...stack],
    visual: hashVisual(buckets, { activeBucket: bucket, op: 'delete' }),
  };
};

const linkedListGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const list: string[] = ['3', '7', '9'];
  const stack = ['linkedListOps(list)'];

  yield {
    line: 1,
    variables: { list: list.join(' -> ') },
    callStack: [...stack],
    visual: linkedListVisual(list),
  };

  list.push('12');
  yield {
    line: 2,
    variables: { op: 'append', value: 12 },
    callStack: [...stack],
    visual: linkedListVisual(list, { active: list.length - 1 }),
  };

  list.splice(1, 0, '5');
  yield {
    line: 3,
    variables: { op: 'insert', index: 1, value: 5 },
    callStack: [...stack],
    visual: linkedListVisual(list, { active: 1 }),
  };

  const removeIndex = list.indexOf('7');
  if (removeIndex >= 0) {
    list.splice(removeIndex, 1);
  }
  yield {
    line: 4,
    variables: { op: 'remove', value: 7, index: removeIndex },
    callStack: [...stack],
    visual: linkedListVisual(list, { active: removeIndex >= 0 ? Math.min(removeIndex, list.length - 1) : null }),
  };

  for (let i = 0; i < list.length; i += 1) {
    yield {
      line: 5,
      variables: { pointer: i, value: list[i] },
      callStack: [...stack],
      visual: linkedListVisual(list, { pointer: i, active: i }),
    };
  }
};

const stackGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const stack: string[] = [];
  const callStack = ['stackOps(stack)'];

  const push = (value: string) => {
    stack.push(value);
    return stack.length - 1;
  };

  let activeIndex = push('A');
  yield {
    line: 2,
    variables: { op: 'push', value: 'A', top: stack[stack.length - 1] },
    callStack: [...callStack],
    visual: stackVisual(stack, { activeIndex }),
  };

  activeIndex = push('B');
  yield {
    line: 3,
    variables: { op: 'push', value: 'B', top: stack[stack.length - 1] },
    callStack: [...callStack],
    visual: stackVisual(stack, { activeIndex }),
  };

  const popped = stack.pop() ?? null;
  yield {
    line: 4,
    variables: { op: 'pop', popped: popped ?? 'null', nextTop: stack[stack.length - 1] ?? 'null' },
    callStack: [...callStack],
    visual: stackVisual(stack, { activeIndex: stack.length - 1 }),
  };

  activeIndex = push('C');
  yield {
    line: 5,
    variables: { op: 'push', value: 'C', top: stack[stack.length - 1] },
    callStack: [...callStack],
    visual: stackVisual(stack, { activeIndex }),
  };
};

const queueGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const queue: string[] = [];
  const callStack = ['queueOps(queue)'];

  queue.push('A');
  yield {
    line: 2,
    variables: { op: 'enqueue', value: 'A', size: queue.length },
    callStack: [...callStack],
    visual: queueVisual(queue, { activeIndex: queue.length - 1 }),
  };

  queue.push('B');
  yield {
    line: 3,
    variables: { op: 'enqueue', value: 'B', size: queue.length },
    callStack: [...callStack],
    visual: queueVisual(queue, { activeIndex: queue.length - 1 }),
  };

  const dequeued = queue.shift() ?? null;
  yield {
    line: 4,
    variables: { op: 'dequeue', value: dequeued ?? 'null', size: queue.length },
    callStack: [...callStack],
    visual: queueVisual(queue, { activeIndex: 0 }),
  };

  queue.push('C');
  yield {
    line: 5,
    variables: { op: 'enqueue', value: 'C', size: queue.length },
    callStack: [...callStack],
    visual: queueVisual(queue, { activeIndex: queue.length - 1 }),
  };
};

interface TrieDataNode {
  id: string;
  value: string;
  children: Map<string, TrieDataNode>;
  terminal: boolean;
  parentId?: string;
}

const layoutTrie = (root: TrieDataNode): TrieVisualNode[] => {
  const levels: TrieDataNode[][] = [];

  const visit = (node: TrieDataNode, depth: number) => {
    if (!levels[depth]) {
      levels[depth] = [];
    }
    levels[depth].push(node);
    for (const child of node.children.values()) {
      visit(child, depth + 1);
    }
  };

  visit(root, 0);

  const visuals: TrieVisualNode[] = [];
  for (let depth = 0; depth < levels.length; depth += 1) {
    const row = levels[depth];
    for (let index = 0; index < row.length; index += 1) {
      const node = row[index];
      visuals.push({
        id: node.id,
        value: node.value,
        x: row.length === 1 ? 0.5 : 0.12 + (0.76 * index) / (row.length - 1),
        y: 0.12 + depth * 0.18,
        parentId: node.parentId,
        terminal: node.terminal,
      });
    }
  }
  return visuals;
};

const trieGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const root: TrieDataNode = { id: 'root', value: '∅', children: new Map(), terminal: false };
  let nodeCount = 0;
  const callStack = ['trieOps(trie)'];

  const insertWord = function* (word: string, line: number): Generator<AlgorithmStep, void, void> {
    let cursor = root;
    const activePath = ['root'];

    for (const char of word) {
      let next = cursor.children.get(char);
      if (!next) {
        nodeCount += 1;
        next = {
          id: `${char}-${nodeCount}`,
          value: char,
          children: new Map(),
          terminal: false,
          parentId: cursor.id,
        };
        cursor.children.set(char, next);
      }
      cursor = next;
      activePath.push(cursor.id);

      yield {
        line,
        variables: { op: 'insert', word, char },
        callStack: [...callStack],
        visual: trieVisual(layoutTrie(root), { activeNodes: [...activePath], currentWord: word }),
      };
    }

    cursor.terminal = true;
  };

  yield* insertWord('cat', 2);
  yield* insertWord('car', 3);
  yield* insertWord('dog', 4);

  const searchWord = 'car';
  let cursor: TrieDataNode | undefined = root;
  const activePath = ['root'];
  for (const char of searchWord) {
    cursor = cursor?.children.get(char);
    if (!cursor) {
      break;
    }
    activePath.push(cursor.id);

    yield {
      line: 5,
      variables: { op: 'search', word: searchWord, char, exists: true },
      callStack: [...callStack],
      visual: trieVisual(layoutTrie(root), { activeNodes: [...activePath], currentWord: searchWord }),
    };
  }

  const found = Boolean(cursor && cursor.terminal);
  yield {
    line: 5,
    variables: { op: 'search', word: searchWord, found },
    callStack: [...callStack],
    visual: trieVisual(layoutTrie(root), { activeNodes: [...activePath], currentWord: searchWord }),
  };
};

const unionFindGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const size = 8;
  const parents = Array.from({ length: size }, (_, i) => i);
  const ranks = new Array(size).fill(0);
  const callStack = ['unionFindOps(uf)'];

  const find = (x: number): number => {
    if (parents[x] !== x) {
      parents[x] = find(parents[x]);
    }
    return parents[x];
  };

  const unionPairs: [number, number, number][] = [
    [0, 1, 2],
    [1, 2, 3],
    [3, 4, 4],
    [2, 4, 5],
  ];

  const union = (a: number, b: number) => {
    let rootA = find(a);
    let rootB = find(b);
    if (rootA === rootB) {
      return;
    }
    if (ranks[rootA] < ranks[rootB]) {
      [rootA, rootB] = [rootB, rootA];
    }
    parents[rootB] = rootA;
    if (ranks[rootA] === ranks[rootB]) {
      ranks[rootA] += 1;
    }
  };

  for (const [a, b, line] of unionPairs) {
    union(a, b);
    yield {
      line,
      variables: { op: 'union', pair: `${a},${b}`, parents: parents.join(',') },
      callStack: [...callStack],
      visual: unionFindVisual(parents, ranks, { activePair: [a, b] }),
    };
  }

  const query = 4;
  const root = find(query);
  yield {
    line: 6,
    variables: { op: 'find', query, root, parents: parents.join(',') },
    callStack: [...callStack],
    visual: unionFindVisual(parents, ranks, { activePair: [query, root] }),
  };
};

export const dataStructureAlgorithms: AlgorithmDefinition[] = [
  {
    id: 'binary-tree-ops',
    name: 'Binary Tree Ops',
    group: 'Data Structures',
    summary: 'BST insert, search, and inorder traversal.',
    source: binaryTreeSource,
    thumbnailGradient: rainbowGradient(14),
    thumbnailGlyph: '🌲',
    createGenerator: binaryTreeGenerator,
  },
  {
    id: 'hash-table-ops',
    name: 'Hash Table Ops',
    group: 'Data Structures',
    summary: 'Set/get/delete with chained buckets.',
    source: hashTableSource,
    thumbnailGradient: rainbowGradient(15),
    thumbnailGlyph: '{#}',
    createGenerator: hashTableGenerator,
  },
  {
    id: 'linked-list-ops',
    name: 'Linked List Ops',
    group: 'Data Structures',
    summary: 'Append, insert, delete, traverse pointers.',
    source: linkedListSource,
    thumbnailGradient: rainbowGradient(16),
    thumbnailGlyph: '⟷',
    createGenerator: linkedListGenerator,
  },
  {
    id: 'stack-ops',
    name: 'Stack Ops',
    group: 'Data Structures',
    summary: 'LIFO push/pop state transitions.',
    source: stackSource,
    thumbnailGradient: rainbowGradient(17),
    thumbnailGlyph: '▤',
    createGenerator: stackGenerator,
  },
  {
    id: 'queue-ops',
    name: 'Queue Ops',
    group: 'Data Structures',
    summary: 'FIFO enqueue/dequeue dynamics.',
    source: queueSource,
    thumbnailGradient: rainbowGradient(18),
    thumbnailGlyph: '⇄',
    createGenerator: queueGenerator,
  },
  {
    id: 'trie-ops',
    name: 'Trie Ops',
    group: 'Data Structures',
    summary: 'Prefix tree insertions and query path.',
    source: trieSource,
    thumbnailGradient: rainbowGradient(19),
    thumbnailGlyph: '⌬',
    createGenerator: trieGenerator,
  },
  {
    id: 'union-find',
    name: 'Union-Find',
    group: 'Data Structures',
    summary: 'Disjoint-set union with path compression.',
    source: unionFindSource,
    thumbnailGradient: rainbowGradient(20),
    thumbnailGlyph: '⋃',
    createGenerator: unionFindGenerator,
  },
];
