import { useState, useCallback } from 'react';
import type { GameState } from '@/types';

/**
 * ゲーム状態管理の共通ロジックを提供するカスタムフック
 */
export function useGameState<T>(totalItems: number): {
  state: GameState<T>;
  updateState: (updates: Partial<GameState<T>>) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  resetGame: () => void;
  startGame: () => void;
  setCurrentItem: (item: T) => void;
  setCorrect: (correct: boolean) => void;
  addScore: (points: number) => void;
  isFirst: boolean;
  isLast: boolean;
  progress: number;
} {
  const [state, setState] = useState<GameState<T>>({
    currentIndex: 0,
    score: 0,
    gameStarted: false,
    gameCompleted: false,
    currentItem: undefined,
    isCorrect: null,
  });

  const updateState = useCallback((updates: Partial<GameState<T>>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const handleNext = useCallback(() => {
    setState((prev) => {
      const nextIndex = prev.currentIndex + 1;
      return {
        ...prev,
        currentIndex: nextIndex,
        gameCompleted: nextIndex >= totalItems,
        isCorrect: null,
      };
    });
  }, [totalItems]);

  const handlePrevious = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentIndex: Math.max(0, prev.currentIndex - 1),
      isCorrect: null,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setState({
      currentIndex: 0,
      score: 0,
      gameStarted: false,
      gameCompleted: false,
      currentItem: undefined,
      isCorrect: null,
    });
  }, []);

  const startGame = useCallback(() => {
    updateState({ gameStarted: true });
  }, [updateState]);

  const setCurrentItem = useCallback(
    (item: T) => {
      updateState({ currentItem: item });
    },
    [updateState],
  );

  const setCorrect = useCallback(
    (correct: boolean) => {
      updateState({ isCorrect: correct });
    },
    [updateState],
  );

  const addScore = useCallback((points: number) => {
    setState((prev) => ({ ...prev, score: prev.score + points }));
  }, []);

  return {
    state,
    updateState,
    handleNext,
    handlePrevious,
    resetGame,
    startGame,
    setCurrentItem,
    setCorrect,
    addScore,
    // 便利なgetters
    isFirst: state.currentIndex === 0,
    isLast: state.currentIndex === totalItems - 1,
    progress: totalItems > 0 ? ((state.currentIndex + 1) / totalItems) * 100 : 0,
  };
}
