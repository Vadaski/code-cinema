import type { AlgorithmDefinition, AlgorithmStep, GraphEdge, GraphNode } from '../types';
import { arrayVisual, createSortedNumbers, graphVisual, rainbowGradient } from './common';

const graphNodes: GraphNode[] = [
  { id: 'A', x: 0.12, y: 0.2 },
  { id: 'B', x: 0.3, y: 0.12 },
  { id: 'C', x: 0.5, y: 0.2 },
  { id: 'D', x: 0.18, y: 0.5 },
  { id: 'E', x: 0.42, y: 0.5 },
  { id: 'F', x: 0.68, y: 0.5 },
  { id: 'G', x: 0.82, y: 0.2 },
  { id: 'H', x: 0.8, y: 0.78 },
];

const weightedEdges: GraphEdge[] = [
  { from: 'A', to: 'B', weight: 4, directed: false },
  { from: 'A', to: 'D', weight: 2, directed: false },
  { from: 'B', to: 'C', weight: 3, directed: false },
  { from: 'B', to: 'E', weight: 5, directed: false },
  { from: 'C', to: 'F', weight: 3, directed: false },
  { from: 'C', to: 'G', weight: 4, directed: false },
  { from: 'D', to: 'E', weight: 3, directed: false },
  { from: 'E', to: 'F', weight: 2, directed: false },
  { from: 'F', to: 'H', weight: 3, directed: false },
  { from: 'G', to: 'H', weight: 2, directed: false },
  { from: 'E', to: 'H', weight: 7, directed: false },
];

const dagNodes: GraphNode[] = [
  { id: '1', x: 0.15, y: 0.15 },
  { id: '2', x: 0.35, y: 0.15 },
  { id: '3', x: 0.55, y: 0.15 },
  { id: '4', x: 0.25, y: 0.45 },
  { id: '5', x: 0.45, y: 0.45 },
  { id: '6', x: 0.7, y: 0.45 },
  { id: '7', x: 0.5, y: 0.78 },
];

const dagEdges: GraphEdge[] = [
  { from: '1', to: '4', directed: true },
  { from: '1', to: '5', directed: true },
  { from: '2', to: '5', directed: true },
  { from: '2', to: '6', directed: true },
  { from: '3', to: '6', directed: true },
  { from: '4', to: '7', directed: true },
  { from: '5', to: '7', directed: true },
  { from: '6', to: '7', directed: true },
];

const adjacency = (edges: GraphEdge[]): Record<string, { to: string; weight: number }[]> => {
  const map: Record<string, { to: string; weight: number }[]> = {};
  for (const edge of edges) {
    if (!map[edge.from]) map[edge.from] = [];
    map[edge.from].push({ to: edge.to, weight: edge.weight ?? 1 });

    if (!edge.directed) {
      if (!map[edge.to]) map[edge.to] = [];
      map[edge.to].push({ to: edge.from, weight: edge.weight ?? 1 });
    }
  }
  return map;
};

const binarySearchSource = [
  'function binarySearch(arr, target) {',
  '  let left = 0, right = arr.length - 1;',
  '  while (left <= right) {',
  '    const mid = Math.floor((left + right) / 2);',
  '    if (arr[mid] === target) return mid;',
  '    if (arr[mid] < target) left = mid + 1;',
  '    else right = mid - 1;',
  '  }',
  '  return -1;',
  '}',
];

const bfsSource = [
  'function bfs(graph, start) {',
  '  const q = [start];',
  '  const visited = new Set([start]);',
  '  while (q.length) {',
  '    const node = q.shift();',
  '    for (const next of graph[node]) {',
  '      if (!visited.has(next)) {',
  '        visited.add(next);',
  '        q.push(next);',
  '      }',
  '    }',
  '  }',
  '}',
];

const dfsSource = [
  'function dfs(node) {',
  '  visited.add(node);',
  '  for (const next of graph[node]) {',
  '    if (!visited.has(next)) dfs(next);',
  '  }',
  '}',
];

const dijkstraSource = [
  'function dijkstra(start) {',
  '  dist[start] = 0;',
  '  while (pq.notEmpty()) {',
  '    const u = pq.popMin();',
  '    for (const [v, w] of graph[u]) {',
  '      if (dist[u] + w < dist[v]) {',
  '        dist[v] = dist[u] + w;',
  '        prev[v] = u;',
  '      }',
  '    }',
  '  }',
  '}',
];

