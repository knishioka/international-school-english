import { useState, useCallback, useRef, useEffect } from 'react';
import { useAudio } from '@/contexts/AudioContext';

/**
 * フィードバックの種類
 */
export type FeedbackType = 'correct' | 'incorrect' | 'neutral';

/**
 * 効果音の種類
 */
export type SoundEffect = 'success' | 'error' | 'click' | 'complete';

/**
 * useGameFeedbackのオプション
 */
export interface UseGameFeedbackOptions {
  /** 正解時の効果音（デフォルト: 'success'） */
  correctSound?: SoundEffect;
  /** 不正解時の効果音（デフォルト: 'error'） */
  incorrectSound?: SoundEffect;
  /** フィードバック表示時間（ミリ秒、デフォルト: 1500） */
  feedbackDuration?: number;
  /** 効果音を有効にするかどうか（デフォルト: true） */
  soundEnabled?: boolean;
}

/**
 * useGameFeedbackの戻り値
 */
export interface UseGameFeedbackReturn {
  /** 現在のフィードバック状態 */
  feedback: FeedbackType;
  /** 正解かどうか（null = 未判定） */
  isCorrect: boolean | null;
  /** フィードバック表示中かどうか */
  isShowingFeedback: boolean;
  /** 正解フィードバックを表示する */
  showCorrect: () => Promise<void>;
  /** 不正解フィードバックを表示する */
  showIncorrect: () => Promise<void>;
  /** フィードバックをリセットする */
  resetFeedback: () => void;
  /** 効果音を再生する */
  playFeedbackSound: (sound: SoundEffect) => Promise<void>;
  /** クリック音を再生する */
  playClick: () => Promise<void>;
}

/**
 * ゲームのフィードバック（正解/不正解）を管理するカスタムフック
 *
 * @example
 * ```tsx
 * const {
 *   isCorrect,
 *   isShowingFeedback,
 *   showCorrect,
 *   showIncorrect,
 *   resetFeedback,
 *   playClick,
 * } = useGameFeedback({ feedbackDuration: 2000 });
 *
 * const handleAnswer = async (answer: string) => {
 *   if (answer === correctAnswer) {
 *     await showCorrect();
 *   } else {
 *     await showIncorrect();
 *   }
 * };
 *
 * // フィードバック表示
 * {isShowingFeedback && (
 *   <div className={isCorrect ? 'bg-green-500' : 'bg-red-500'}>
 *     {isCorrect ? '正解！' : '残念...'}
 *   </div>
 * )}
 * ```
 */
export function useGameFeedback(options: UseGameFeedbackOptions = {}): UseGameFeedbackReturn {
  const {
    correctSound = 'success',
    incorrectSound = 'error',
    feedbackDuration = 1500,
    soundEnabled = true,
  } = options;

  const [feedback, setFeedback] = useState<FeedbackType>('neutral');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isShowingFeedback, setIsShowingFeedback] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { playSound } = useAudio();

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const playFeedbackSound = useCallback(
    async (sound: SoundEffect) => {
      if (soundEnabled) {
        await playSound(sound);
      }
    },
    [soundEnabled, playSound],
  );

  const playClick = useCallback(async () => {
    await playFeedbackSound('click');
  }, [playFeedbackSound]);

  const showCorrect = useCallback(async () => {
    // 既存のタイムアウトをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setFeedback('correct');
    setIsCorrect(true);
    setIsShowingFeedback(true);
    await playFeedbackSound(correctSound);

    // 指定時間後にフィードバックを終了
    return new Promise<void>((resolve) => {
      timeoutRef.current = setTimeout(() => {
        setIsShowingFeedback(false);
        resolve();
      }, feedbackDuration);
    });
  }, [correctSound, feedbackDuration, playFeedbackSound]);

  const showIncorrect = useCallback(async () => {
    // 既存のタイムアウトをクリア
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setFeedback('incorrect');
    setIsCorrect(false);
    setIsShowingFeedback(true);
    await playFeedbackSound(incorrectSound);

    // 指定時間後にフィードバックを終了
    return new Promise<void>((resolve) => {
      timeoutRef.current = setTimeout(() => {
        setIsShowingFeedback(false);
        resolve();
      }, feedbackDuration);
    });
  }, [incorrectSound, feedbackDuration, playFeedbackSound]);

  const resetFeedback = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setFeedback('neutral');
    setIsCorrect(null);
    setIsShowingFeedback(false);
  }, []);

  return {
    feedback,
    isCorrect,
    isShowingFeedback,
    showCorrect,
    showIncorrect,
    resetFeedback,
    playFeedbackSound,
    playClick,
  };
}
