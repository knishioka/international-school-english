import { renderHook, act } from '@testing-library/react';
import { AudioProvider, useAudio } from '../AudioContext';

describe('AudioContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('音声を再生できる', async () => {
    const mockPlay = jest.fn().mockResolvedValue(undefined);
    (global.Audio as jest.Mock).mockImplementation(() => ({
      play: mockPlay,
      volume: 1,
      currentTime: 0,
      crossOrigin: '',
      preload: '',
      src: '',
    }));

    const { result } = renderHook(() => useAudio(), {
      wrapper: AudioProvider,
    });

    // First initialize audio to simulate user interaction
    await act(async () => {
      await result.current.initializeAudio();
    });

    await act(async () => {
      await result.current.playSound('click');
    });

    expect(global.Audio).toHaveBeenCalled();
    expect(mockPlay).toHaveBeenCalled();
  });

  it('存在しない音声の場合は何もしない', async () => {
    const { result } = renderHook(() => useAudio(), {
      wrapper: AudioProvider,
    });

    await act(async () => {
      await result.current.playSound('nonexistent');
    });

    expect(global.Audio).not.toHaveBeenCalled();
  });

  it('音声再生エラーを適切に処理する', async () => {
    const mockPlay = jest.fn().mockRejectedValue(new Error('Play failed'));
    (global.Audio as jest.Mock).mockImplementation(() => ({
      play: mockPlay,
      volume: 1,
      currentTime: 0,
      crossOrigin: '',
      preload: '',
      src: '',
    }));

    const { result } = renderHook(() => useAudio(), {
      wrapper: AudioProvider,
    });

    // First initialize audio to simulate user interaction
    await act(async () => {
      await result.current.initializeAudio();
    });

    await act(async () => {
      await result.current.playSound('click');
    });

    // Error is silently caught, so we just verify it doesn't throw
    expect(mockPlay).toHaveBeenCalled();
  });

  it('テキスト読み上げが正しく動作する', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useAudio(), {
      wrapper: AudioProvider,
    });

    act(() => {
      result.current.speak('Hello', 'en');
      jest.runAllTimers();
    });

    expect(global.speechSynthesis.cancel).toHaveBeenCalled();
    expect(global.speechSynthesis.speak).toHaveBeenCalled();
    const mockCalls = (global.speechSynthesis.speak as jest.Mock).mock.calls;
    expect(mockCalls).toHaveLength(1);

    const utterance = mockCalls[0][0];
    expect(utterance).toBeDefined();
    expect(utterance.text).toBe('Hello');
    expect(utterance.lang).toBe('en-US');
    expect(utterance.rate).toBe(0.8);
    expect(utterance.pitch).toBe(1.1);

    jest.useRealTimers();
  });

  it('言語自動検出が正しく動作する', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useAudio(), {
      wrapper: AudioProvider,
    });

    // 英語テキストの自動検出
    act(() => {
      result.current.speak('Hello');
      jest.runAllTimers();
    });

    let mockCalls = (global.speechSynthesis.speak as jest.Mock).mock.calls;
    let utterance = mockCalls[mockCalls.length - 1][0];
    expect(utterance.lang).toBe('en-US');
    expect(utterance.rate).toBe(0.8);
    expect(utterance.pitch).toBe(1.1);

    // 日本語テキストの自動検出
    act(() => {
      result.current.speak('こんにちは');
      jest.runAllTimers();
    });

    mockCalls = (global.speechSynthesis.speak as jest.Mock).mock.calls;
    utterance = mockCalls[mockCalls.length - 1][0];
    expect(utterance.lang).toBe('ja-JP');
    expect(utterance.rate).toBe(0.85);
    expect(utterance.pitch).toBe(1.0);

    jest.useRealTimers();
  });

  it('日本語の読み上げが正しく設定される', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => useAudio(), {
      wrapper: AudioProvider,
    });

    act(() => {
      result.current.speak('こんにちは', 'ja');
      jest.runAllTimers();
    });

    expect(global.speechSynthesis.speak).toHaveBeenCalled();
    const mockCalls = (global.speechSynthesis.speak as jest.Mock).mock.calls;
    const utterance = mockCalls[0][0];
    expect(utterance).toBeDefined();
    expect(utterance.lang).toBe('ja-JP');

    jest.useRealTimers();
  });

  it('プロバイダー外で使用するとエラーになる', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useAudio());
    }).toThrow('useAudio must be used within an AudioProvider');

    consoleSpy.mockRestore();
  });
});
