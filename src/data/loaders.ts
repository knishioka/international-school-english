export type DataLoader<T> = () => Promise<T[]>;

export function createStaticLoader<T>(data: T[]): DataLoader<T> {
  return async () => data;
}

export function loadData<T>(loader: DataLoader<T>): Promise<T[]> {
  return loader();
}

export function filterByCategory<T extends { category: string }>(
  items: T[],
  category: string,
): T[] {
  if (category === 'all') {
    return items;
  }
  return items.filter((item) => item.category === category);
}

export function filterByDifficulty<T extends { difficulty: string }>(
  items: T[],
  difficulty: string,
): T[] {
  return items.filter((item) => item.difficulty === difficulty);
}

export function sortById<T extends { id: string }>(items: T[]): T[] {
  return [...items].sort((left, right) => {
    const leftId = Number(left.id);
    const rightId = Number(right.id);

    if (!Number.isNaN(leftId) && !Number.isNaN(rightId)) {
      return leftId - rightId;
    }

    return left.id.localeCompare(right.id);
  });
}
