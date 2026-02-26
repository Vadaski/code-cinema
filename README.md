# Code Cinema

Code Cinema is a React + TypeScript + Vite algorithm visualization engine with Canvas 2D rendering, step-wise playback, variable tracking, call stack view, and source-code line highlighting.

## Stack

- React 19
- TypeScript
- Tailwind CSS v4
- Vite
- Canvas 2D renderer

## Features

- 21 pre-built algorithm animations with gallery thumbnails
- Playback controls: play/pause/step-forward/step-backward/reset
- Speed slider: `0.25x` to `4x`
- Variable inspector synced to each yielded step
- Call stack panel
- Source panel with active line highlight
- Dark/light theme toggle
- Smooth easing transitions between generator steps

## Included Algorithms

- Bubble Sort
- Quick Sort
- Merge Sort
- Heap Sort
- Insertion Sort
- Selection Sort
- Radix Sort
- Counting Sort
- Binary Search
- BFS
- DFS
- Dijkstra
- A*
- Topological Sort
- Binary Tree Ops
- Hash Table Ops
- Linked List Ops
- Stack Ops
- Queue Ops
- Trie Ops
- Union-Find

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

## Notes

- Algorithm definitions are implemented as generator functions yielding `AlgorithmStep` snapshots.
- Canvas rendering uses interpolation and easing for smooth transitions.
