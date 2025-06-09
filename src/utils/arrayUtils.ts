/**
 * シード値を使用して配列をシャッフルする（決定論的）
 * 同じシード値であれば常に同じ順序になる
 */
export function shuffleArrayWithSeed<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  let currentIndex = shuffled.length;

  // シードを使用して疑似ランダム数を生成
  const random = (index: number): number => {
    const x = Math.sin(seed + index) * 10000;
    return x - Math.floor(x);
  };

  while (currentIndex > 0) {
    const randomIndex = Math.floor(random(currentIndex) * currentIndex);
    currentIndex--;
    [shuffled[currentIndex], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[currentIndex],
    ];
  }

  return shuffled;
}

/**
 * 現在の時間に基づいてシャッフル用のシード値を生成
 * 1時間ごとに異なるシード値になる
 */
export function getHourlyShuffleSeed(): number {
  return Math.floor(Date.now() / (1000 * 60 * 60));
}

/**
 * 配列を指定されたページサイズでページ分割する
 */
export function paginateArray<T>(array: T[], pageSize: number, currentPage: number): T[] {
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  return array.slice(startIndex, endIndex);
}

/**
 * カテゴリーでアイテムをフィルタリングする
 */
export function filterByCategory<T extends { category: string }>(
  items: T[],
  category: string,
): T[] {
  if (category === 'all') {
    return items;
  }
  return items.filter((item) => item.category === category);
}
