import { useEffect, useRef } from 'react';
import { easeInOutCubic, easeOutQuint } from '../lib/easing';
import { interpolateStep } from '../lib/interpolate';
import type {
  AlgorithmStep,
  ArrayVisualState,
  BarVisualState,
  GraphVisualState,
  HashVisualState,
  LinkedListVisualState,
  QueueVisualState,
  StackVisualState,
  ThemeMode,
  TreeVisualState,
  TrieVisualState,
  UnionFindVisualState,
  VisualState,
} from '../types';

interface CanvasStageProps {
  step: AlgorithmStep;
  speed: number;
  theme: ThemeMode;
}

interface Palette {
  bg: string;
  bg2: string;
  grid: string;
  text: string;
  muted: string;
  edge: string;
  node: string;
  accent: string;
  good: string;
  warn: string;
  danger: string;
}

const drawRoundedRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + width, y, x + width, y + height, r);
  ctx.arcTo(x + width, y + height, x, y + height, r);
  ctx.arcTo(x, y + height, x, y, r);
  ctx.arcTo(x, y, x + width, y, r);
  ctx.closePath();
};

const drawArrowHead = (
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  size: number,
) => {
  const angle = Math.atan2(toY - fromY, toX - fromX);
  const left = angle - Math.PI / 7;
  const right = angle + Math.PI / 7;

  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - size * Math.cos(left), toY - size * Math.sin(left));
  ctx.lineTo(toX - size * Math.cos(right), toY - size * Math.sin(right));
  ctx.closePath();
  ctx.fill();
};

const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, palette: Palette) => {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, palette.bg);
  gradient.addColorStop(1, palette.bg2);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = palette.grid;
  ctx.lineWidth = 1;

  const gridSize = Math.max(26, Math.floor(width / 26));
  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(width, y + 0.5);
    ctx.stroke();
  }
};

const drawBars = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: BarVisualState,
  palette: Palette,
  timeMs: number,
) => {
  const values = state.values;
  if (values.length === 0) {
    return;
  }

  const leftPad = 24;
  const rightPad = 24;
  const topPad = 28;
  const bottomPad = 26;
  const chartWidth = width - leftPad - rightPad;
  const chartHeight = height - topPad - bottomPad;

  const maxValue = Math.max(...values, 1);
  const gap = Math.max(1, Math.floor(chartWidth / (values.length * 7)));
  const barWidth = Math.max(2, (chartWidth - gap * (values.length - 1)) / values.length);

  const compare = new Set(state.compare);
  const swap = new Set(state.swap);
  const sorted = new Set(state.sorted);
  const active = new Set(state.active);

  for (let i = 0; i < values.length; i += 1) {
    const value = values[i];
    const normalized = value / maxValue;
    const baseHeight = Math.max(4, normalized * chartHeight);
    const pulse = (Math.sin(timeMs / 180 + i * 0.45) + 1) * 0.5;
    const x = leftPad + i * (barWidth + gap);
    let barHeight = baseHeight;
    let y = topPad + (chartHeight - baseHeight);

    let from = '#38bdf8';
    let to = '#0ea5e9';
    let stroke = 'rgba(125,211,252,0.35)';

    if (sorted.has(i)) {
      from = '#16a34a';
      to = '#22c55e';
      stroke = 'rgba(34,197,94,0.55)';
    } else if (i === state.pivot) {
      from = '#fbbf24';
      to = '#f97316';
      stroke = 'rgba(249,115,22,0.55)';
    } else if (swap.has(i)) {
      const lift = 2 + pulse * 5;
      y -= lift;
      barHeight += lift;
      from = '#ef4444';
      to = '#f87171';
      stroke = 'rgba(248,113,113,0.7)';
    } else if (compare.has(i)) {
      const lift = 1 + pulse * 3;
      y -= lift;
      barHeight += lift;
      from = '#facc15';
      to = '#fde047';
      stroke = 'rgba(253,224,71,0.72)';
    } else if (active.has(i)) {
      const lift = pulse * 2;
      y -= lift;
      barHeight += lift;
      from = '#22d3ee';
      to = '#06b6d4';
      stroke = 'rgba(34,211,238,0.62)';
    }

    const gradient = ctx.createLinearGradient(x, y, x, y + barHeight);
    gradient.addColorStop(0, from);
    gradient.addColorStop(1, to);

    ctx.fillStyle = gradient;
    drawRoundedRect(ctx, x, y, barWidth, barHeight, Math.min(8, barWidth / 2));
    ctx.fill();

    const gloss = ctx.createLinearGradient(x, y, x, y + barHeight);
    gloss.addColorStop(0, 'rgba(255,255,255,0.26)');
    gloss.addColorStop(0.35, 'rgba(255,255,255,0.08)');
    gloss.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gloss;
    drawRoundedRect(ctx, x, y, barWidth, barHeight * 0.55, Math.min(8, barWidth / 2));
    ctx.fill();

    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    drawRoundedRect(ctx, x, y, barWidth, barHeight, Math.min(8, barWidth / 2));
    ctx.stroke();

    if (values.length <= 40) {
      ctx.fillStyle = palette.text;
      ctx.font = '10px "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(state.labels?.[i] ?? String(Math.round(value)), x + barWidth / 2, Math.max(12, y - 4));
    }
  }

  const legendItems = [
    ['compare', '#facc15'],
    ['swap', '#ef4444'],
    ['sorted', '#22c55e'],
  ] as const;

  let legendX = leftPad;
  const legendY = 14;
  for (const [label, color] of legendItems) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(legendX + 5, legendY, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = palette.muted;
    ctx.font = '11px "JetBrains Mono", ui-monospace, monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, legendX + 13, legendY);
    legendX += 68;
  }
};

