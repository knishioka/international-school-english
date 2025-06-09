import type { Category } from '@/types/vocabulary';

/**
 * 共通カテゴリーデータ
 * Common category data across all games
 */
export const commonCategories: Category[] = [
  {
    id: 'all',
    name: { en: 'All Items', ja: 'すべて' },
    emoji: '📝',
    color: 'bg-gradient-to-r from-purple-400 to-pink-400',
  },
  { id: 'animals', name: { en: 'Animals', ja: 'どうぶつ' }, emoji: '🐱', color: 'bg-yellow-100' },
  { id: 'food', name: { en: 'Food', ja: 'たべもの' }, emoji: '🍎', color: 'bg-red-100' },
  { id: 'colors', name: { en: 'Colors', ja: 'いろ' }, emoji: '🌈', color: 'bg-pink-100' },
  { id: 'family', name: { en: 'Family', ja: 'かぞく' }, emoji: '👨‍👩‍👧‍👦', color: 'bg-blue-100' },
  { id: 'school', name: { en: 'School', ja: 'がっこう' }, emoji: '🏫', color: 'bg-purple-100' },
  { id: 'nature', name: { en: 'Nature', ja: 'しぜん' }, emoji: '🌳', color: 'bg-green-100' },
  {
    id: 'daily',
    name: { en: 'Daily Life', ja: 'にちじょう' },
    emoji: '🏠',
    color: 'bg-orange-100',
  },
  { id: 'body', name: { en: 'Body Parts', ja: 'からだ' }, emoji: '👤', color: 'bg-indigo-100' },
  {
    id: 'items',
    name: { en: 'Daily Items', ja: 'にちようひん' },
    emoji: '🏠',
    color: 'bg-gray-100',
  },
];

/**
 * ゲーム固有カテゴリー
 */
export const gameSpecificCategories = {
  vocabulary: [
    {
      id: 'activities',
      name: { en: 'Activities', ja: 'かつどう' },
      emoji: '🏃',
      color: 'bg-indigo-100',
    },
    { id: 'numbers', name: { en: 'Numbers', ja: 'すうじ' }, emoji: '🔢', color: 'bg-gray-100' },
  ],
  sentences: [
    { id: 'sports', name: { en: 'Sports', ja: 'スポーツ' }, emoji: '⚽', color: 'bg-orange-100' },
    { id: 'hobbies', name: { en: 'Hobbies', ja: 'しゅみ' }, emoji: '🎨', color: 'bg-pink-100' },
    { id: 'weather', name: { en: 'Weather', ja: 'てんき' }, emoji: '🌤️', color: 'bg-indigo-100' },
    {
      id: 'holidays',
      name: { en: 'Holidays', ja: 'きゅうじつ' },
      emoji: '🎊',
      color: 'bg-gray-100',
    },
  ],
  spelling: [
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
  ],
  stories: [
    {
      id: 'moral',
      name: { en: 'Moral Stories', ja: 'どうとくのはなし' },
      emoji: '💝',
      color: 'bg-pink-100',
    },
    {
      id: 'friendship',
      name: { en: 'Friendship', ja: 'ゆうじょう' },
      emoji: '👫',
      color: 'bg-yellow-100',
    },
    { id: 'courage', name: { en: 'Courage', ja: 'ゆうき' }, emoji: '🦁', color: 'bg-orange-100' },
    { id: 'patience', name: { en: 'Patience', ja: 'がまん' }, emoji: '⏰', color: 'bg-blue-100' },
    {
      id: 'responsibility',
      name: { en: 'Responsibility', ja: 'せきにん' },
      emoji: '🎯',
      color: 'bg-red-100',
    },
    {
      id: 'imagination',
      name: { en: 'Imagination', ja: 'そうぞうりょく' },
      emoji: '🌈',
      color: 'bg-purple-100',
    },
    {
      id: 'empathy',
      name: { en: 'Empathy', ja: 'おもいやり' },
      emoji: '❤️',
      color: 'bg-indigo-100',
    },
    {
      id: 'self-esteem',
      name: { en: 'Self-esteem', ja: 'じしん' },
      emoji: '⭐',
      color: 'bg-gray-100',
    },
  ],
};

/**
 * ゲーム種別に応じたカテゴリー取得
 */
// Export sentence categories for direct use
export const sentenceCategories = getCategoriesForGame('sentences');

export function getCategoriesForGame(
  gameType: 'vocabulary' | 'sentences' | 'spelling' | 'stories',
): Category[] {
  const base = commonCategories.filter((cat) => {
    // ゲームタイプに応じて関連するカテゴリーのみを返す
    if (gameType === 'vocabulary') {
      return [
        'all',
        'animals',
        'food',
        'colors',
        'family',
        'school',
        'nature',
        'body',
        'items',
      ].includes(cat.id);
    }
    if (gameType === 'sentences') {
      return ['all', 'daily', 'school', 'nature', 'family'].includes(cat.id);
    }
    if (gameType === 'spelling') {
      return ['all', 'animals', 'nature', 'colors', 'school', 'food', 'family'].includes(cat.id);
    }
    if (gameType === 'stories') {
      return ['all', 'nature'].includes(cat.id);
    }
    return true;
  });

  // ゲーム固有カテゴリーを追加
  const specific = gameSpecificCategories[gameType];
  return [...base, ...(specific ?? [])];
}

/**
 * カテゴリーIDからカテゴリー情報を取得
 */
export function getCategoryById(
  id: string,
  gameType?: 'vocabulary' | 'sentences' | 'spelling' | 'stories',
): Category | undefined {
  // まず共通カテゴリーから検索
  const common = commonCategories.find((cat) => cat.id === id);
  if (common) {
    return common;
  }

  // ゲーム固有カテゴリーから検索
  if (gameType) {
    const specific = gameSpecificCategories[gameType]?.find((cat) => cat.id === id);
    if (specific) {
      return specific;
    }
  }

  // 全ゲーム固有カテゴリーから検索
  for (const categories of Object.values(gameSpecificCategories)) {
    const found = categories.find((cat) => cat.id === id);
    if (found) {
      return found;
    }
  }

  return undefined;
}
