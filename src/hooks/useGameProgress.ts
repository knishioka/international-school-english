import { useState, useCallback, useMemo } from 'react';

/**
 * ゲームの進捗状態を管理するためのオプション
 */
export interface UseGameProgressOptions {
  /** アイテムの総数 */
  totalItems: number;
  /** 初期インデックス（デフォルト: 0） */
  initialIndex?: number;
  /** 初期スコア（デフォルト: 0） */
  initialScore?: number;
}

/**
 * ゲームの進捗状態
 */
export interface GameProgressState {
  /** 現在のインデックス（0始まり） */
  currentIndex: number;
  /** 現在のスコア */
  score: number;
  /** ゲームが開始されたかどうか */
  gameStarted: boolean;
  /** ゲームが完了したかどうか */
  gameCompleted: boolean;
}

/**
 * useGameProgressの戻り値
 */
export interface UseGameProgressReturn {
  /** 現在の状態 */
  state: GameProgressState;
  /** 次のアイテムに進む */
  handleNext: () => void;
  /** 前のアイテムに戻る */
  handlePrevious: () => void;
  /** ゲームをリセットする */
  resetGame: () => void;
  /** ゲームを開始する */
  startGame: () => void;
  /** スコアを加算する */
  addScore: (points: number) => void;
  /** 特定のインデックスに移動する */
  goToIndex: (index: number) => void;
  /** 最初のアイテムかどうか */
  isFirst: boolean;
  /** 最後のアイテムかどうか */
  isLast: boolean;
  /** 進捗率（パーセント） */
  progress: number;
  /** アイテムの総数 */
  totalItems: number;
}

/**
 * ゲームの進捗状態を管理するカスタムフック
 *
 * @example
 * ```tsx
 * const {
 *   state,
 *   handleNext,
 *   handlePrevious,
 *   progress,
 *   isFirst,
 *   isLast,
 * } = useGameProgress({ totalItems: 10 });
 *
 * // 進捗表示
 * <ProgressBar value={progress} />
 *
 * // ナビゲーション
 * <button onClick={handlePrevious} disabled={isFirst}>前へ</button>
 * <button onClick={handleNext} disabled={isLast}>次へ</button>
 * ```
 */
export function useGameProgress(options: UseGameProgressOptions): UseGameProgressReturn {
  const { totalItems, initialIndex = 0, initialScore = 0 } = options;

  const [state, setState] = useState<GameProgressState>({
    currentIndex: initialIndex,
    score: initialScore,
    gameStarted: false,
    gameCompleted: false,
  });

  const handleNext = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentIndex + 1;
      const isCompleted = nextIndex >= totalItems;
      return {
        ...prev,
        currentIndex: isCompleted ? prev.currentIndex : nextIndex,
        gameCompleted: isCompleted,
      };
    });
  }, [totalItems]);

  const handlePrevious = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.max(0, prev.currentIndex - 1),
    }));
  }, []);

  const resetGame = useCallback(() => {
    setState({
      currentIndex: initialIndex,
      score: initialScore,
      gameStarted: false,
      gameCompleted: false,
    });
  }, [initialIndex, initialScore]);

  const startGame = useCallback(() => {
    setState((prev) => ({
      ...prev,
      gameStarted: true,
    }));
  }, []);

  const addScore = useCallback((points: number) => {
    setState((prev) => ({
      ...prev,
      score: prev.score + points,
    }));
  }, []);

  const goToIndex = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalItems) {
        setState((prev) => ({
          ...prev,
          currentIndex: index,
          gameCompleted: false,
        }));
      }
    },
    [totalItems],
  );

  const isFirst = state.currentIndex === 0;
  const isLast = state.currentIndex === totalItems - 1;
  const progress = useMemo(
    () => (totalItems > 0 ? ((state.currentIndex + 1) / totalItems) * 100 : 0),
    [state.currentIndex, totalItems],
  );

  return {
    state,
    handleNext,
    handlePrevious,
    resetGame,
    startGame,
    addScore,
    goToIndex,
    isFirst,
    isLast,
    progress,
    totalItems,
  };
}