const drawArray = (ctx: CanvasRenderingContext2D, width: number, height: number, state: ArrayVisualState, palette: Palette) => {
  const values = state.values;
  if (values.length === 0) {
    return;
  }

  const cellCount = values.length;
  const rowWidth = width - 40;
  const cellWidth = Math.max(18, Math.min(58, rowWidth / cellCount));
  const totalWidth = cellWidth * cellCount;
  const startX = (width - totalWidth) / 2;
  const y = height * 0.45;

  const active = new Set(state.active);

  for (let i = 0; i < values.length; i += 1) {
    const x = startX + i * cellWidth;
    const isInRange = state.range ? i >= state.range[0] && i <= state.range[1] : false;

    let fill = palette.node;
    if (isInRange) {
      fill = '#2563eb';
    }
    if (active.has(i)) {
      fill = palette.warn;
    }
    if (state.found === i) {
      fill = palette.good;
    }

    ctx.fillStyle = fill;
    drawRoundedRect(ctx, x + 2, y, cellWidth - 4, 54, 10);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '600 14px "JetBrains Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(values[i]), x + cellWidth / 2, y + 27);

    ctx.fillStyle = palette.muted;
    ctx.font = '11px "JetBrains Mono", ui-monospace, monospace';
    ctx.fillText(String(i), x + cellWidth / 2, y + 68);
  }
};

