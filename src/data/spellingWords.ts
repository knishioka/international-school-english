import type { SpellingWord } from '@/types';

/**
 * スペリングゲーム用の単語データ
 * Words for spelling game
 */
export const spellingWords: SpellingWord[] = [
  // Easy words - 3-4 letters
  {
    id: '1',
    word: 'cat',
    japanese: 'ねこ',
    category: 'animals',
    hint: 'A furry pet that says "meow"',
    image: '/images/cat.jpg',
    emoji: '🐱',
    difficulty: 'easy',
  },
  {
    id: '2',
    word: 'dog',
    japanese: 'いぬ',
    category: 'animals',
    hint: 'A loyal pet that barks',
    image: '/images/dog.jpg',
    emoji: '🐶',
    difficulty: 'easy',
  },
  {
    id: '3',
    word: 'sun',
    japanese: 'たいよう',
    category: 'nature',
    hint: 'Bright yellow thing in the sky',
    image: '/images/sun.jpg',
    emoji: '☀️',
    difficulty: 'easy',
  },
  {
    id: '4',
    word: 'red',
    japanese: 'あか',
    category: 'colors',
    hint: 'The color of strawberries',
    image: '/images/red.jpg',
    emoji: '🔴',
    difficulty: 'easy',
  },
  {
    id: '5',
    word: 'book',
    japanese: 'ほん',
    category: 'school',
    hint: 'You read this to learn',
    image: '/images/book.jpg',
    emoji: '📚',
    difficulty: 'easy',
  },
  // Medium words - 5-6 letters
  {
    id: '6',
    word: 'apple',
    japanese: 'りんご',
    category: 'food',
    hint: 'A red or green fruit',
    image: '/images/apple.jpg',
    emoji: '🍎',
    difficulty: 'medium',
  },
  {
    id: '7',
    word: 'water',
    japanese: 'みず',
    category: 'nature',
    hint: 'Clear liquid we drink',
    image: '/images/water.jpg',
    emoji: '💧',
    difficulty: 'medium',
  },
  {
    id: '8',
    word: 'house',
    japanese: 'いえ',
    category: 'family',
    hint: 'Where families live',
    image: '/images/house.jpg',
    emoji: '🏠',
    difficulty: 'medium',
  },
  {
    id: '9',
    word: 'happy',
    japanese: 'うれしい',
    category: 'feelings',
    hint: 'How you feel when something good happens',
    image: '/images/happy.jpg',
    emoji: '😊',
    difficulty: 'medium',
  },
  {
    id: '10',
    word: 'flower',
    japanese: 'はな',
    category: 'nature',
    hint: 'Beautiful thing that grows in gardens',
    image: '/images/flower.jpg',
    emoji: '🌸',
    difficulty: 'medium',
  },
  {
    id: '11',
    word: 'school',
    japanese: 'がっこう',
    category: 'school',
    hint: 'Place where children learn',
    image: '/images/school.jpg',
    emoji: '🏫',
    difficulty: 'medium',
  },
  {
    id: '12',
    word: 'friend',
    japanese: 'ともだち',
    category: 'family',
    hint: 'Someone you like to play with',
    image: '/images/friend.jpg',
    emoji: '👫',
    difficulty: 'medium',
  },
  // Hard words - 7+ letters
  {
    id: '13',
    word: 'rainbow',
    japanese: 'にじ',
    category: 'nature',
    hint: 'Colorful arc in the sky after rain',
    image: '/images/rainbow.jpg',
    emoji: '🌈',
    difficulty: 'hard',
  },
  {
    id: '14',
    word: 'birthday',
    japanese: 'たんじょうび',
    category: 'celebrations',
    hint: 'Special day when you celebrate getting older',
    image: '/images/birthday.jpg',
    emoji: '🎂',
    difficulty: 'hard',
  },
  {
    id: '15',
    word: 'elephant',
    japanese: 'ぞう',
    category: 'animals',
    hint: 'Large gray animal with a long trunk',
    image: '/images/elephant.jpg',
    emoji: '🐘',
    difficulty: 'hard',
  },
  {
    id: '16',
    word: 'computer',
    japanese: 'コンピューター',
    category: 'technology',
    hint: 'Machine for typing and playing games',
    image: '/images/computer.jpg',
    emoji: '💻',
    difficulty: 'hard',
  },
  {
    id: '17',
    word: 'chocolate',
    japanese: 'チョコレート',
    category: 'food',
    hint: 'Sweet brown treat',
    image: '/images/chocolate.jpg',
    emoji: '🍫',
    difficulty: 'hard',
  },
  {
    id: '18',
    word: 'butterfly',
    japanese: 'ちょうちょう',
    category: 'animals',
    hint: 'Beautiful insect with colorful wings',
    image: '/images/butterfly.jpg',
    emoji: '🦋',
    difficulty: 'hard',
  },
  {
    id: '19',
    word: 'playground',
    japanese: 'こうえん',
    category: 'school',
    hint: 'Place where children play outside',
    image: '/images/playground.jpg',
    emoji: '🛝',
    difficulty: 'hard',
  },
  {
    id: '20',
    word: 'breakfast',
    japanese: 'あさごはん',
    category: 'food',
    hint: 'First meal of the day',
    image: '/images/breakfast.jpg',
    emoji: '🍳',
    difficulty: 'hard',
  },
];

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
  return spellingWords.filter((word) => word.difficulty === difficulty);
}

/**
 * カテゴリー別のフィルタリング関数
 */
export function getSpellingWordsByCategory(category: string): SpellingWord[] {
  if (category === 'all') {
    return spellingWords;
  }
  return spellingWords.filter((word) => word.category === category);
}

/**
 * 利用可能なカテゴリーの取得
 */
export function getSpellingCategories(): string[] {
  const categories = Array.from(new Set(spellingWords.map((word) => word.category)));
  return ['all', ...categories];
}
