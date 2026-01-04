import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { useKanjiText, useKanjiTexts, type KanjiTextMap } from '../useKanjiText';
import { LanguageProvider } from '@/contexts/LanguageContext';

// LanguageProviderでラップするwrapper
const wrapper = ({ children }: { children: ReactNode }): JSX.Element => (
  <LanguageProvider>{children}</LanguageProvider>
);

describe('useKanjiText', () => {
  // テスト用の漢字レベル別テキスト
  const sampleKanjiTextMap: KanjiTextMap = {
    1: 'ひらがなだけ',
    2: '少し漢字',
    3: '普通の漢字',
    4: '難しい漢字',
    5: '更に難しい漢字',
    6: '最も難しい漢字',
  };

  describe('基本機能', () => {
    it('デフォルトの漢字レベル（1）のテキストを返す', () => {
      const { result } = renderHook(() => useKanjiText(sampleKanjiTextMap), { wrapper });

      expect(result.current.text).toBe('ひらがなだけ');
      expect(result.current.currentGrade).toBe(1);
    });

    it('undefinedのkanjiTextMapの場合、空文字を返す', () => {
      const { result } = renderHook(() => useKanjiText(undefined), { wrapper });

      expect(result.current.text).toBe('');
    });

    it('fallbackTextを指定できる', () => {
      const { result } = renderHook(
        () => useKanjiText(undefined, { fallbackText: 'フォールバック' }),
        { wrapper },
      );

      expect(result.current.text).toBe('フォールバック');
    });
  });

  describe('overrideGrade', () => {
    it('overrideGradeで漢字レベルを上書きできる', () => {
      const { result } = renderHook(() => useKanjiText(sampleKanjiTextMap, { overrideGrade: 3 }), {
        wrapper,
      });

      expect(result.current.text).toBe('普通の漢字');
      expect(result.current.currentGrade).toBe(3);
    });

    it('overrideGrade: 6で最も難しいテキストを返す', () => {
      const { result } = renderHook(() => useKanjiText(sampleKanjiTextMap, { overrideGrade: 6 }), {
        wrapper,
      });

      expect(result.current.text).toBe('最も難しい漢字');
    });
  });

  describe('フォールバック', () => {
    it('指定レベルにテキストがない場合、より低いレベルにフォールバックする', () => {
      const partialMap: KanjiTextMap = {
        1: 'レベル1',
        2: '',
        3: '',
        4: 'レベル4',
        5: '',
        6: '',
      };

      const { result } = renderHook(() => useKanjiText(partialMap, { overrideGrade: 3 }), {
        wrapper,
      });

      // レベル3がないので、レベル1にフォールバック
      expect(result.current.text).toBe('レベル1');
    });

    it('すべてのレベルにテキストがない場合、fallbackTextを返す', () => {
      const emptyMap: KanjiTextMap = {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
      };

      const { result } = renderHook(() => useKanjiText(emptyMap, { fallbackText: 'デフォルト' }), {
        wrapper,
      });

      expect(result.current.text).toBe('デフォルト');
    });

    it('空白のみのテキストもフォールバック対象になる', () => {
      const whitespaceMap: KanjiTextMap = {
        1: '有効なテキスト',
        2: '   ', // 空白のみ
        3: '',
        4: '',
        5: '',
        6: '',
      };

      const { result } = renderHook(() => useKanjiText(whitespaceMap, { overrideGrade: 2 }), {
        wrapper,
      });

      expect(result.current.text).toBe('有効なテキスト');
    });
  });

  describe('getTextForGrade', () => {
    it('特定のレベルのテキストを取得できる', () => {
      const { result } = renderHook(() => useKanjiText(sampleKanjiTextMap), { wrapper });

      expect(result.current.getTextForGrade(1)).toBe('ひらがなだけ');
      expect(result.current.getTextForGrade(3)).toBe('普通の漢字');
      expect(result.current.getTextForGrade(6)).toBe('最も難しい漢字');
    });

    it('getTextForGradeもフォールバックロジックを持つ', () => {
      const partialMap: KanjiTextMap = {
        1: 'レベル1',
        2: '',
        3: 'レベル3',
        4: '',
        5: '',
        6: '',
      };

      const { result } = renderHook(() => useKanjiText(partialMap), { wrapper });

      expect(result.current.getTextForGrade(2)).toBe('レベル1');
      expect(result.current.getTextForGrade(5)).toBe('レベル3');
    });
  });
});

describe('useKanjiTexts', () => {
  describe('基本機能', () => {
    it('複数のテキストを一括で変換できる', () => {
      const titleMap: KanjiTextMap = {
        1: 'たいとる',
        2: 'タイトル',
        3: '題名',
        4: '題名',
        5: '題名',
        6: '題名',
      };

      const descriptionMap: KanjiTextMap = {
        1: 'せつめい',
        2: '説明',
        3: '説明',
        4: '説明',
        5: '説明',
        6: '説明',
      };

      const { result } = renderHook(
        () =>
          useKanjiTexts({
            title: titleMap,
            description: descriptionMap,
          }),
        { wrapper },
      );

      // デフォルトレベル1
      expect(result.current.title).toBe('たいとる');
      expect(result.current.description).toBe('せつめい');
    });

    it('undefinedのマップはfallbackTextになる', () => {
      const titleMap: KanjiTextMap = {
        1: 'たいとる',
        2: 'タイトル',
        3: '題名',
        4: '題名',
        5: '題名',
        6: '題名',
      };

      const { result } = renderHook(
        () =>
          useKanjiTexts(
            {
              title: titleMap,
              missing: undefined,
            },
            { fallbackText: 'デフォルト' },
          ),
        { wrapper },
      );

      expect(result.current.title).toBe('たいとる');
      expect(result.current.missing).toBe('デフォルト');
    });
  });

  describe('overrideGrade', () => {
    it('overrideGradeで全てのテキストのレベルを上書きできる', () => {
      const titleMap: KanjiTextMap = {
        1: 'たいとる',
        2: 'タイトル',
        3: '題名',
        4: '題名',
        5: '題名',
        6: '題名',
      };

      const descriptionMap: KanjiTextMap = {
        1: 'せつめい',
        2: '説明',
        3: '説明文',
        4: '説明文',
        5: '説明文',
        6: '説明文',
      };

      const { result } = renderHook(
        () =>
          useKanjiTexts(
            {
              title: titleMap,
              description: descriptionMap,
            },
            { overrideGrade: 3 },
          ),
        { wrapper },
      );

      expect(result.current.title).toBe('題名');
      expect(result.current.description).toBe('説明文');
    });
  });

  describe('フォールバック', () => {
    it('各テキストに個別にフォールバックが適用される', () => {
      const titleMap: KanjiTextMap = {
        1: 'たいとる',
        2: '',
        3: '題名',
        4: '',
        5: '',
        6: '',
      };

      const descriptionMap: KanjiTextMap = {
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
      };

      const { result } = renderHook(
        () =>
          useKanjiTexts(
            {
              title: titleMap,
              description: descriptionMap,
            },
            { overrideGrade: 2, fallbackText: 'なし' },
          ),
        { wrapper },
      );

      expect(result.current.title).toBe('たいとる'); // レベル1にフォールバック
      expect(result.current.description).toBe('なし'); // fallbackText
    });
  });
});
