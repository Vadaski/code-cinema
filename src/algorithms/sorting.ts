import type { AlgorithmDefinition, AlgorithmStep } from '../types';
import { barsVisual, createSampleNumbers, rainbowGradient } from './common';

const bubbleSortSource = [
  'function bubbleSort(arr) {',
  '  for (let i = 0; i < arr.length; i++) {',
  '    for (let j = 0; j < arr.length - i - 1; j++) {',
  '      if (arr[j] > arr[j + 1]) {',
  '        swap(arr, j, j + 1);',
  '      }',
  '    }',
  '  }',
  '}',
];

const quickSortSource = [
  'function quickSort(arr, low, high) {',
  '  if (low >= high) return;',
  '  const pivot = partition(arr, low, high);',
  '  quickSort(arr, low, pivot - 1);',
  '  quickSort(arr, pivot + 1, high);',
  '}',
  'function partition(arr, low, high) {',
  '  const pivot = arr[high];',
  '  let i = low;',
  '  for (let j = low; j < high; j++) {',
  '    if (arr[j] <= pivot) swap(arr, i++, j);',
  '  }',
  '  swap(arr, i, high);',
  '  return i;',
  '}',
];

const mergeSortSource = [
  'function mergeSort(arr, left, right) {',
  '  if (left >= right) return;',
  '  const mid = Math.floor((left + right) / 2);',
  '  mergeSort(arr, left, mid);',
  '  mergeSort(arr, mid + 1, right);',
  '  merge(arr, left, mid, right);',
  '}',
];

const insertionSortSource = [
  'function insertionSort(arr) {',
  '  for (let i = 1; i < arr.length; i++) {',
  '    let key = arr[i];',
  '    let j = i - 1;',
  '    while (j >= 0 && arr[j] > key) {',
  '      arr[j + 1] = arr[j];',
  '      j--;',
  '    }',
  '    arr[j + 1] = key;',
  '  }',
  '}',
];

const selectionSortSource = [
  'function selectionSort(arr) {',
  '  for (let i = 0; i < arr.length; i++) {',
  '    let min = i;',
  '    for (let j = i + 1; j < arr.length; j++) {',
  '      if (arr[j] < arr[min]) min = j;',
  '    }',
  '    swap(arr, i, min);',
  '  }',
  '}',
];

const heapSortSource = [
  'function heapSort(arr) {',
  '  buildMaxHeap(arr);',
  '  for (let end = arr.length - 1; end > 0; end--) {',
  '    swap(arr, 0, end);',
  '    siftDown(arr, 0, end);',
  '  }',
  '}',
];

const radixSortSource = [
  'function radixSort(arr) {',
  '  const max = Math.max(...arr);',
  '  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {',
  '    countingByDigit(arr, exp);',
  '  }',
  '}',
];

const countingSortSource = [
  'function countingSort(arr) {',
  '  const count = new Array(max + 1).fill(0);',
  '  for (const value of arr) count[value]++;',
  '  for (let i = 1; i < count.length; i++) count[i] += count[i - 1];',
  '  for (let i = arr.length - 1; i >= 0; i--) output[--count[arr[i]]] = arr[i];',
  '}',
];

const bubbleSortGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const arr = createSampleNumbers(28, 12);
  const sorted = new Set<number>();
  const stack = ['bubbleSort(arr)'];

  yield {
    line: 1,
    variables: { n: arr.length },
    callStack: [...stack],
    visual: barsVisual(arr),
    note: 'Initialize bubble sort.',
  };

  for (let i = 0; i < arr.length; i += 1) {
    for (let j = 0; j < arr.length - i - 1; j += 1) {
      yield {
        line: 3,
        variables: { i, j, left: arr[j], right: arr[j + 1] },
        callStack: [...stack],
        visual: barsVisual(arr, { compare: [j, j + 1], sorted: [...sorted], active: [j] }),
      };

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        yield {
          line: 5,
          variables: { i, j, swap: `${j}<->${j + 1}` },
          callStack: [...stack],
          visual: barsVisual(arr, { swap: [j, j + 1], sorted: [...sorted] }),
          note: 'Swap out-of-order pair.',
        };
      }
    }

    sorted.add(arr.length - i - 1);
    yield {
      line: 2,
      variables: { i, sortedTail: arr.length - i - 1 },
      callStack: [...stack],
      visual: barsVisual(arr, { sorted: [...sorted] }),
    };
  }

  yield {
    line: 9,
    variables: { status: 'done' },
    callStack: [...stack],
    visual: barsVisual(arr, { sorted: Array.from({ length: arr.length }, (_, idx) => idx) }),
  };
};

const quickSortGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const arr = createSampleNumbers(36, 99);
  const sorted = new Set<number>();
  const callStack: string[] = [];

  const snapshot = (
    line: number,
    variables: Record<string, string | number>,
    opts?: {
      compare?: number[];
      swap?: number[];
      pivot?: number | null;
      active?: number[];
      note?: string;
    },
  ): AlgorithmStep => ({
    line,
    variables,
    callStack: [...callStack],
    visual: barsVisual(arr, {
      compare: opts?.compare,
      swap: opts?.swap,
      pivot: opts?.pivot,
      active: opts?.active,
      sorted: [...sorted],
    }),
    note: opts?.note,
  });

  function* partition(low: number, high: number): Generator<AlgorithmStep, number, void> {
    callStack.push(`partition(${low},${high})`);

    const pivotValue = arr[high];
    let i = low;

    yield snapshot(
      8,
      { low, high, pivotValue, i },
      { pivot: high, active: [low, high], note: 'Choose rightmost pivot.' },
    );

    for (let j = low; j < high; j += 1) {
      yield snapshot(10, { low, high, i, j, pivotValue }, { compare: [j, high], pivot: high, active: [j] });
      if (arr[j] <= pivotValue) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        yield snapshot(11, { i, j, pivotValue }, { swap: [i, j], pivot: high, note: 'Swap into <= pivot region.' });
        i += 1;
      }
    }

    [arr[i], arr[high]] = [arr[high], arr[i]];
    sorted.add(i);
    yield snapshot(13, { i, high, pivotValue }, { swap: [i, high], pivot: i, note: 'Pivot placed in final index.' });
    callStack.pop();
    return i;
  }

  function* quickSort(low: number, high: number): Generator<AlgorithmStep, void, void> {
    callStack.push(`quickSort(${low},${high})`);
    yield snapshot(1, { low, high }, { active: [low, high] });

    if (low > high) {
      callStack.pop();
      return;
    }

    if (low === high) {
      sorted.add(low);
      yield snapshot(2, { low, high }, { active: [low], note: 'Single item partition.' });
      callStack.pop();
      return;
    }

    const pivotIndex: number = yield* partition(low, high);

    yield snapshot(3, { low, high, pivotIndex }, { pivot: pivotIndex, active: [pivotIndex] });

    yield* quickSort(low, pivotIndex - 1);
    yield* quickSort(pivotIndex + 1, high);

    callStack.pop();
  }

  yield* quickSort(0, arr.length - 1);

  const doneSorted = Array.from({ length: arr.length }, (_, idx) => idx);
  yield {
    line: 5,
    variables: { status: 'done', n: arr.length },
    callStack: ['quickSort(arr,0,n-1)'],
    visual: barsVisual(arr, { sorted: doneSorted }),
    note: 'Quick sort complete.',
  };
};

const mergeSortGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const arr = createSampleNumbers(24, 212);
  const callStack: string[] = [];

  const snapshot = (
    line: number,
    left: number,
    right: number,
    mid: number | null,
    active: number[],
    note?: string,
  ): AlgorithmStep => ({
    line,
    variables: { left, right, mid: mid ?? '-', segmentSize: right - left + 1 },
    callStack: [...callStack],
    visual: barsVisual(arr, { active, compare: mid != null ? [mid] : [] }),
    note,
  });

  function* merge(left: number, mid: number, right: number): Generator<AlgorithmStep, void, void> {
    const leftPart = arr.slice(left, mid + 1);
    const rightPart = arr.slice(mid + 1, right + 1);

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftPart.length && j < rightPart.length) {
      yield snapshot(6, left, right, mid, [k], 'Merge compare.');
      if (leftPart[i] <= rightPart[j]) {
        arr[k] = leftPart[i];
        i += 1;
      } else {
        arr[k] = rightPart[j];
        j += 1;
      }
      k += 1;

      yield snapshot(6, left, right, mid, [k - 1]);
    }

    while (i < leftPart.length) {
      arr[k] = leftPart[i];
      i += 1;
      k += 1;
      yield snapshot(6, left, right, mid, [k - 1]);
    }

    while (j < rightPart.length) {
      arr[k] = rightPart[j];
      j += 1;
      k += 1;
      yield snapshot(6, left, right, mid, [k - 1]);
    }
  }

  function* mergeSort(left: number, right: number): Generator<AlgorithmStep, void, void> {
    callStack.push(`mergeSort(${left},${right})`);
    yield snapshot(1, left, right, null, [left, right]);

    if (left >= right) {
      callStack.pop();
      return;
    }

    const mid = Math.floor((left + right) / 2);
    yield snapshot(3, left, right, mid, [mid], 'Split around midpoint.');

    yield* mergeSort(left, mid);
    yield* mergeSort(mid + 1, right);

    callStack.push(`merge(${left},${mid},${right})`);
    yield* merge(left, mid, right);
    callStack.pop();

    callStack.pop();
  }

  yield* mergeSort(0, arr.length - 1);
  yield {
    line: 7,
    variables: { status: 'done' },
    callStack: ['mergeSort(arr,0,n-1)'],
    visual: barsVisual(arr, { sorted: Array.from({ length: arr.length }, (_, idx) => idx) }),
  };
};

const insertionSortGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const arr = createSampleNumbers(24, 309);
  const stack = ['insertionSort(arr)'];

  yield {
    line: 1,
    variables: { n: arr.length },
    callStack: [...stack],
    visual: barsVisual(arr),
  };

  for (let i = 1; i < arr.length; i += 1) {
    const key = arr[i];
    let j = i - 1;

    yield {
      line: 2,
      variables: { i, key, j },
      callStack: [...stack],
      visual: barsVisual(arr, { active: [i], sorted: Array.from({ length: i }, (_, idx) => idx) }),
    };

    while (j >= 0 && arr[j] > key) {
      yield {
        line: 5,
        variables: { i, j, key, leftValue: arr[j] },
        callStack: [...stack],
        visual: barsVisual(arr, { compare: [j, j + 1], active: [j] }),
      };
      arr[j + 1] = arr[j];
      j -= 1;
      yield {
        line: 6,
        variables: { i, j, key },
        callStack: [...stack],
        visual: barsVisual(arr, { swap: [j + 1, j + 2], active: [j + 1] }),
      };
    }

    arr[j + 1] = key;
    yield {
      line: 8,
      variables: { i, insertAt: j + 1, key },
      callStack: [...stack],
      visual: barsVisual(arr, { active: [j + 1], sorted: Array.from({ length: i + 1 }, (_, idx) => idx) }),
    };
  }

  yield {
    line: 10,
    variables: { status: 'done' },
    callStack: [...stack],
    visual: barsVisual(arr, { sorted: Array.from({ length: arr.length }, (_, idx) => idx) }),
  };
};

const selectionSortGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const arr = createSampleNumbers(24, 410);
  const stack = ['selectionSort(arr)'];
  const sorted = new Set<number>();

  for (let i = 0; i < arr.length; i += 1) {
    let min = i;
    yield {
      line: 2,
      variables: { i, min },
      callStack: [...stack],
      visual: barsVisual(arr, { active: [i], sorted: [...sorted] }),
    };

    for (let j = i + 1; j < arr.length; j += 1) {
      yield {
        line: 4,
        variables: { i, j, min, current: arr[j], minValue: arr[min] },
        callStack: [...stack],
        visual: barsVisual(arr, { compare: [j, min], active: [j], sorted: [...sorted] }),
      };

      if (arr[j] < arr[min]) {
        min = j;
        yield {
          line: 5,
          variables: { i, j, min },
          callStack: [...stack],
          visual: barsVisual(arr, { active: [min], sorted: [...sorted] }),
        };
      }
    }

    [arr[i], arr[min]] = [arr[min], arr[i]];
    sorted.add(i);

    yield {
      line: 7,
      variables: { i, min },
      callStack: [...stack],
      visual: barsVisual(arr, { swap: [i, min], sorted: [...sorted] }),
    };
  }

  yield {
    line: 9,
    variables: { status: 'done' },
    callStack: [...stack],
    visual: barsVisual(arr, { sorted: Array.from({ length: arr.length }, (_, idx) => idx) }),
  };
};

const heapSortGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const arr = createSampleNumbers(24, 515);
  const stack = ['heapSort(arr)'];
  const sorted = new Set<number>();

  const snapshot = (
    line: number,
    end: number,
    root: number,
    compare: number[] = [],
    swap: number[] = [],
    note?: string,
  ): AlgorithmStep => ({
    line,
    variables: { end, root },
    callStack: [...stack],
    visual: barsVisual(arr, { active: [root], compare, swap, sorted: [...sorted] }),
    note,
  });

  function* siftDown(start: number, end: number): Generator<AlgorithmStep, void, void> {
    let root = start;
    while (root * 2 + 1 < end) {
      const left = root * 2 + 1;
      const right = left + 1;
      let largest = root;

      yield snapshot(5, end, root, [largest, left]);

      if (arr[left] > arr[largest]) {
        largest = left;
      }

      if (right < end) {
        yield snapshot(5, end, root, [largest, right]);
        if (arr[right] > arr[largest]) {
          largest = right;
        }
      }

      if (largest === root) {
        return;
      }

      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      yield snapshot(5, end, root, [], [root, largest], 'Sift larger child up.');
      root = largest;
    }
  }

  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i -= 1) {
    yield* siftDown(i, arr.length);
  }

  yield snapshot(2, arr.length, 0, [], [], 'Max heap built.');

  for (let end = arr.length - 1; end > 0; end -= 1) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    sorted.add(end);

    yield snapshot(4, end, 0, [], [0, end]);
    yield* siftDown(0, end);
  }

  sorted.add(0);
  yield {
    line: 7,
    variables: { status: 'done' },
    callStack: [...stack],
    visual: barsVisual(arr, { sorted: Array.from({ length: arr.length }, (_, idx) => idx) }),
  };
};

const radixSortGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const arr = createSampleNumbers(24, 620);
  const stack = ['radixSort(arr)'];
  const max = Math.max(...arr);

  yield {
    line: 2,
    variables: { max },
    callStack: [...stack],
    visual: barsVisual(arr),
  };

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    const output = new Array(arr.length).fill(0);
    const count = new Array(10).fill(0);

    for (let i = 0; i < arr.length; i += 1) {
      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit] += 1;
      yield {
        line: 3,
        variables: { exp, i, digit, phase: 'count' },
        callStack: [...stack],
        visual: barsVisual(arr, { active: [i] }),
      };
    }

    for (let i = 1; i < 10; i += 1) {
      count[i] += count[i - 1];
    }

    for (let i = arr.length - 1; i >= 0; i -= 1) {
      const digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit] -= 1;
    }

    for (let i = 0; i < arr.length; i += 1) {
      arr[i] = output[i];
      yield {
        line: 4,
        variables: { exp, i, phase: 'rewrite' },
        callStack: [...stack],
        visual: barsVisual(arr, { active: [i], sorted: exp >= 100 ? Array.from({ length: arr.length }, (_, idx) => idx) : [] }),
      };
    }
  }

  yield {
    line: 6,
    variables: { status: 'done' },
    callStack: [...stack],
    visual: barsVisual(arr, { sorted: Array.from({ length: arr.length }, (_, idx) => idx) }),
  };
};