const aStarSource = [
  'function aStar(start, goal) {',
  '  open.add(start);',
  '  g[start] = 0;',
  '  f[start] = h(start, goal);',
  '  while (open.notEmpty()) {',
  '    const current = open.popMinF();',
  '    if (current === goal) return path;',
  '    for (const next of graph[current]) {',
  '      const tentative = g[current] + cost(current,next);',
  '      if (tentative < g[next]) update(next);',
  '    }',
  '  }',
  '}',
];

const topologicalSource = [
  'function topologicalSort(graph) {',
  '  const indegree = computeIndegree(graph);',
  '  const q = nodesWithZeroIndegree(indegree);',
  '  while (q.length) {',
  '    const node = q.shift();',
  '    output.push(node);',
  '    for (const next of graph[node]) {',
  '      indegree[next]--;',
  '      if (indegree[next] === 0) q.push(next);',
  '    }',
  '  }',
  '}',
];

const binarySearchGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const arr = createSortedNumbers(28);
  const target = arr[18];
  let left = 0;
  let right = arr.length - 1;
  const stack = ['binarySearch(arr,target)'];

  yield {
    line: 1,
    variables: { target, left, right },
    callStack: [...stack],
    visual: arrayVisual(arr, { range: [left, right] }),
  };

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    yield {
      line: 4,
      variables: { target, left, right, mid, midValue: arr[mid] },
      callStack: [...stack],
      visual: arrayVisual(arr, { active: [mid], range: [left, right] }),
    };

    if (arr[mid] === target) {
      yield {
        line: 5,
        variables: { target, foundAt: mid },
        callStack: [...stack],
        visual: arrayVisual(arr, { found: mid, range: [left, right] }),
      };
      return;
    }

    if (arr[mid] < target) {
      left = mid + 1;
      yield {
        line: 6,
        variables: { target, left, right, mid },
        callStack: [...stack],
        visual: arrayVisual(arr, { range: [left, right], active: [mid] }),
      };
    } else {
      right = mid - 1;
      yield {
        line: 7,
        variables: { target, left, right, mid },
        callStack: [...stack],
        visual: arrayVisual(arr, { range: [left, right], active: [mid] }),
      };
    }
  }

  yield {
    line: 9,
    variables: { target, result: -1 },
    callStack: [...stack],
    visual: arrayVisual(arr),
  };
};

const bfsGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const adj = adjacency(weightedEdges);
  const start = 'A';
  const queue: string[] = [start];
  const visited = new Set<string>([start]);
  const visitOrder: string[] = [start];
  const stack = ['bfs(graph,A)'];

  yield {
    line: 2,
    variables: { queue: [...queue], visited: visited.size },
    callStack: [...stack],
    visual: graphVisual(graphNodes, weightedEdges, {
      frontierNodes: [...queue],
      visitedNodes: [...visited],
      visitOrder: [...visitOrder],
      activeNodes: [start],
    }),
  };

  while (queue.length > 0) {
    const node = queue.shift()!;
    yield {
      line: 5,
      variables: { node, queue: [...queue], visited: visited.size },
      callStack: [...stack],
      visual: graphVisual(graphNodes, weightedEdges, {
        activeNodes: [node],
        frontierNodes: [...queue],
        visitedNodes: [...visited],
        visitOrder: [...visitOrder],
      }),
    };

    for (const next of adj[node] ?? []) {
      yield {
        line: 6,
        variables: { node, next: next.to },
        callStack: [...stack],
        visual: graphVisual(graphNodes, weightedEdges, {
          activeNodes: [node, next.to],
          activeEdges: [[node, next.to]],
          frontierNodes: [...queue],
          visitedNodes: [...visited],
          visitOrder: [...visitOrder],
        }),
      };

      if (!visited.has(next.to)) {
        visited.add(next.to);
        queue.push(next.to);
        visitOrder.push(next.to);
        yield {
          line: 8,
          variables: { enqueue: next.to, queue: [...queue], visited: visited.size, order: visitOrder.join('->') },
          callStack: [...stack],
          visual: graphVisual(graphNodes, weightedEdges, {
            activeNodes: [next.to],
            activeEdges: [[node, next.to]],
            frontierNodes: [...queue],
            visitedNodes: [...visited],
            visitOrder: [...visitOrder],
          }),
        };
      }
    }
  }
};

const dfsGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const adj = adjacency(weightedEdges);
  const visited = new Set<string>();
  const visitOrder: string[] = [];
  const stack: string[] = [];

  function* dfs(node: string): Generator<AlgorithmStep, void, void> {
    stack.push(`dfs(${node})`);
    visited.add(node);
    visitOrder.push(node);

    yield {
      line: 2,
      variables: { node, visited: visited.size, order: visitOrder.join('->') },
      callStack: [...stack],
      visual: graphVisual(graphNodes, weightedEdges, {
        activeNodes: [node],
        visitedNodes: [...visited],
        visitOrder: [...visitOrder],
      }),
    };

    for (const next of adj[node] ?? []) {
      yield {
        line: 3,
        variables: { node, next: next.to },
        callStack: [...stack],
        visual: graphVisual(graphNodes, weightedEdges, {
          activeNodes: [node, next.to],
          activeEdges: [[node, next.to]],
          visitedNodes: [...visited],
          visitOrder: [...visitOrder],
        }),
      };

      if (!visited.has(next.to)) {
        yield* dfs(next.to);
      }
    }

    stack.pop();
  }

  yield* dfs('A');
};

const dijkstraGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const adj = adjacency(weightedEdges);
  const nodes = graphNodes.map((node) => node.id);
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};

  for (const node of nodes) {
    dist[node] = Number.POSITIVE_INFINITY;
    prev[node] = null;
  }

  const start = 'A';
  const target = 'H';
  dist[start] = 0;

  const pq = [{ node: start, priority: 0 }];
  const visited = new Set<string>();
  const visitOrder: string[] = [];
  const stack = ['dijkstra(A)'];

  const distLabel = (): string =>
    nodes.map((node) => `${node}:${Number.isFinite(dist[node]) ? dist[node] : '∞'}`).join(' ');

  while (pq.length > 0) {
    pq.sort((a, b) => a.priority - b.priority);
    const current = pq.shift()!;
    if (visited.has(current.node)) {
      continue;
    }

    visited.add(current.node);
    visitOrder.push(current.node);
    yield {
      line: 4,
      variables: { node: current.node, dist: distLabel(), pq: pq.length, settled: visitOrder.join('->') },
      callStack: [...stack],
      visual: graphVisual(graphNodes, weightedEdges, {
        activeNodes: [current.node],
        visitedNodes: [...visited],
        visitOrder: [...visitOrder],
        frontierNodes: pq.map((item) => item.node),
      }),
    };

    if (current.node === target) {
      break;
    }

    for (const next of adj[current.node] ?? []) {
      const candidate = dist[current.node] + next.weight;
      yield {
        line: 5,
        variables: {
          node: current.node,
          next: next.to,
          candidate,
          currentBest: Number.isFinite(dist[next.to]) ? dist[next.to] : '∞',
        },
        callStack: [...stack],
        visual: graphVisual(graphNodes, weightedEdges, {
          activeNodes: [current.node, next.to],
          activeEdges: [[current.node, next.to]],
          visitedNodes: [...visited],
          visitOrder: [...visitOrder],
          frontierNodes: pq.map((item) => item.node),
        }),
      };

      if (candidate < dist[next.to]) {
        dist[next.to] = candidate;
        prev[next.to] = current.node;
        pq.push({ node: next.to, priority: candidate });

        yield {
          line: 7,
          variables: { relax: `${current.node}->${next.to}`, newDist: candidate, dist: distLabel() },
          callStack: [...stack],
          visual: graphVisual(graphNodes, weightedEdges, {
            activeNodes: [next.to],
            activeEdges: [[current.node, next.to]],
            visitedNodes: [...visited],
            visitOrder: [...visitOrder],
            frontierNodes: pq.map((item) => item.node),
          }),
        };
      }
    }
  }

  const path: string[] = [];
  let cursor: string | null = target;
  while (cursor) {
    path.unshift(cursor);
    cursor = prev[cursor];
  }
  const pathEdges: [string, string][] = [];
  for (let i = 0; i < path.length - 1; i += 1) {
    pathEdges.push([path[i], path[i + 1]]);
  }

  yield {
    line: 12,
    variables: { shortestPath: path.join(' -> '), cost: dist[target], settled: visitOrder.join('->') },
    callStack: [...stack],
    visual: graphVisual(graphNodes, weightedEdges, {
      visitedNodes: [...visited],
      visitOrder: [...visitOrder],
      pathNodes: path,
      activeEdges: pathEdges,
      activeNodes: [target],
    }),
  };
};

const aStarGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const adj = adjacency(weightedEdges);
  const start = 'A';
  const goal = 'H';
  const stack = ['aStar(A,H)'];

  const nodeMap = new Map(graphNodes.map((node) => [node.id, node]));

  const h = (a: string, b: string): number => {
    const n1 = nodeMap.get(a)!;
    const n2 = nodeMap.get(b)!;
    const dx = n1.x - n2.x;
    const dy = n1.y - n2.y;
    return Math.sqrt(dx * dx + dy * dy) * 10;
  };

  const g: Record<string, number> = {};
  const f: Record<string, number> = {};
  const prev: Record<string, string | null> = {};

  for (const node of graphNodes) {
    g[node.id] = Number.POSITIVE_INFINITY;
    f[node.id] = Number.POSITIVE_INFINITY;
    prev[node.id] = null;
  }

  g[start] = 0;
  f[start] = h(start, goal);

  const open = [{ node: start, score: f[start] }];
  const closed = new Set<string>();
  const visitOrder: string[] = [];

  while (open.length > 0) {
    open.sort((a, b) => a.score - b.score);
    const current = open.shift()!;
    if (!visitOrder.includes(current.node)) {
      visitOrder.push(current.node);
    }

    yield {
      line: 6,
      variables: {
        current: current.node,
        g: Number.isFinite(g[current.node]) ? g[current.node].toFixed(2) : '∞',
        f: f[current.node].toFixed(2),
        expanded: visitOrder.join('->'),
      },
      callStack: [...stack],
      visual: graphVisual(graphNodes, weightedEdges, {
        activeNodes: [current.node],
        frontierNodes: open.map((item) => item.node),
        visitedNodes: [...closed],
        visitOrder: [...visitOrder],
      }),
    };

    if (current.node === goal) {
      break;
    }

    closed.add(current.node);

    for (const next of adj[current.node] ?? []) {
      const tentative = g[current.node] + next.weight;
      yield {
        line: 9,
        variables: {
          current: current.node,
          next: next.to,
          tentative: tentative.toFixed(2),
          best: Number.isFinite(g[next.to]) ? g[next.to].toFixed(2) : '∞',
        },
        callStack: [...stack],
        visual: graphVisual(graphNodes, weightedEdges, {
          activeNodes: [current.node, next.to],
          activeEdges: [[current.node, next.to]],
          frontierNodes: open.map((item) => item.node),
          visitedNodes: [...closed],
          visitOrder: [...visitOrder],
        }),
      };

      if (tentative < g[next.to]) {
        prev[next.to] = current.node;
        g[next.to] = tentative;
        f[next.to] = tentative + h(next.to, goal);

        if (!open.some((item) => item.node === next.to)) {
          open.push({ node: next.to, score: f[next.to] });
        }

        yield {
          line: 10,
          variables: { update: next.to, g: g[next.to].toFixed(2), f: f[next.to].toFixed(2) },
          callStack: [...stack],
          visual: graphVisual(graphNodes, weightedEdges, {
            activeNodes: [next.to],
            activeEdges: [[current.node, next.to]],
            frontierNodes: open.map((item) => item.node),
            visitedNodes: [...closed],
            visitOrder: [...visitOrder],
          }),
        };
      }
    }
  }

  const path: string[] = [];
  let cursor: string | null = goal;
  while (cursor) {
    path.unshift(cursor);
    cursor = prev[cursor];
  }
  const pathEdges: [string, string][] = [];
  for (let i = 0; i < path.length - 1; i += 1) {
    pathEdges.push([path[i], path[i + 1]]);
  }

  yield {
    line: 12,
    variables: { path: path.join(' -> '), expanded: visitOrder.join('->') },
    callStack: [...stack],
    visual: graphVisual(graphNodes, weightedEdges, {
      pathNodes: path,
      visitedNodes: [...closed],
      visitOrder: [...visitOrder],
      activeEdges: pathEdges,
      activeNodes: [goal],
    }),
  };
};

const topologicalGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const indegree: Record<string, number> = {};
  const adj: Record<string, string[]> = {};

  for (const node of dagNodes) {
    indegree[node.id] = 0;
    adj[node.id] = [];
  }

  for (const edge of dagEdges) {
    indegree[edge.to] += 1;
    adj[edge.from].push(edge.to);
  }

  const queue = dagNodes.filter((node) => indegree[node.id] === 0).map((node) => node.id);
  const output: string[] = [];
  const stack = ['topologicalSort(graph)'];

  yield {
    line: 3,
    variables: { queue: queue.join(','), indegree: JSON.stringify(indegree) },
    callStack: [...stack],
    visual: graphVisual(dagNodes, dagEdges, {
      frontierNodes: [...queue],
      visitOrder: [...output],
    }),
  };

  while (queue.length > 0) {
    const node = queue.shift()!;
    output.push(node);

    yield {
      line: 5,
      variables: { node, output: output.join(' -> ') },
      callStack: [...stack],
      visual: graphVisual(dagNodes, dagEdges, {
        activeNodes: [node],
        visitedNodes: [...output],
        visitOrder: [...output],
        frontierNodes: [...queue],
      }),
    };

    for (const next of adj[node]) {
      indegree[next] -= 1;
      yield {
        line: 8,
        variables: { node, next, indegree: indegree[next] },
        callStack: [...stack],
        visual: graphVisual(dagNodes, dagEdges, {
          activeNodes: [node, next],
          activeEdges: [[node, next]],
          visitedNodes: [...output],
          visitOrder: [...output],
          frontierNodes: [...queue],
        }),
      };

      if (indegree[next] === 0) {
        queue.push(next);
        yield {
          line: 9,
          variables: { enqueue: next, queue: queue.join(',') },
          callStack: [...stack],
          visual: graphVisual(dagNodes, dagEdges, {
            activeNodes: [next],
            activeEdges: [[node, next]],
            visitedNodes: [...output],
            visitOrder: [...output],
            frontierNodes: [...queue],
          }),
        };
      }
    }
  }

  yield {
    line: 11,
    variables: { topologicalOrder: output.join(' -> ') },
    callStack: [...stack],
    visual: graphVisual(dagNodes, dagEdges, {
      visitedNodes: [...output],
      visitOrder: [...output],
      pathNodes: [...output],
    }),
  };
};

export const graphAlgorithms: AlgorithmDefinition[] = [
  {
    id: 'binary-search',
    name: 'Binary Search',
    group: 'Search',
    summary: 'Log-time search on sorted array window.',
    source: binarySearchSource,
    thumbnailGradient: rainbowGradient(8),
    thumbnailGlyph: '⌕',
    createGenerator: binarySearchGenerator,
  },
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    group: 'Graph',
    summary: 'Layer-by-layer graph traversal with queue.',
    source: bfsSource,
    thumbnailGradient: rainbowGradient(9),
    thumbnailGlyph: '↔',
    createGenerator: bfsGenerator,
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    group: 'Graph',
    summary: 'Recursive deep traversal with backtrack.',
    source: dfsSource,
    thumbnailGradient: rainbowGradient(10),
    thumbnailGlyph: '↧',
    createGenerator: dfsGenerator,
  },
  {
    id: 'dijkstra',
    name: 'Dijkstra',
    group: 'Graph',
    summary: 'Shortest path for non-negative edge weights.',
    source: dijkstraSource,
    thumbnailGradient: rainbowGradient(11),
    thumbnailGlyph: '∑',
    createGenerator: dijkstraGenerator,
  },
  {
    id: 'a-star',
    name: 'A* Search',
    group: 'Graph',
    summary: 'Heuristic-guided shortest path expansion.',
    source: aStarSource,
    thumbnailGradient: rainbowGradient(12),
    thumbnailGlyph: '★',
    createGenerator: aStarGenerator,
  },
  {
    id: 'topological-sort',
    name: 'Topological Sort',
    group: 'Graph',
    summary: 'Kahn indegree peeling for DAG ordering.',
    source: topologicalSource,
    thumbnailGradient: rainbowGradient(13),
    thumbnailGlyph: '⇢',
    createGenerator: topologicalGenerator,
  },
];
