import { renderHook, act } from '@testing-library/react';
import { useGameProgress } from '../useGameProgress';

describe('useGameProgress', () => {
  describe('初期状態', () => {
    it('totalItems: 10の場合、初期状態が正しく設定される', () => {
      const { result } = renderHook(() => useGameProgress({ totalItems: 10 }));

      expect(result.current.state.currentIndex).toBe(0);
      expect(result.current.state.score).toBe(0);
      expect(result.current.state.gameStarted).toBe(false);
      expect(result.current.state.gameCompleted).toBe(false);
      expect(result.current.progress).toBe(10); // (0 + 1) / 10 * 100 = 10%
      expect(result.current.isFirst).toBe(true);
      expect(result.current.isLast).toBe(false);
      expect(result.current.totalItems).toBe(10);
    });

    it('initialIndexとinitialScoreを指定できる', () => {
      const { result } = renderHook(() =>
        useGameProgress({ totalItems: 10, initialIndex: 5, initialScore: 100 }),
      );

      expect(result.current.state.currentIndex).toBe(5);
      expect(result.current.state.score).toBe(100);
      expect(result.current.progress).toBe(60); // (5 + 1) / 10 * 100 = 60%
    });

    it('totalItems: 0の場合、progress: 0になる', () => {
      const { result } = renderHook(() => useGameProgress({ totalItems: 0 }));

      expect(result.current.progress).toBe(0);
    });
  });

  describe('handleNext', () => {
    it('次のアイテムに進む', () => {
      const { result } = renderHook(() => useGameProgress({ totalItems: 10 }));

      act(() => {
        result.current.handleNext();
      });

      expect(result.current.state.currentIndex).toBe(1);
      expect(result.current.progress).toBe(20); // (1 + 1) / 10 * 100 = 20%
      expect(result.current.isFirst).toBe(false);
    });

    it('最後のアイテムでhandleNextを呼ぶとgameCompletedになる', () => {
      const { result } = renderHook(() => useGameProgress({ totalItems: 3 }));

      // 0 -> 1
      act(() => {
        result.current.handleNext();
      });
      expect(result.current.state.gameCompleted).toBe(false);

      // 1 -> 2 (last item)
      act(() => {
        result.current.handleNext();
      });
      expect(result.current.isLast).toBe(true);
      expect(result.current.state.gameCompleted).toBe(false);

      // 2 -> complete
      act(() => {
        result.current.handleNext();
      });
      expect(result.current.state.gameCompleted).toBe(true);
      expect(result.current.state.currentIndex).toBe(2); // インデックスは変わらない
    });
  });

  describe('handlePrevious', () => {
    it('前のアイテムに戻る', () => {
      const { result } = renderHook(() => useGameProgress({ totalItems: 10, initialIndex: 5 }));

      act(() => {
        result.current.handlePrevious();
      });

      expect(result.current.state.currentIndex).toBe(4);
    });

    it('最初のアイテムでhandlePreviousを呼んでも0のまま', () => {
      const { result } = renderHook(() => useGameProgress({ totalItems: 10 }));

      act(() => {
        result.current.handlePrevious();
      });

      expect(result.current.state.currentIndex).toBe(0);
      expect(result.current.isFirst).toBe(true);
    });
  });

  describe('startGame', () => {
    it('ゲームを開始する', () => {
      const { result } = renderHook(() => useGameProgress({ totalItems: 10 }));

      expect(result.current.state.gameStarted).toBe(false);

      act(() => {
        result.current.startGame();
      });

      expect(result.current.state.gameStarted).toBe(true);
    });
  });

  describe('addScore', () => {
    it('スコアを加算する', () => {
      const { result } = renderHook(() => useGameProgress({ totalItems: 10 }));

      act(() => {
        result.current.addScore(10);
      });

      expect(result.current.state.score).toBe(10);

      act(() => {
        result.current.addScore(25);
      });

      expect(result.current.state.score).toBe(35);
    });

    it('負の値も加算できる', () => {
      const { result } = renderHook(() => useGameProgress({ totalItems: 10, initialScore: 50 }));

      act(() => {
        result.current.addScore(-10);
      });

      expect(result.current.state.score).toBe(40);
    });
  });

  describe('goToIndex', () => {
    it('特定のインデックスに移動する', () => {
      const { result } = renderHook(() => useGameProgress({ totalItems: 10 }));

      act(() => {
        result.current.goToIndex(5);
      });

      expect(result.current.state.currentIndex).toBe(5);
      expect(result.current.progress).toBe(60);
    });

    it('範囲外のインデックスは無視される', () => {
      const { result } = renderHook(() => useGameProgress({ totalItems: 10 }));

      act(() => {
        result.current.goToIndex(15);
      });
      expect(result.current.state.currentIndex).toBe(0);

      act(() => {
        result.current.goToIndex(-1);
      });
      expect(result.current.state.currentIndex).toBe(0);
    });

    it('goToIndexでgameCompletedがリセットされる', () => {
      const { result } = renderHook(() => useGameProgress({ totalItems: 3 }));

      // 完了状態にする
      act(() => {
        result.current.handleNext();
        result.current.handleNext();
        result.current.handleNext();
      });
      expect(result.current.state.gameCompleted).toBe(true);

      // 別のインデックスに移動
      act(() => {
        result.current.goToIndex(0);
      });
      expect(result.current.state.gameCompleted).toBe(false);
    });
  });

  describe('resetGame', () => {
    it('ゲームをリセットする', () => {
      const { result } = renderHook(() => useGameProgress({ totalItems: 10 }));

      // 状態を変更
      act(() => {
        result.current.startGame();
        result.current.handleNext();
        result.current.handleNext();
        result.current.addScore(50);
      });

      expect(result.current.state.currentIndex).toBe(2);
      expect(result.current.state.score).toBe(50);
      expect(result.current.state.gameStarted).toBe(true);

      // リセット
      act(() => {
        result.current.resetGame();
      });

      expect(result.current.state.currentIndex).toBe(0);
      expect(result.current.state.score).toBe(0);
      expect(result.current.state.gameStarted).toBe(false);
      expect(result.current.state.gameCompleted).toBe(false);
    });

    it('initialIndexとinitialScoreにリセットされる', () => {
      const { result } = renderHook(() =>
        useGameProgress({ totalItems: 10, initialIndex: 3, initialScore: 100 }),
      );

      act(() => {
        result.current.handleNext();
        result.current.addScore(50);
      });

      expect(result.current.state.currentIndex).toBe(4);
      expect(result.current.state.score).toBe(150);

      act(() => {
        result.current.resetGame();
      });

      expect(result.current.state.currentIndex).toBe(3);
      expect(result.current.state.score).toBe(100);
    });
  });

  describe('isFirst / isLast', () => {
    it('最初と最後のアイテムを正しく判定する', () => {
      const { result } = renderHook(() => useGameProgress({ totalItems: 3 }));

      // 最初のアイテム
      expect(result.current.isFirst).toBe(true);
      expect(result.current.isLast).toBe(false);

      // 中間のアイテム
      act(() => {
        result.current.handleNext();
      });
      expect(result.current.isFirst).toBe(false);
      expect(result.current.isLast).toBe(false);

      // 最後のアイテム
      act(() => {
        result.current.handleNext();
      });
      expect(result.current.isFirst).toBe(false);
      expect(result.current.isLast).toBe(true);
    });
  });
});