const countingSortGenerator = function* (): Generator<AlgorithmStep, void, void> {
  const base = createSampleNumbers(26, 725).map((value) => value % 20);
  const arr = [...base];
  const stack = ['countingSort(arr)'];
  const max = Math.max(...arr);
  const count = new Array(max + 1).fill(0);

  yield {
    line: 2,
    variables: { max },
    callStack: [...stack],
    visual: barsVisual(arr, { labels: arr.map((value) => String(value)) }),
  };

  for (let i = 0; i < arr.length; i += 1) {
    count[arr[i]] += 1;
    yield {
      line: 3,
      variables: { i, value: arr[i], frequency: count[arr[i]] },
      callStack: [...stack],
      visual: barsVisual(arr, { active: [i], labels: arr.map((value) => String(value)) }),
    };
  }

  for (let i = 1; i < count.length; i += 1) {
    count[i] += count[i - 1];
    yield {
      line: 4,
      variables: { i, prefix: count[i] },
      callStack: [...stack],
      visual: barsVisual(arr, { active: [Math.min(i, arr.length - 1)] }),
    };
  }

  const output = new Array(arr.length).fill(0);
  for (let i = arr.length - 1; i >= 0; i -= 1) {
    output[count[arr[i]] - 1] = arr[i];
    count[arr[i]] -= 1;
    yield {
      line: 5,
      variables: { i, value: arr[i] },
      callStack: [...stack],
      visual: barsVisual(output.map((value) => value ?? 0), { active: [Math.max(count[arr[i]], 0)] }),
    };
  }

  for (let i = 0; i < arr.length; i += 1) {
    arr[i] = output[i];
  }

  yield {
    line: 6,
    variables: { status: 'done' },
    callStack: [...stack],
    visual: barsVisual(arr, { sorted: Array.from({ length: arr.length }, (_, idx) => idx) }),
  };
};

export const sortingAlgorithms: AlgorithmDefinition[] = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    group: 'Sorting',
    summary: 'Repeated adjacent swaps with tail locking.',
    source: bubbleSortSource,
    thumbnailGradient: rainbowGradient(0),
    thumbnailGlyph: '⬌',
    createGenerator: bubbleSortGenerator,
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    group: 'Sorting',
    summary: 'Recursive partitioning around pivot.',
    source: quickSortSource,
    thumbnailGradient: rainbowGradient(1),
    thumbnailGlyph: '⚡',
    createGenerator: quickSortGenerator,
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    group: 'Sorting',
    summary: 'Divide-and-conquer stable merge pipeline.',
    source: mergeSortSource,
    thumbnailGradient: rainbowGradient(2),
    thumbnailGlyph: '⇵',
    createGenerator: mergeSortGenerator,
  },
  {
    id: 'heap-sort',
    name: 'Heap Sort',
    group: 'Sorting',
    summary: 'Max-heap extraction with sift-down.',
    source: heapSortSource,
    thumbnailGradient: rainbowGradient(3),
    thumbnailGlyph: '▲',
    createGenerator: heapSortGenerator,
  },
  {
    id: 'insertion-sort',
    name: 'Insertion Sort',
    group: 'Sorting',
    summary: 'Grow sorted prefix by local insertion.',
    source: insertionSortSource,
    thumbnailGradient: rainbowGradient(4),
    thumbnailGlyph: '↳',
    createGenerator: insertionSortGenerator,
  },
  {
    id: 'selection-sort',
    name: 'Selection Sort',
    group: 'Sorting',
    summary: 'Select minimum from suffix each round.',
    source: selectionSortSource,
    thumbnailGradient: rainbowGradient(5),
    thumbnailGlyph: '◎',
    createGenerator: selectionSortGenerator,
  },
  {
    id: 'radix-sort',
    name: 'Radix Sort',
    group: 'Sorting',
    summary: 'Digit-wise stable counting passes.',
    source: radixSortSource,
    thumbnailGradient: rainbowGradient(6),
    thumbnailGlyph: '𝟣𝟢',
    createGenerator: radixSortGenerator,
  },
  {
    id: 'counting-sort',
    name: 'Counting Sort',
    group: 'Sorting',
    summary: 'Frequency table then prefix placement.',
    source: countingSortSource,
    thumbnailGradient: rainbowGradient(7),
    thumbnailGlyph: '#',
    createGenerator: countingSortGenerator,
  },
];
