import { getUnlearnedKanji } from '../data/kanjiData';

/**
 * 学年別の漢字使用を検証するユーティリティ
 */

export interface KanjiValidationResult {
  grade: number;
  text: string;
  isValid: boolean;
  unlearnedKanji: string[];
  suggestions?: string[];
}

/**
 * テキストが指定学年で学習済みの漢字のみを使用しているか検証
 */
export function validateKanjiForGrade(text: string, grade: number): KanjiValidationResult {
  const unlearnedKanji = getUnlearnedKanji(text, grade);

  return {
    grade,
    text,
    isValid: unlearnedKanji.length === 0,
    unlearnedKanji,
    suggestions: unlearnedKanji.length > 0 ? getSuggestions(unlearnedKanji, grade) : undefined,
  };
}

/**
 * 複数の学年のテキストを一括検証
 */
export function validateKanjiVariations(
  variations: Record<number, string>,
): Record<number, KanjiValidationResult> {
  const results: Record<number, KanjiValidationResult> = {};

  for (const [grade, text] of Object.entries(variations)) {
    results[Number(grade)] = validateKanjiForGrade(text, Number(grade));
  }

  return results;
}

/**
 * 未習漢字の代替案を提案
 */
function getSuggestions(unlearnedKanji: string[], grade: number): string[] {
  const suggestions: string[] = [];

  const kanjiAlternatives: Record<string, Record<number, string>> = {
    私: { 1: 'わたし', 2: 'わたし', 3: 'わたし', 4: 'わたし', 5: 'わたし', 6: '私' },
    歯: { 1: 'は', 2: 'は', 3: '歯', 4: '歯', 5: '歯', 6: '歯' },
    美: { 1: 'うつく', 2: 'うつく', 3: '美', 4: '美', 5: '美', 6: '美' },
    味: { 1: 'あじ', 2: 'あじ', 3: '味', 4: '味', 5: '味', 6: '味' },
    勉: { 1: 'べん', 2: 'べん', 3: '勉', 4: '勉', 5: '勉', 6: '勉' },
    強: { 1: 'きょう', 2: '強', 3: '強', 4: '強', 5: '強', 6: '強' },
    英: { 1: 'えい', 2: 'えい', 3: 'えい', 4: '英', 5: '英', 6: '英' },
    語: { 1: 'ご', 2: '語', 3: '語', 4: '語', 5: '語', 6: '語' },
    磨: { 1: 'みが', 2: 'みが', 3: 'みが', 4: 'みが', 5: 'みが', 6: '磨' },
    寝: { 1: 'ね', 2: 'ね', 3: '寝', 4: '寝', 5: '寝', 6: '寝' },
    飯: { 1: 'はん', 2: 'はん', 3: 'はん', 4: '飯', 5: '飯', 6: '飯' },
    好: { 1: 'す', 2: 'す', 3: 'す', 4: '好', 5: '好', 6: '好' },
    達: { 1: 'たち', 2: 'たち', 3: 'たち', 4: '達', 5: '達', 6: '達' },
    族: { 1: 'ぞく', 2: 'ぞく', 3: '族', 4: '族', 5: '族', 6: '族' },
    優: { 1: 'やさ', 2: 'やさ', 3: 'やさ', 4: 'やさ', 5: 'やさ', 6: '優' },
    助: { 1: 'たす', 2: 'たす', 3: '助', 4: '助', 5: '助', 6: '助' },
    伝: { 1: 'つた', 2: 'つた', 3: 'つた', 4: '伝', 5: '伝', 6: '伝' },
    遊: { 1: 'あそ', 2: 'あそ', 3: '遊', 4: '遊', 5: '遊', 6: '遊' },
    緒: { 1: 'しょ', 2: 'しょ', 3: 'しょ', 4: '緒', 5: '緒', 6: '緒' },
    洗: { 1: 'あら', 2: 'あら', 3: 'あら', 4: 'あら', 5: 'あら', 6: '洗' },
    咲: { 1: 'さ', 2: 'さ', 3: 'さ', 4: 'さ', 5: 'さ', 6: 'さ' }, // 中学漢字
    沢: { 1: 'さわ', 2: 'さわ', 3: 'さわ', 4: 'さわ', 5: 'さわ', 6: 'さわ' }, // 中学漢字
  };

  for (const kanji of unlearnedKanji) {
    const alternative = kanjiAlternatives[kanji]?.[grade];
    if (alternative !== undefined) {
      suggestions.push(`${kanji} → ${alternative}`);
    } else {
      suggestions.push(`${kanji} → ひらがな`);
    }
  }

  return suggestions;
}

/**
 * 文章の漢字使用状況をレポート
 */
export function generateKanjiReport(
  sentences: Array<{ id: string; jaKanji: Record<number, string> }>,
): string {
  let report = '# 漢字使用検証レポート\n\n';

  for (const sentence of sentences) {
    report += `## 文章ID: ${sentence.id}\n\n`;

    const validations = validateKanjiVariations(sentence.jaKanji);

    for (const [grade, result] of Object.entries(validations)) {
      if (!result.isValid) {
        report += `### 学年 ${grade}\n`;
        report += `- テキスト: ${result.text}\n`;
        report += `- 未習漢字: ${result.unlearnedKanji.join(', ')}\n`;
        if (result.suggestions) {
          report += `- 提案: ${result.suggestions.join(', ')}\n`;
        }
        report += '\n';
      }
    }
  }

  return report;
}

/**
 * 漢字レベルを自動調整（簡易版）
 */
export function autoAdjustKanjiLevel(text: string, targetGrade: number): string {
  const unlearnedKanji = getUnlearnedKanji(text, targetGrade);
  let adjustedText = text;

  // 基本的な置換マップ
  const replacements: Record<string, Record<number, string>> = {
    私: { 1: 'わたし', 2: 'わたし', 3: 'わたし', 4: 'わたし', 5: 'わたし' },
    毎朝: { 1: 'まいあさ' },
    毎日: { 1: 'まいにち' },
    学校: { 1: '学校' }, // 小1で学習
    先生: { 1: '先生' }, // 小1で学習
    // 他の一般的な置換...
  };

  // 未習漢字を置換
  for (const kanji of unlearnedKanji) {
    const replacement = replacements[kanji]?.[targetGrade];
    if (replacement !== undefined) {
      adjustedText = adjustedText.replace(new RegExp(kanji, 'g'), replacement);
    }
  }

  return adjustedText;
}
