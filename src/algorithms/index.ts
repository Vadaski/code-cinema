import type { AlgorithmDefinition } from '../types';
import { materializeSteps } from './common';
import { dataStructureAlgorithms } from './dataStructures';
import { graphAlgorithms } from './graph';
import { sortingAlgorithms } from './sorting';

export const algorithmCatalog: AlgorithmDefinition[] = [
  ...sortingAlgorithms,
  ...graphAlgorithms,
  ...dataStructureAlgorithms,
];

export const algorithmMap = new Map<string, AlgorithmDefinition>(
  algorithmCatalog.map((definition) => [definition.id, definition]),
);

export const getAlgorithmById = (id: string): AlgorithmDefinition => {
  const definition = algorithmMap.get(id);
  if (!definition) {
    return algorithmCatalog[0];
  }
  return definition;
};

export const buildAlgorithmSteps = (definition: AlgorithmDefinition) => materializeSteps(definition);
