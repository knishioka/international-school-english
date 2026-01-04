import type { VocabularyWord } from '@/types/vocabulary';
import { filterByCategory, sortById } from '../loaders';
import { activitiesVocabularyWords } from './activities';
import { animalsVocabularyWords } from './animals';
import { bodyVocabularyWords } from './body';
import { colorsVocabularyWords } from './colors';
import { familyVocabularyWords } from './family';
import { foodVocabularyWords } from './food';
import { itemsVocabularyWords } from './items';
import { natureVocabularyWords } from './nature';
import { numbersVocabularyWords } from './numbers';
import { schoolVocabularyWords } from './school';

const allVocabularyWords: VocabularyWord[] = [
  ...foodVocabularyWords,
  ...animalsVocabularyWords,
  ...colorsVocabularyWords,
  ...familyVocabularyWords,
  ...schoolVocabularyWords,
  ...bodyVocabularyWords,
  ...natureVocabularyWords,
  ...itemsVocabularyWords,
  ...activitiesVocabularyWords,
  ...numbersVocabularyWords,
];

/**
 * フラッシュカード用の語彙データ
 * Basic vocabulary words for flash card learning
 */
export const vocabularyWords: VocabularyWord[] = sortById(allVocabularyWords);

/**
 * カテゴリー情報
 */
export const vocabularyCategories = [
  {
    id: 'all',
    name: { en: 'All Words', ja: 'すべての ことば' },
    emoji: '📝',
    color: 'bg-gradient-to-r from-purple-400 to-pink-400',
  },
  { id: 'food', name: { en: 'Food', ja: 'たべもの' }, emoji: '🍎', color: 'bg-green-100' },
  { id: 'animals', name: { en: 'Animals', ja: 'どうぶつ' }, emoji: '🐱', color: 'bg-yellow-100' },
  { id: 'colors', name: { en: 'Colors', ja: 'いろ' }, emoji: '🌈', color: 'bg-pink-100' },
  { id: 'family', name: { en: 'Family', ja: 'かぞく' }, emoji: '👨‍👩‍👧‍👦', color: 'bg-blue-100' },
  { id: 'school', name: { en: 'School', ja: 'がっこう' }, emoji: '🏫', color: 'bg-purple-100' },
  {
    id: 'body',
    name: { en: 'Body Parts', ja: 'からだの ぶぶん' },
    emoji: '👤',
    color: 'bg-red-100',
  },
  { id: 'nature', name: { en: 'Nature', ja: 'しぜん' }, emoji: '🌳', color: 'bg-green-100' },
  {
    id: 'items',
    name: { en: 'Daily Items', ja: 'にちようひん' },
    emoji: '🏠',
    color: 'bg-orange-100',
  },
  {
    id: 'activities',
    name: { en: 'Activities', ja: 'かつどう' },
    emoji: '🏃',
    color: 'bg-indigo-100',
  },
  { id: 'numbers', name: { en: 'Numbers', ja: 'すうじ' }, emoji: '🔢', color: 'bg-gray-100' },
];

/**
 * カテゴリー別のフィルタリング関数
 */
export function getVocabularyByCategory(category: string): VocabularyWord[] {
  return filterByCategory(vocabularyWords, category);
}

/**
 * 利用可能なカテゴリーの取得
 */
export function getVocabularyCategories(): string[] {
  const categories = Array.from(new Set(vocabularyWords.map((word) => word.category)));
  return ['all', ...categories];
}
