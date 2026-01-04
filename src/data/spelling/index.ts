import type { SpellingWord } from '@/types';
import { filterByCategory, filterByDifficulty, sortById } from '../loaders';
import { easySpellingWords } from './easy';
import { hardSpellingWords } from './hard';
import { mediumSpellingWords } from './medium';

const allSpellingWords: SpellingWord[] = [
  ...easySpellingWords,
  ...mediumSpellingWords,
  ...hardSpellingWords,
];

/**
 * スペリングゲーム用の単語データ
 * Words for spelling game
 */
export const spellingWords: SpellingWord[] = sortById(allSpellingWords);

/**
 * スペリング単語カテゴリー情報
 */
export const spellingCategories = [
  {
    id: 'all',
    name: { en: 'All Words', ja: 'すべてのことば' },
    emoji: '📝',
    color: 'bg-gradient-to-r from-purple-400 to-pink-400',
  },
  { id: 'animals', name: { en: 'Animals', ja: 'どうぶつ' }, emoji: '🐱', color: 'bg-yellow-100' },
  { id: 'nature', name: { en: 'Nature', ja: 'しぜん' }, emoji: '🌳', color: 'bg-green-100' },
  { id: 'colors', name: { en: 'Colors', ja: 'いろ' }, emoji: '🌈', color: 'bg-pink-100' },
  { id: 'school', name: { en: 'School', ja: 'がっこう' }, emoji: '🏫', color: 'bg-blue-100' },
  { id: 'food', name: { en: 'Food', ja: 'たべもの' }, emoji: '🍎', color: 'bg-red-100' },
  { id: 'family', name: { en: 'Family', ja: 'かぞく' }, emoji: '👨‍👩‍👧‍👦', color: 'bg-purple-100' },
  { id: 'feelings', name: { en: 'Feelings', ja: 'きもち' }, emoji: '😊', color: 'bg-orange-100' },
  {
    id: 'celebrations',
    name: { en: 'Celebrations', ja: 'おいわい' },
    emoji: '🎉',
    color: 'bg-indigo-100',
  },
  {
    id: 'technology',
    name: { en: 'Technology', ja: 'テクノロジー' },
    emoji: '💻',
    color: 'bg-gray-100',
  },
];

/**
 * 難易度別のフィルタリング関数
 */
export function getSpellingWordsByDifficulty(
  difficulty: 'easy' | 'medium' | 'hard',
): SpellingWord[] {
  return filterByDifficulty(spellingWords, difficulty);
}

/**
 * カテゴリー別のフィルタリング関数
 */
export function getSpellingWordsByCategory(category: string): SpellingWord[] {
  return filterByCategory(spellingWords, category);
}

/**
 * 利用可能なカテゴリーの取得
 */
export function getSpellingCategories(): string[] {
  const categories = Array.from(new Set(spellingWords.map((word) => word.category)));
  return ['all', ...categories];
}
