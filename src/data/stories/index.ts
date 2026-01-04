import type { Story } from '@/types';
import { filterByCategory, sortById } from '../loaders';
import { courageStories } from './courage';
import { diversityStories } from './diversity';
import { empathyStories } from './empathy';
import { friendshipStories } from './friendship';
import { imaginationStories } from './imagination';
import { logicStories } from './logic';
import { moralStories } from './moral';
import { natureStories } from './nature';
import { patienceStories } from './patience';
import { responsibilityStories } from './responsibility';
import { selfEsteemStories } from './self-esteem';

const allStories: Story[] = [
  ...moralStories,
  ...friendshipStories,
  ...courageStories,
  ...patienceStories,
  ...responsibilityStories,
  ...imaginationStories,
  ...empathyStories,
  ...logicStories,
  ...selfEsteemStories,
  ...diversityStories,
  ...natureStories,
];

/**
 * お話ページ用のストーリーデータ
 * Stories for story page
 */
export const stories: Story[] = sortById(allStories);

/**
 * ストーリーカテゴリー情報
 */
export const storyCategories = [
  {
    id: 'all',
    name: { en: 'All Stories', ja: 'すべてのおはなし' },
    emoji: '📚',
    color: 'bg-gradient-to-r from-purple-400 to-pink-400',
  },
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
  { id: 'nature', name: { en: 'Nature', ja: 'しぜん' }, emoji: '🌳', color: 'bg-green-100' },
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
  { id: 'empathy', name: { en: 'Empathy', ja: 'おもいやり' }, emoji: '❤️', color: 'bg-indigo-100' },
  {
    id: 'self-esteem',
    name: { en: 'Self-esteem', ja: 'じしん' },
    emoji: '⭐',
    color: 'bg-gray-100',
  },
  {
    id: 'logic',
    name: { en: 'Logic', ja: 'ろんり' },
    emoji: '🧠',
    color: 'bg-teal-100',
  },
  {
    id: 'diversity',
    name: { en: 'Diversity', ja: 'たようせい' },
    emoji: '🌍',
    color: 'bg-cyan-100',
  },
];

/**
 * カテゴリー別のフィルタリング関数
 */
export function getStoriesByCategory(category: string): Story[] {
  return filterByCategory(stories, category);
}

/**
 * 利用可能なカテゴリーの取得
 */
export function getStoryCategories(): string[] {
  const categories = Array.from(new Set(stories.map((story) => story.category)));
  return ['all', ...categories];
}
