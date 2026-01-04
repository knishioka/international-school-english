import type { Sentence } from '@/types';
import { filterByCategory, sortById } from '../loaders';
import { artSentences } from './art';
import { clothesSentences } from './clothes';
import { dailySentences } from './daily';
import { familySentences } from './family';
import { feelingsSentences } from './feelings';
import { foodSentences } from './food';
import { healthSentences } from './health';
import { hobbiesSentences } from './hobbies';
import { holidaysSentences } from './holidays';
import { houseSentences } from './house';
import { musicSentences } from './music';
import { natureSentences } from './nature';
import { numbersSentences } from './numbers';
import { schoolSentences } from './school';
import { shoppingSentences } from './shopping';
import { sportsSentences } from './sports';
import { technologySentences } from './technology';
import { timeSentences } from './time';
import { transportSentences } from './transport';
import { weatherSentences } from './weather';

const allSentences: Sentence[] = [
  ...dailySentences,
  ...schoolSentences,
  ...natureSentences,
  ...familySentences,
  ...sportsSentences,
  ...foodSentences,
  ...transportSentences,
  ...weatherSentences,
  ...artSentences,
  ...musicSentences,
  ...timeSentences,
  ...feelingsSentences,
  ...houseSentences,
  ...technologySentences,
  ...clothesSentences,
  ...healthSentences,
  ...numbersSentences,
  ...hobbiesSentences,
  ...shoppingSentences,
  ...holidaysSentences,
];

/**
 * 文章練習用のセンテンスデータ
 * Sentences for sentence practice game
 */
export const sentences: Sentence[] = sortById(allSentences);

/**
 * センテンスカテゴリー情報
 */
export const sentenceCategories = [
  {
    id: 'all',
    name: { en: 'All Sentences', ja: 'すべてのぶんしょう' },
    emoji: '📝',
    color: 'bg-gradient-to-r from-purple-400 to-pink-400',
  },
  { id: 'daily', name: { en: 'Daily Life', ja: 'にちじょう' }, emoji: '🏠', color: 'bg-blue-100' },
  { id: 'school', name: { en: 'School', ja: 'がっこう' }, emoji: '🏫', color: 'bg-green-100' },
  { id: 'nature', name: { en: 'Nature', ja: 'しぜん' }, emoji: '🌳', color: 'bg-green-100' },
  { id: 'family', name: { en: 'Family', ja: 'かぞく' }, emoji: '👨‍👩‍👧‍👦', color: 'bg-yellow-100' },
  { id: 'sports', name: { en: 'Sports', ja: 'スポーツ' }, emoji: '⚽', color: 'bg-orange-100' },
  { id: 'food', name: { en: 'Food', ja: 'たべもの' }, emoji: '🍎', color: 'bg-red-100' },
  {
    id: 'transport',
    name: { en: 'Transportation', ja: 'のりもの' },
    emoji: '🚌',
    color: 'bg-blue-100',
  },
  { id: 'weather', name: { en: 'Weather', ja: 'てんき' }, emoji: '☀️', color: 'bg-indigo-100' },
  {
    id: 'art',
    name: { en: 'Colors & Art', ja: 'いろとげいじゅつ' },
    emoji: '🎨',
    color: 'bg-purple-100',
  },
  { id: 'music', name: { en: 'Music', ja: 'おんがく' }, emoji: '🎵', color: 'bg-pink-100' },
  { id: 'time', name: { en: 'Time', ja: 'じかん' }, emoji: '⏰', color: 'bg-yellow-100' },
  { id: 'feelings', name: { en: 'Feelings', ja: 'きもち' }, emoji: '😊', color: 'bg-red-100' },
  { id: 'house', name: { en: 'House', ja: 'いえ' }, emoji: '🏠', color: 'bg-orange-100' },
  {
    id: 'technology',
    name: { en: 'Technology', ja: 'ぎじゅつ' },
    emoji: '💻',
    color: 'bg-gray-100',
  },
  { id: 'clothes', name: { en: 'Clothes', ja: 'ふく' }, emoji: '👕', color: 'bg-blue-100' },
  { id: 'health', name: { en: 'Health', ja: 'けんこう' }, emoji: '💪', color: 'bg-green-100' },
  { id: 'numbers', name: { en: 'Numbers', ja: 'すうじ' }, emoji: '🔢', color: 'bg-purple-100' },
  { id: 'hobbies', name: { en: 'Hobbies', ja: 'しゅみ' }, emoji: '🎯', color: 'bg-pink-100' },
  { id: 'shopping', name: { en: 'Shopping', ja: 'かいもの' }, emoji: '🛒', color: 'bg-yellow-100' },
  { id: 'holidays', name: { en: 'Holidays', ja: 'きゅうじつ' }, emoji: '🎉', color: 'bg-gray-100' },
];

/**
 * カテゴリー別のフィルタリング関数
 */
export function getSentencesByCategory(category: string): Sentence[] {
  return filterByCategory(sentences, category);
}

/**
 * 利用可能なカテゴリーの取得
 */
export function getSentenceCategories(): string[] {
  const categories = Array.from(new Set(sentences.map((sentence) => sentence.category)));
  return ['all', ...categories];
}