const drawGraph = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: GraphVisualState,
  palette: Palette,
  timeMs: number,
) => {
  const marginX = 30;
  const marginY = 26;
  const point = (x: number, y: number): [number, number] => [
    marginX + x * (width - marginX * 2),
    marginY + y * (height - marginY * 2),
  ];
  const edgeKey = (from: string, to: string): string => `${from}|${to}`;

  const active = new Set(state.activeNodes);
  const visited = new Set(state.visitedNodes);
  const frontier = new Set(state.frontierNodes);
  const path = new Set(state.pathNodes);

  const activeEdges = new Set<string>();
  for (const [from, to] of state.activeEdges) {
    activeEdges.add(edgeKey(from, to));
    activeEdges.add(edgeKey(to, from));
  }

  const pathEdges = new Set<string>();
  for (let i = 0; i < state.pathNodes.length - 1; i += 1) {
    const from = state.pathNodes[i];
    const to = state.pathNodes[i + 1];
    pathEdges.add(edgeKey(from, to));
    pathEdges.add(edgeKey(to, from));
  }

  const visitOrder = new Map<string, number>();
  for (let i = 0; i < state.visitOrder.length; i += 1) {
    visitOrder.set(state.visitOrder[i], i + 1);
  }

  const nodeMap = new Map(state.nodes.map((node) => [node.id, node]));

  for (const edge of state.edges) {
    const fromNode = nodeMap.get(edge.from);
    const toNode = nodeMap.get(edge.to);
    if (!fromNode || !toNode) {
      continue;
    }

    const [x1, y1] = point(fromNode.x, fromNode.y);
    const [x2, y2] = point(toNode.x, toNode.y);
    const isPath = pathEdges.has(edgeKey(edge.from, edge.to));
    const isActiveEdge = activeEdges.has(edgeKey(edge.from, edge.to));

    ctx.save();
    ctx.lineCap = 'round';
    ctx.strokeStyle = isPath ? '#22c55e' : isActiveEdge ? '#facc15' : palette.edge;
    ctx.lineWidth = isPath ? 3.2 : isActiveEdge ? 2.8 : 2;

    if (isActiveEdge) {
      ctx.setLineDash([7, 6]);
      ctx.lineDashOffset = -(timeMs / 28) % 13;
    }

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();

    if (edge.directed) {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const toArrowX = x2 - Math.cos(angle) * 20;
      const toArrowY = y2 - Math.sin(angle) * 20;
      ctx.fillStyle = isPath ? '#22c55e' : isActiveEdge ? '#facc15' : palette.edge;
      drawArrowHead(ctx, x1, y1, toArrowX, toArrowY, 8);
    }

    if (isActiveEdge) {
      const travel = edge.directed ? (timeMs % 850) / 850 : 0.2 + 0.6 * (Math.sin(timeMs / 420) + 1) * 0.5;
      const tx = x1 + (x2 - x1) * travel;
      const ty = y1 + (y2 - y1) * travel;
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(tx, ty, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    if (edge.weight != null) {
      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      ctx.fillStyle = 'rgba(2,6,23,0.55)';
      drawRoundedRect(ctx, mx - 10, my - 11, 20, 16, 6);
      ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '10px "JetBrains Mono", ui-monospace, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(edge.weight), mx, my - 2.5);
    }
  }

  for (const node of state.nodes) {
    const [x, y] = point(node.x, node.y);

    let fill = palette.node;
    if (visited.has(node.id)) {
      fill = '#4f46e5';
    }
    if (frontier.has(node.id)) {
      fill = '#f59e0b';
    }
    if (path.has(node.id)) {
      fill = palette.good;
    }
    if (active.has(node.id)) {
      fill = '#facc15';
    }

    if (active.has(node.id)) {
      const pulse = (Math.sin(timeMs / 150) + 1) * 0.5;
      ctx.fillStyle = 'rgba(250,204,21,0.25)';
      ctx.beginPath();
      ctx.arc(x, y, 24 + pulse * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(x, y, 18, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.beginPath();
    ctx.arc(x - 5, y - 6, 4.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '700 13px "JetBrains Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.label ?? node.id, x, y + 0.5);

    const rank = visitOrder.get(node.id);
    if (rank != null) {
      ctx.fillStyle = 'rgba(15,23,42,0.85)';
      drawRoundedRect(ctx, x + 11, y - 24, 16, 14, 6);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.font = '700 9px "JetBrains Mono", ui-monospace, monospace';
      ctx.fillText(String(rank), x + 19, y - 17);
    }
  }
};

const drawTree = (ctx: CanvasRenderingContext2D, width: number, height: number, state: TreeVisualState, palette: Palette) => {
  const active = new Set(state.activeNodes);
  const visited = new Set(state.visitedNodes);

  for (const node of state.nodes) {
    if (!node.parentId) {
      continue;
    }
    const parent = state.nodes.find((candidate) => candidate.id === node.parentId);
    if (!parent) {
      continue;
    }

    ctx.strokeStyle = palette.edge;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(parent.x * width, parent.y * height);
    ctx.lineTo(node.x * width, node.y * height);
    ctx.stroke();
  }

  for (const node of state.nodes) {
    const x = node.x * width;
    const y = node.y * height;

    let fill = palette.node;
    if (visited.has(node.id)) {
      fill = '#4f46e5';
    }
    if (active.has(node.id)) {
      fill = palette.warn;
    }

    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(x, y, 19, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '700 12px "JetBrains Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.value, x, y + 0.5);
  }
};

const drawHash = (ctx: CanvasRenderingContext2D, width: number, height: number, state: HashVisualState, palette: Palette) => {
  const rowHeight = Math.min(52, (height - 40) / state.buckets.length);
  const startX = 24;
  const labelWidth = 42;

  for (let i = 0; i < state.buckets.length; i += 1) {
    const y = 16 + i * rowHeight;

    ctx.fillStyle = i === state.activeBucket ? palette.warn : palette.edge;
    drawRoundedRect(ctx, startX, y, labelWidth, rowHeight - 8, 8);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 12px "JetBrains Mono", ui-monospace, monospace';
    ctx.fillText(String(i), startX + labelWidth / 2, y + (rowHeight - 8) / 2);

    const bucketText = state.buckets[i].join(' | ');
    ctx.fillStyle = palette.text;
    drawRoundedRect(ctx, startX + labelWidth + 8, y, width - startX - labelWidth - 32, rowHeight - 8, 8);
    ctx.fillStyle = i === state.activeBucket ? 'rgba(56,189,248,0.16)' : 'rgba(148,163,184,0.14)';
    ctx.fill();

    ctx.fillStyle = palette.text;
    ctx.textAlign = 'left';
    ctx.font = '12px "JetBrains Mono", ui-monospace, monospace';
    ctx.fillText(bucketText || '∅', startX + labelWidth + 18, y + (rowHeight - 8) / 2 + 1);
  }
};

const drawLinkedList = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: LinkedListVisualState,
  palette: Palette,
) => {
  const n = state.nodes.length;
  if (n === 0) {
    return;
  }

  const boxWidth = Math.min(84, (width - 40) / Math.max(n, 1) - 12);
  const gap = 18;
  const totalWidth = n * boxWidth + (n - 1) * gap;
  const startX = (width - totalWidth) / 2;
  const y = height * 0.42;

  for (let i = 0; i < n; i += 1) {
    const x = startX + i * (boxWidth + gap);
    const fill = i === state.active ? palette.warn : palette.node;

    ctx.fillStyle = fill;
    drawRoundedRect(ctx, x, y, boxWidth, 48, 10);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '700 14px "JetBrains Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.nodes[i], x + boxWidth / 2, y + 24);

    if (i < n - 1) {
      const startArrow = x + boxWidth + 4;
      const endArrow = startArrow + gap - 8;
      ctx.strokeStyle = palette.edge;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(startArrow, y + 24);
      ctx.lineTo(endArrow, y + 24);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(endArrow - 5, y + 19);
      ctx.lineTo(endArrow, y + 24);
      ctx.lineTo(endArrow - 5, y + 29);
      ctx.stroke();
    }
  }

  if (state.pointer != null) {
    const px = startX + state.pointer * (boxWidth + gap) + boxWidth / 2;
    ctx.fillStyle = palette.warn;
    ctx.font = '11px "JetBrains Mono", ui-monospace, monospace';
    ctx.fillText('ptr', px, y - 10);
  }
};

const drawStack = (ctx: CanvasRenderingContext2D, width: number, height: number, state: StackVisualState, palette: Palette) => {
  const itemHeight = 34;
  const boxWidth = Math.min(180, width - 64);
  const x = (width - boxWidth) / 2;
  const startY = height - 24 - state.items.length * itemHeight;

  for (let i = 0; i < state.items.length; i += 1) {
    const y = startY + i * itemHeight;
    const isActive = i === state.activeIndex;
    ctx.fillStyle = isActive ? palette.warn : palette.node;
    drawRoundedRect(ctx, x, y, boxWidth, itemHeight - 4, 8);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '700 13px "JetBrains Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.items[i], x + boxWidth / 2, y + (itemHeight - 4) / 2);
  }

  ctx.fillStyle = palette.muted;
  ctx.font = '12px "JetBrains Mono", ui-monospace, monospace';
  ctx.fillText('top', x + boxWidth + 24, Math.max(20, startY + 12));
};

const drawQueue = (ctx: CanvasRenderingContext2D, width: number, height: number, state: QueueVisualState, palette: Palette) => {
  const n = Math.max(state.items.length, 1);
  const boxWidth = Math.min(90, (width - 60) / n - 8);
  const gap = 8;
  const totalWidth = state.items.length * boxWidth + Math.max(0, state.items.length - 1) * gap;
  const startX = (width - totalWidth) / 2;
  const y = height * 0.45;

  for (let i = 0; i < state.items.length; i += 1) {
    const x = startX + i * (boxWidth + gap);
    const isActive = i === state.activeIndex;

    ctx.fillStyle = isActive ? palette.warn : palette.node;
    drawRoundedRect(ctx, x, y, boxWidth, 46, 8);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '700 13px "JetBrains Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(state.items[i], x + boxWidth / 2, y + 23);
  }

  if (state.items.length > 0) {
    ctx.fillStyle = palette.muted;
    ctx.font = '11px "JetBrains Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('front', startX + boxWidth / 2, y - 10);
    ctx.fillText('back', startX + totalWidth - boxWidth / 2, y - 10);
  }
};

const drawTrie = (ctx: CanvasRenderingContext2D, width: number, height: number, state: TrieVisualState, palette: Palette) => {
  const active = new Set(state.activeNodes);

  for (const node of state.nodes) {
    if (!node.parentId) {
      continue;
    }

    const parent = state.nodes.find((candidate) => candidate.id === node.parentId);
    if (!parent) {
      continue;
    }

    ctx.strokeStyle = palette.edge;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(parent.x * width, parent.y * height);
    ctx.lineTo(node.x * width, node.y * height);
    ctx.stroke();
  }

  for (const node of state.nodes) {
    const x = node.x * width;
    const y = node.y * height;

    let fill = node.terminal ? palette.good : palette.node;
    if (active.has(node.id)) {
      fill = palette.warn;
    }

    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '700 12px "JetBrains Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.value, x, y + 0.5);
  }

  ctx.fillStyle = palette.muted;
  ctx.font = '12px "JetBrains Mono", ui-monospace, monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`word: ${state.currentWord || '-'}`, 16, height - 14);
};

const drawUnionFind = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  state: UnionFindVisualState,
  palette: Palette,
) => {
  const n = state.parents.length;
  const cellWidth = Math.min(64, (width - 40) / Math.max(1, n));
  const totalWidth = n * cellWidth;
  const startX = (width - totalWidth) / 2;
  const rowY = height * 0.35;

  const activeSet = new Set<number>(state.activePair ? [state.activePair[0], state.activePair[1]] : []);

  for (let i = 0; i < n; i += 1) {
    const x = startX + i * cellWidth;
    const active = activeSet.has(i);

    ctx.fillStyle = active ? palette.warn : palette.edge;
    drawRoundedRect(ctx, x + 1, rowY, cellWidth - 2, 38, 8);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.font = '700 12px "JetBrains Mono", ui-monospace, monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(i), x + cellWidth / 2, rowY + 19);

    ctx.fillStyle = active ? palette.warn : palette.node;
    drawRoundedRect(ctx, x + 1, rowY + 52, cellWidth - 2, 38, 8);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.fillText(String(state.parents[i]), x + cellWidth / 2, rowY + 71);

    ctx.fillStyle = 'rgba(34,197,94,0.85)';
    drawRoundedRect(ctx, x + 1, rowY + 104, cellWidth - 2, 30, 8);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.fillText(String(state.ranks[i]), x + cellWidth / 2, rowY + 119);
  }

  ctx.fillStyle = palette.muted;
  ctx.font = '11px "JetBrains Mono", ui-monospace, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('index', startX, rowY - 8);
  ctx.fillText('parent', startX, rowY + 44);
  ctx.fillText('rank', startX, rowY + 98);
};

const renderVisual = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  visual: VisualState,
  palette: Palette,
  timeMs: number,
) => {
  switch (visual.kind) {
    case 'bars':
      drawBars(ctx, width, height, visual, palette, timeMs);
      break;
    case 'array':
      drawArray(ctx, width, height, visual, palette);
      break;
    case 'graph':
      drawGraph(ctx, width, height, visual, palette, timeMs);
      break;
    case 'tree':
      drawTree(ctx, width, height, visual, palette);
      break;
    case 'hash':
      drawHash(ctx, width, height, visual, palette);
      break;
    case 'linked-list':
      drawLinkedList(ctx, width, height, visual, palette);
      break;
    case 'stack':
      drawStack(ctx, width, height, visual, palette);
      break;
    case 'queue':
      drawQueue(ctx, width, height, visual, palette);
      break;
    case 'trie':
      drawTrie(ctx, width, height, visual, palette);
      break;
    case 'union-find':
      drawUnionFind(ctx, width, height, visual, palette);
      break;
    default:
      break;
  }
};

const getPalette = (theme: ThemeMode): Palette => {
  if (theme === 'light') {
    return {
      bg: '#f8fbff',
      bg2: '#ecf6ff',
      grid: 'rgba(30,41,59,0.08)',
      text: '#0f172a',
      muted: '#334155',
      edge: 'rgba(51,65,85,0.4)',
      node: '#2563eb',
      accent: '#0ea5e9',
      good: '#16a34a',
      warn: '#f59e0b',
      danger: '#dc2626',
    };
  }

  return {
    bg: '#050b16',
    bg2: '#0b1a2f',
    grid: 'rgba(148,163,184,0.12)',
    text: '#e2e8f0',
    muted: '#94a3b8',
    edge: 'rgba(148,163,184,0.35)',
    node: '#1d4ed8',
    accent: '#22d3ee',
    good: '#22c55e',
    warn: '#f59e0b',
    danger: '#ef4444',
  };
};

export const CanvasStage = ({ step, speed, theme }: CanvasStageProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const transitionRef = useRef({
    from: step,
    to: step,
    start: performance.now(),
    duration: 260,
    progress: 1,
  });

  useEffect(() => {
    const transition = transitionRef.current;
    transition.from = transition.to;
    transition.to = step;
    transition.start = performance.now();
    transition.progress = 0;
    transition.duration = Math.max(80, 220 / speed);
  }, [step, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) {
      return;
    }

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * ratio);
      canvas.height = Math.floor(rect.height * ratio);
      canvas.style.width = `${Math.floor(rect.width)}px`;
      canvas.style.height = `${Math.floor(rect.height)}px`;
    };

    const observer = new ResizeObserver(resize);

    observer.observe(container);
    resize();
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    const palette = getPalette(theme);
    let rafId = 0;

    const paint = (time: number) => {
      const ratio = window.devicePixelRatio || 1;
      const width = canvas.width / ratio;
      const height = canvas.height / ratio;

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      drawBackground(ctx, width, height, palette);

      const transition = transitionRef.current;
      if (transition.progress < 1) {
        const raw = Math.min(1, (time - transition.start) / transition.duration);
        transition.progress = easeOutQuint(raw);
      }

      const eased = easeInOutCubic(transition.progress);
      const renderedStep = interpolateStep(transition.from, transition.to, eased);
      renderVisual(ctx, width, height, renderedStep.visual, palette, time);

      rafId = requestAnimationFrame(paint);
    };

    rafId = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(rafId);
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="relative h-[46vh] min-h-[320px] w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-[var(--shadow)]"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
};
