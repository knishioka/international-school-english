import { useMemo, useCallback, useState } from 'react';
import { shuffleArrayWithSeed, getHourlyShuffleSeed } from '@/utils/arrayUtils';

/**
 * シード生成のタイプ
 */
export type SeedType = 'hourly' | 'daily' | 'random' | 'fixed';

/**
 * useShuffleのオプション
 */
export interface UseShuffleOptions {
  /** シードのタイプ（デフォルト: 'hourly'） */
  seedType?: SeedType;
  /** 固定シード値（seedType='fixed'の場合に使用） */
  fixedSeed?: number;
}

/**
 * useShuffleの戻り値
 */
export interface UseShuffleReturn<T> {
  /** シャッフルされた配列 */
  shuffledItems: T[];
  /** 現在のシード値 */
  currentSeed: number;
  /** 新しいシードで再シャッフルする */
  reshuffle: () => void;
  /** 特定のシードでシャッフルする */
  shuffleWithSeed: (seed: number) => void;
}

/**
 * 日付ベースのシード値を生成する（1日ごとに変化）
 */
export function getDailyShuffleSeed(): number {
  return Math.floor(Date.now() / (1000 * 60 * 60 * 24));
}

/**
 * ランダムなシード値を生成する
 */
export function getRandomSeed(): number {
  return Math.floor(Math.random() * 1000000);
}

/**
 * シードタイプに基づいてシード値を取得する
 */
function getSeedByType(seedType: SeedType, fixedSeed?: number): number {
  switch (seedType) {
    case 'hourly':
      return getHourlyShuffleSeed();
    case 'daily':
      return getDailyShuffleSeed();
    case 'random':
      return getRandomSeed();
    case 'fixed':
      return fixedSeed ?? 0;
    default:
      return getHourlyShuffleSeed();
  }
}

/**
 * 配列をシャッフルするカスタムフック
 *
 * @example
 * ```tsx
 * // 1時間ごとに同じ順序になるシャッフル
 * const { shuffledItems } = useShuffle(vocabularyWords, { seedType: 'hourly' });
 *
 * // 固定シードでのシャッフル（テスト用）
 * const { shuffledItems } = useShuffle(items, {
 *   seedType: 'fixed',
 *   fixedSeed: 12345,
 * });
 *
 * // 手動で再シャッフル
 * const { shuffledItems, reshuffle } = useShuffle(items);
 * <button onClick={reshuffle}>シャッフル</button>
 * ```
 */
export function useShuffle<T>(items: T[], options: UseShuffleOptions = {}): UseShuffleReturn<T> {
  const { seedType = 'hourly', fixedSeed } = options;

  const [seed, setSeed] = useState(() => getSeedByType(seedType, fixedSeed));

  const shuffledItems = useMemo(() => {
    if (items.length === 0) {
      return [];
    }
    return shuffleArrayWithSeed(items, seed);
  }, [items, seed]);

  const reshuffle = useCallback(() => {
    // reshuffleは常にランダムなシードを使用
    setSeed(getRandomSeed());
  }, []);

  const shuffleWithSeed = useCallback((newSeed: number) => {
    setSeed(newSeed);
  }, []);

  return {
    shuffledItems,
    currentSeed: seed,
    reshuffle,
    shuffleWithSeed,
  };
}
