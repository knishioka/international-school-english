import { useMemo } from 'react';
import { useLanguage, type KanjiGrade } from '@/contexts/LanguageContext';

/**
 * 漢字レベル別のテキストオブジェクト
 */
export type KanjiTextMap = { [key in KanjiGrade]: string };

/**
 * useKanjiTextのオプション
 */
export interface UseKanjiTextOptions {
  /** 漢字レベルを上書きする場合に指定 */
  overrideGrade?: KanjiGrade;
  /** フォールバック時に使用するテキスト */
  fallbackText?: string;
}

/**
 * useKanjiTextの戻り値
 */
export interface UseKanjiTextReturn {
  /** 現在の漢字レベルに応じたテキスト */
  text: string;
  /** 現在の漢字レベル */
  currentGrade: KanjiGrade;
  /** 特定のレベルのテキストを取得する */
  getTextForGrade: (grade: KanjiGrade) => string;
}

/**
 * 漢字レベルに応じたテキストを取得するカスタムフック
 *
 * ユーザーの漢字レベル設定に基づいて、適切な漢字レベルのテキストを返す。
 * 指定されたレベルにテキストがない場合は、より低いレベルにフォールバックする。
 *
 * @example
 * ```tsx
 * // ストーリーページでの使用
 * const { text } = useKanjiText(story.jaKanji);
 *
 * // 明示的にレベルを指定
 * const { text } = useKanjiText(sentence.jaKanji, { overrideGrade: 3 });
 *
 * // フォールバックテキストを指定
 * const { text } = useKanjiText(page.jaKanji, {
 *   fallbackText: page.text.ja,
 * });
 * ```
 */
export function useKanjiText(
  kanjiTextMap: KanjiTextMap | undefined,
  options: UseKanjiTextOptions = {},
): UseKanjiTextReturn {
  const { kanjiGrade: contextGrade } = useLanguage();
  const { overrideGrade, fallbackText = '' } = options;

  const currentGrade = overrideGrade ?? contextGrade;

  const getTextForGrade = useMemo(() => {
    return (grade: KanjiGrade): string => {
      if (!kanjiTextMap) {
        return fallbackText;
      }

      // 指定されたレベルのテキストがあればそれを返す
      const text = kanjiTextMap[grade];
      if (text && text.trim() !== '') {
        return text;
      }

      // フォールバック: より低いレベルを探す
      const grades: KanjiGrade[] = [1, 2, 3, 4, 5, 6];
      const lowerGrades = grades.filter((g) => g < grade).reverse();

      for (const lowerGrade of lowerGrades) {
        const lowerText = kanjiTextMap[lowerGrade];
        if (lowerText && lowerText.trim() !== '') {
          return lowerText;
        }
      }

      // 最低レベルにもない場合はフォールバックテキスト
      return fallbackText;
    };
  }, [kanjiTextMap, fallbackText]);

  const text = useMemo(() => {
    return getTextForGrade(currentGrade);
  }, [getTextForGrade, currentGrade]);

  return {
    text,
    currentGrade,
    getTextForGrade,
  };
}

/**
 * 複数のテキストフィールドを一括で漢字レベル変換するヘルパーフック
 *
 * @example
 * ```tsx
 * const texts = useKanjiTexts({
 *   title: story.title.jaKanji,
 *   description: story.description.jaKanji,
 *   lesson: story.lesson.jaKanji,
 * });
 *
 * return (
 *   <div>
 *     <h1>{texts.title}</h1>
 *     <p>{texts.description}</p>
 *   </div>
 * );
 * ```
 */
export function useKanjiTexts(
  kanjiTextMaps: Record<string, KanjiTextMap | undefined>,
  options: UseKanjiTextOptions = {},
): Record<string, string> {
  const { kanjiGrade: contextGrade } = useLanguage();
  const { overrideGrade, fallbackText = '' } = options;

  const currentGrade = overrideGrade ?? contextGrade;

  return useMemo(() => {
    const result: Record<string, string> = {};

    for (const [key, kanjiTextMap] of Object.entries(kanjiTextMaps)) {
      if (!kanjiTextMap) {
        result[key] = fallbackText;
        continue;
      }

      // 指定されたレベルのテキストがあればそれを返す
      const text = kanjiTextMap[currentGrade];
      if (text && text.trim() !== '') {
        result[key] = text;
        continue;
      }

      // フォールバック: より低いレベルを探す
      const grades: KanjiGrade[] = [1, 2, 3, 4, 5, 6];
      const lowerGrades = grades.filter((g) => g < currentGrade).reverse();

      let found = false;
      for (const lowerGrade of lowerGrades) {
        const lowerText = kanjiTextMap[lowerGrade];
        if (lowerText && lowerText.trim() !== '') {
          result[key] = lowerText;
          found = true;
          break;
        }
      }

      if (!found) {
        result[key] = fallbackText;
      }
    }

    return result;
  }, [kanjiTextMaps, currentGrade, fallbackText]);
}
