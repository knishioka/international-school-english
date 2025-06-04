import { act, renderHook } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../LanguageContext';

describe('LanguageContext', () => {
  it('デフォルトで日本語が設定される', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.language).toBe('ja');
  });

  it('言語を切り替えることができる', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    act(() => {
      result.current.setLanguage('en');
    });

    expect(result.current.language).toBe('en');
  });

  it('翻訳関数が正しく動作する', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.t('welcome')).toBe('えいごをまなぼう！');

    act(() => {
      result.current.setLanguage('en');
    });

    expect(result.current.t('welcome')).toBe('Welcome to English Learning!');
  });

  it('存在しないキーの場合はキーをそのまま返す', () => {
    const { result } = renderHook(() => useLanguage(), {
      wrapper: LanguageProvider,
    });

    expect(result.current.t('nonexistent')).toBe('nonexistent');
  });

  it('プロバイダー外で使用するとエラーになる', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      renderHook(() => useLanguage());
    }).toThrow('useLanguage must be used within a LanguageProvider');

    consoleSpy.mockRestore();
  });
});
