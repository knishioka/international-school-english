import { renderHook, act } from '@testing-library/react';
import { useShuffle, getDailyShuffleSeed, getRandomSeed } from '../useShuffle';

describe('useShuffle', () => {
  const testItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  describe('基本機能', () => {
    it('配列をシャッフルして返す', () => {
      const { result } = renderHook(() => useShuffle(testItems, { seedType: 'random' }));

      expect(result.current.shuffledItems).toHaveLength(testItems.length);
      // シャッフルされた配列は元の配列と同じ要素を含む
      expect(result.current.shuffledItems.sort()).toEqual([...testItems].sort());
    });

    it('空の配列の場合は空の配列を返す', () => {
      const { result } = renderHook(() => useShuffle([]));

      expect(result.current.shuffledItems).toEqual([]);
    });

    it('currentSeedが返される', () => {
      const { result } = renderHook(() => useShuffle(testItems));

      expect(typeof result.current.currentSeed).toBe('number');
    });
  });

  describe('固定シード', () => {
    it('同じシードで同じ順序になる', () => {
      const { result: result1 } = renderHook(() =>
        useShuffle(testItems, { seedType: 'fixed', fixedSeed: 12345 }),
      );

      const { result: result2 } = renderHook(() =>
        useShuffle(testItems, { seedType: 'fixed', fixedSeed: 12345 }),
      );

      expect(result1.current.shuffledItems).toEqual(result2.current.shuffledItems);
      expect(result1.current.currentSeed).toBe(12345);
    });

    it('異なるシードで異なる順序になる', () => {
      const { result: result1 } = renderHook(() =>
        useShuffle(testItems, { seedType: 'fixed', fixedSeed: 12345 }),
      );

      const { result: result2 } = renderHook(() =>
        useShuffle(testItems, { seedType: 'fixed', fixedSeed: 54321 }),
      );

      // 異なる順序になる可能性が高い
      const isDifferent =
        JSON.stringify(result1.current.shuffledItems) !==
        JSON.stringify(result2.current.shuffledItems);
      expect(isDifferent).toBe(true);
    });
  });

  describe('reshuffle', () => {
    it('reshuffleで新しいシードで再シャッフルされる', () => {
      const { result } = renderHook(() =>
        useShuffle(testItems, { seedType: 'fixed', fixedSeed: 12345 }),
      );

      const originalSeed = result.current.currentSeed;

      act(() => {
        result.current.reshuffle();
      });

      // シードが変わる
      expect(result.current.currentSeed).not.toBe(originalSeed);
      // 順序も変わる可能性が高い（まれに同じになる可能性はある）
      expect(result.current.shuffledItems).toHaveLength(testItems.length);
    });
  });

  describe('shuffleWithSeed', () => {
    it('特定のシードでシャッフルできる', () => {
      const { result } = renderHook(() => useShuffle(testItems, { seedType: 'random' }));

      act(() => {
        result.current.shuffleWithSeed(99999);
      });

      expect(result.current.currentSeed).toBe(99999);

      // 同じシードで別のフックを作成して比較
      const { result: result2 } = renderHook(() =>
        useShuffle(testItems, { seedType: 'fixed', fixedSeed: 99999 }),
      );

      expect(result.current.shuffledItems).toEqual(result2.current.shuffledItems);
    });
  });

  describe('シードタイプ', () => {
    it('hourlyシードがデフォルト', () => {
      const { result } = renderHook(() => useShuffle(testItems));

      // hourlyシードは時間ベースなので、現在の時間に基づいた値
      const expectedSeed = Math.floor(Date.now() / (1000 * 60 * 60));
      expect(result.current.currentSeed).toBe(expectedSeed);
    });

    it('dailyシードが正しく動作する', () => {
      const { result } = renderHook(() => useShuffle(testItems, { seedType: 'daily' }));

      const expectedSeed = getDailyShuffleSeed();
      expect(result.current.currentSeed).toBe(expectedSeed);
    });

    it('randomシードが毎回異なる', () => {
      // randomシードは毎回異なる可能性が高い
      const seed1 = getRandomSeed();
      const seed2 = getRandomSeed();

      // 同じ値になる確率は極めて低い
      expect(seed1).not.toBe(seed2);
    });
  });

  describe('メモ化', () => {
    it('同じitemsとseedで同じ配列インスタンスが返される', () => {
      const { result, rerender } = renderHook(() =>
        useShuffle(testItems, { seedType: 'fixed', fixedSeed: 12345 }),
      );

      const firstResult = result.current.shuffledItems;

      rerender();

      expect(result.current.shuffledItems).toBe(firstResult);
    });

    it('itemsが変わると再シャッフルされる', () => {
      const { result, rerender } = renderHook(
        ({ items }) => useShuffle(items, { seedType: 'fixed', fixedSeed: 12345 }),
        { initialProps: { items: testItems } },
      );

      const firstResult = [...result.current.shuffledItems];

      rerender({ items: [100, 200, 300] });

      expect(result.current.shuffledItems).not.toEqual(firstResult);
      expect(result.current.shuffledItems).toHaveLength(3);
    });
  });
});

describe('ヘルパー関数', () => {
  describe('getDailyShuffleSeed', () => {
    it('日付ベースのシード値を返す', () => {
      const seed = getDailyShuffleSeed();
      const expected = Math.floor(Date.now() / (1000 * 60 * 60 * 24));

      expect(seed).toBe(expected);
    });
  });

  describe('getRandomSeed', () => {
    it('0以上の整数を返す', () => {
      const seed = getRandomSeed();

      expect(Number.isInteger(seed)).toBe(true);
      expect(seed).toBeGreaterThanOrEqual(0);
      expect(seed).toBeLessThan(1000000);
    });
  });
});
