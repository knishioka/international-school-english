import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * タイマーの動作モード
 */
export type TimerMode = 'countdown' | 'countup';

/**
 * useGameTimerのオプション
 */
export interface UseGameTimerOptions {
  /** タイムアウト時間（ミリ秒） */
  timeout?: number;
  /** タイムアウト時のコールバック */
  onTimeout?: () => void;
  /** タイマーモード（デフォルト: 'countdown'） */
  mode?: TimerMode;
  /** 自動開始するかどうか（デフォルト: false） */
  autoStart?: boolean;
  /** 更新間隔（ミリ秒、デフォルト: 1000） */
  interval?: number;
}

/**
 * useGameTimerの戻り値
 */
export interface UseGameTimerReturn {
  /** 経過時間（ミリ秒） */
  elapsedTime: number;
  /** 残り時間（ミリ秒、countdownモードのみ） */
  remainingTime: number;
  /** タイマーが動作中かどうか */
  isRunning: boolean;
  /** タイムアウトしたかどうか */
  isTimedOut: boolean;
  /** タイマーを開始する */
  start: () => void;
  /** タイマーを一時停止する */
  pause: () => void;
  /** タイマーを再開する */
  resume: () => void;
  /** タイマーをリセットする */
  reset: () => void;
  /** タイマーを停止してリセットする */
  stop: () => void;
}

/**
 * ゲームのタイマー機能を提供するカスタムフック
 *
 * @example
 * ```tsx
 * // カウントダウンタイマー（30秒）
 * const { remainingTime, isTimedOut, start, reset } = useGameTimer({
 *   timeout: 30000,
 *   mode: 'countdown',
 *   onTimeout: () => handleTimeUp(),
 * });
 *
 * // カウントアップタイマー
 * const { elapsedTime, start, pause, resume } = useGameTimer({
 *   mode: 'countup',
 * });
 * ```
 */
export function useGameTimer(options: UseGameTimerOptions = {}): UseGameTimerReturn {
  const {
    timeout = 0,
    onTimeout,
    mode = 'countdown',
    autoStart = false,
    interval = 1000,
  } = options;

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isTimedOut, setIsTimedOut] = useState(false);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(autoStart ? Date.now() : 0);
  const pausedTimeRef = useRef<number>(0);
  const onTimeoutRef = useRef(onTimeout);

  // onTimeoutのrefを更新
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // タイマーの実行
  useEffect(() => {
    if (isRunning && !isTimedOut) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const newElapsed = pausedTimeRef.current + (now - startTimeRef.current);
        setElapsedTime(newElapsed);

        // タイムアウトチェック（countdownモードかつtimeoutが設定されている場合）
        if (mode === 'countdown' && timeout > 0 && newElapsed >= timeout) {
          setIsTimedOut(true);
          setIsRunning(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          onTimeoutRef.current?.();
        }
      }, interval);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isTimedOut, timeout, mode, interval]);

  const start = useCallback(() => {
    if (!isRunning && !isTimedOut) {
      startTimeRef.current = Date.now();
      pausedTimeRef.current = 0;
      setElapsedTime(0);
      setIsRunning(true);
    }
  }, [isRunning, isTimedOut]);

  const pause = useCallback(() => {
    if (isRunning) {
      // Calculate elapsed time directly from refs to avoid stale closure
      const currentElapsed = pausedTimeRef.current + (Date.now() - startTimeRef.current);
      pausedTimeRef.current = currentElapsed;
      setElapsedTime(currentElapsed); // Update state immediately for UI sync
      setIsRunning(false);
    }
  }, [isRunning]);

  const resume = useCallback(() => {
    if (!isRunning && !isTimedOut) {
      startTimeRef.current = Date.now();
      setIsRunning(true);
    }
  }, [isRunning, isTimedOut]);

  const reset = useCallback(() => {
    setElapsedTime(0);
    setIsTimedOut(false);
    pausedTimeRef.current = 0;
    startTimeRef.current = Date.now();
  }, []);

  const stop = useCallback(() => {
    setIsRunning(false);
    setElapsedTime(0);
    setIsTimedOut(false);
    pausedTimeRef.current = 0;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const remainingTime =
    mode === 'countdown' && timeout > 0 ? Math.max(0, timeout - elapsedTime) : 0;

  return {
    elapsedTime,
    remainingTime,
    isRunning,
    isTimedOut,
    start,
    pause,
    resume,
    reset,
    stop,
  };
}
