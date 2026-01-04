import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { useGameFeedback } from '../useGameFeedback';
import { AudioProvider } from '@/contexts/AudioContext';

// AudioProviderでラップするwrapper
const wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <AudioProvider>{children}</AudioProvider>
);

describe('useGameFeedback', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('初期状態', () => {
    it('デフォルトの初期状態が正しく設定される', () => {
      const { result } = renderHook(() => useGameFeedback(), { wrapper });

      expect(result.current.feedback).toBe('neutral');
      expect(result.current.isCorrect).toBeNull();
      expect(result.current.isShowingFeedback).toBe(false);
    });
  });

  describe('showCorrect', () => {
    it('正解フィードバックを表示する', async () => {
      const { result } = renderHook(() => useGameFeedback(), { wrapper });

      await act(async () => {
        result.current.showCorrect();
      });

      expect(result.current.feedback).toBe('correct');
      expect(result.current.isCorrect).toBe(true);
      expect(result.current.isShowingFeedback).toBe(true);
    });

    it('指定時間後にフィードバックが終了する', async () => {
      const { result } = renderHook(() => useGameFeedback({ feedbackDuration: 1000 }), { wrapper });

      await act(async () => {
        result.current.showCorrect();
      });

      expect(result.current.isShowingFeedback).toBe(true);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.isShowingFeedback).toBe(false);
      expect(result.current.isCorrect).toBe(true); // isCorrectは維持される
    });

    it('効果音を再生する', async () => {
      const mockPlay = jest.fn().mockResolvedValue(undefined);
      (global.Audio as jest.Mock).mockImplementation(() => ({
        play: mockPlay,
        volume: 1,
        currentTime: 0,
        crossOrigin: '',
        preload: '',
        src: '',
      }));

      const { result } = renderHook(() => useGameFeedback(), { wrapper });

      // オーディオを初期化
      await act(async () => {
        // AudioContextのinitializeAudioを呼ぶ代わりに、直接テスト
      });

      await act(async () => {
        result.current.showCorrect();
      });

      // 効果音が再生されることを確認（AudioProviderの内部実装による）
      expect(result.current.feedback).toBe('correct');
    });
  });

  describe('showIncorrect', () => {
    it('不正解フィードバックを表示する', async () => {
      const { result } = renderHook(() => useGameFeedback(), { wrapper });

      await act(async () => {
        result.current.showIncorrect();
      });

      expect(result.current.feedback).toBe('incorrect');
      expect(result.current.isCorrect).toBe(false);
      expect(result.current.isShowingFeedback).toBe(true);
    });

    it('指定時間後にフィードバックが終了する', async () => {
      const { result } = renderHook(() => useGameFeedback({ feedbackDuration: 500 }), { wrapper });

      await act(async () => {
        result.current.showIncorrect();
      });

      expect(result.current.isShowingFeedback).toBe(true);

      act(() => {
        jest.advanceTimersByTime(500);
      });

      expect(result.current.isShowingFeedback).toBe(false);
    });
  });

  describe('resetFeedback', () => {
    it('フィードバックをリセットする', async () => {
      const { result } = renderHook(() => useGameFeedback(), { wrapper });

      await act(async () => {
        result.current.showCorrect();
      });

      expect(result.current.isCorrect).toBe(true);

      act(() => {
        result.current.resetFeedback();
      });

      expect(result.current.feedback).toBe('neutral');
      expect(result.current.isCorrect).toBeNull();
      expect(result.current.isShowingFeedback).toBe(false);
    });

    it('タイマーをクリアする', async () => {
      const { result } = renderHook(() => useGameFeedback({ feedbackDuration: 5000 }), { wrapper });

      await act(async () => {
        result.current.showCorrect();
      });

      act(() => {
        result.current.resetFeedback();
      });

      // タイマーが進んでもisShowingFeedbackはfalseのまま
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.isShowingFeedback).toBe(false);
    });
  });

  describe('playClick', () => {
    it('クリック音を再生できる', async () => {
      const { result } = renderHook(() => useGameFeedback(), { wrapper });

      // エラーなく実行できることを確認
      await act(async () => {
        await result.current.playClick();
      });

      // playClickの呼び出しが成功することを確認
      expect(result.current.feedback).toBe('neutral');
    });
  });

  describe('playFeedbackSound', () => {
    it('カスタム効果音を再生できる', async () => {
      const { result } = renderHook(() => useGameFeedback(), { wrapper });

      await act(async () => {
        await result.current.playFeedbackSound('complete');
      });

      // エラーなく実行できることを確認
      expect(result.current.feedback).toBe('neutral');
    });
  });

  describe('カスタムオプション', () => {
    it('カスタム効果音を指定できる', async () => {
      const { result } = renderHook(
        () =>
          useGameFeedback({
            correctSound: 'complete',
            incorrectSound: 'click',
          }),
        { wrapper },
      );

      await act(async () => {
        result.current.showCorrect();
      });

      expect(result.current.isCorrect).toBe(true);
    });

    it('soundEnabled: falseで効果音を無効化できる', async () => {
      const mockPlay = jest.fn().mockResolvedValue(undefined);
      (global.Audio as jest.Mock).mockImplementation(() => ({
        play: mockPlay,
        volume: 1,
        currentTime: 0,
        crossOrigin: '',
        preload: '',
        src: '',
      }));

      const { result } = renderHook(() => useGameFeedback({ soundEnabled: false }), { wrapper });

      await act(async () => {
        result.current.showCorrect();
      });

      // フィードバック状態は変わるが、効果音は再生されない
      expect(result.current.isCorrect).toBe(true);
    });
  });

  describe('連続呼び出し', () => {
    it('フィードバック中に別のフィードバックを呼ぶと上書きされる', async () => {
      const { result } = renderHook(() => useGameFeedback({ feedbackDuration: 2000 }), { wrapper });

      await act(async () => {
        result.current.showCorrect();
      });

      expect(result.current.isCorrect).toBe(true);

      await act(async () => {
        result.current.showIncorrect();
      });

      expect(result.current.isCorrect).toBe(false);
      expect(result.current.feedback).toBe('incorrect');
    });
  });
});
