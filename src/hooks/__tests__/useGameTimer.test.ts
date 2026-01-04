import { renderHook, act } from '@testing-library/react';
import { useGameTimer } from '../useGameTimer';

describe('useGameTimer', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('初期状態', () => {
    it('デフォルトの初期状態が正しく設定される', () => {
      const { result } = renderHook(() => useGameTimer());

      expect(result.current.elapsedTime).toBe(0);
      expect(result.current.remainingTime).toBe(0);
      expect(result.current.isRunning).toBe(false);
      expect(result.current.isTimedOut).toBe(false);
    });

    it('autoStart: trueの場合、開始状態になる', () => {
      const { result } = renderHook(() => useGameTimer({ autoStart: true }));

      expect(result.current.isRunning).toBe(true);
    });

    it('countdownモードでtimeoutを設定すると、remainingTimeが設定される', () => {
      const { result } = renderHook(() => useGameTimer({ timeout: 30000, mode: 'countdown' }));

      expect(result.current.remainingTime).toBe(30000);
    });
  });

  describe('start / stop', () => {
    it('startでタイマーが開始される', () => {
      const { result } = renderHook(() => useGameTimer());

      expect(result.current.isRunning).toBe(false);

      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);
    });

    it('stopでタイマーが停止しリセットされる', () => {
      const { result } = renderHook(() => useGameTimer({ autoStart: true }));

      // 時間を進める
      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.elapsedTime).toBeGreaterThan(0);

      act(() => {
        result.current.stop();
      });

      expect(result.current.isRunning).toBe(false);
      expect(result.current.elapsedTime).toBe(0);
      expect(result.current.isTimedOut).toBe(false);
    });
  });

  describe('pause / resume', () => {
    it('pauseでタイマーが一時停止する', () => {
      const { result } = renderHook(() => useGameTimer({ autoStart: true }));

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      const elapsedBeforePause = result.current.elapsedTime;

      act(() => {
        result.current.pause();
      });

      expect(result.current.isRunning).toBe(false);

      // 一時停止中は時間が進まない
      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.elapsedTime).toBe(elapsedBeforePause);
    });

    it('resumeでタイマーが再開する', () => {
      const { result } = renderHook(() => useGameTimer({ autoStart: true }));

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      act(() => {
        result.current.pause();
      });

      const elapsedAtPause = result.current.elapsedTime;

      act(() => {
        result.current.resume();
      });

      expect(result.current.isRunning).toBe(true);

      act(() => {
        jest.advanceTimersByTime(1000);
      });

      expect(result.current.elapsedTime).toBeGreaterThan(elapsedAtPause);
    });
  });

  describe('reset', () => {
    it('resetでタイマーがリセットされる', () => {
      const { result } = renderHook(() => useGameTimer({ autoStart: true }));

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(result.current.elapsedTime).toBeGreaterThan(0);

      act(() => {
        result.current.reset();
      });

      expect(result.current.elapsedTime).toBe(0);
      expect(result.current.isTimedOut).toBe(false);
    });
  });

  describe('カウントダウンモード', () => {
    it('remainingTimeが正しく計算される', () => {
      const { result } = renderHook(() =>
        useGameTimer({ timeout: 10000, mode: 'countdown', autoStart: true, interval: 100 }),
      );

      expect(result.current.remainingTime).toBe(10000);

      act(() => {
        jest.advanceTimersByTime(500);
      });

      // remainingTimeは減少する
      expect(result.current.remainingTime).toBeLessThan(10000);
      expect(result.current.remainingTime).toBeGreaterThan(0);
    });

    it('タイムアウト時にonTimeoutが呼ばれる', () => {
      const onTimeout = jest.fn();
      const { result } = renderHook(() =>
        useGameTimer({
          timeout: 1000,
          mode: 'countdown',
          autoStart: true,
          onTimeout,
          interval: 100,
        }),
      );

      expect(onTimeout).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(1200);
      });

      expect(result.current.isTimedOut).toBe(true);
      expect(result.current.isRunning).toBe(false);
      expect(onTimeout).toHaveBeenCalledTimes(1);
    });

    it('タイムアウト後はremainingTimeが0になる', () => {
      const { result } = renderHook(() =>
        useGameTimer({
          timeout: 1000,
          mode: 'countdown',
          autoStart: true,
          interval: 100,
        }),
      );

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(result.current.remainingTime).toBe(0);
    });
  });

  describe('カウントアップモード', () => {
    it('elapsedTimeが増加する', () => {
      const { result } = renderHook(() => useGameTimer({ mode: 'countup', autoStart: true }));

      expect(result.current.elapsedTime).toBe(0);

      act(() => {
        jest.advanceTimersByTime(3000);
      });

      expect(result.current.elapsedTime).toBeGreaterThan(0);
    });

    it('countupモードではタイムアウトしない', () => {
      const onTimeout = jest.fn();
      const { result } = renderHook(() =>
        useGameTimer({
          mode: 'countup',
          autoStart: true,
          onTimeout,
        }),
      );

      act(() => {
        jest.advanceTimersByTime(100000);
      });

      expect(result.current.isTimedOut).toBe(false);
      expect(onTimeout).not.toHaveBeenCalled();
    });
  });

  describe('カスタムinterval', () => {
    it('指定したintervalで更新される', () => {
      const { result } = renderHook(() => useGameTimer({ autoStart: true, interval: 500 }));

      expect(result.current.elapsedTime).toBe(0);

      // 500ms未満では更新されない
      act(() => {
        jest.advanceTimersByTime(400);
      });
      expect(result.current.elapsedTime).toBe(0);

      // 500ms以上で更新される
      act(() => {
        jest.advanceTimersByTime(200);
      });
      expect(result.current.elapsedTime).toBeGreaterThan(0);
    });
  });

  describe('エッジケース', () => {
    it('タイムアウト後にstartしても開始しない', () => {
      const { result } = renderHook(() =>
        useGameTimer({
          timeout: 1000,
          mode: 'countdown',
          autoStart: true,
          interval: 100,
        }),
      );

      act(() => {
        jest.advanceTimersByTime(1500);
      });

      expect(result.current.isTimedOut).toBe(true);

      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(false);
    });

    it('resetするとタイムアウト後もstartできる', () => {
      const { result } = renderHook(() =>
        useGameTimer({
          timeout: 1000,
          mode: 'countdown',
          autoStart: true,
          interval: 100,
        }),
      );

      act(() => {
        jest.advanceTimersByTime(1500);
      });

      expect(result.current.isTimedOut).toBe(true);

      act(() => {
        result.current.reset();
      });

      expect(result.current.isTimedOut).toBe(false);

      act(() => {
        result.current.start();
      });

      expect(result.current.isRunning).toBe(true);
    });
  });
});
