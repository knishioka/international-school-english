import type { Sentence } from '@/types/vocabulary';

/**
 * 文章練習用のセンテンスデータ
 * Sentences for sentence practice game
 */
export const sentences: Sentence[] = [
  // Daily Life - 日常生活
  {
    id: '1',
    english: 'I eat breakfast every morning.',
    japanese: 'わたしは まいあさ あさごはんを たべます。',
    jaKanji: {
      1: 'わたしは まいあさ あさごはんを たべます。',
      2: 'わたしは 毎朝 あさごはんを 食べます。',
      3: 'わたしは 毎朝 朝ごはんを 食べます。',
      4: 'わたしは 毎朝 朝ご飯を 食べます。',
      5: 'わたしは 毎朝 朝ご飯を 食べます。',
      6: '私は 毎朝 朝ご飯を 食べます。',
    },
    words: ['I', 'eat', 'breakfast', 'every', 'morning'],
    emoji: '🍳',
    category: 'daily',
  },
  {
    id: '2',
    english: 'My mother makes delicious cookies.',
    japanese: 'おかあさんは おいしい クッキーを つくります。',
    jaKanji: {
      1: 'おかあさんは おいしい クッキーを つくります。',
      2: 'お母さんは おいしい クッキーを 作ります。',
      3: 'お母さんは 美味しい クッキーを 作ります。',
      4: 'お母さんは 美味しい クッキーを 作ります。',
      5: 'お母さんは 美味しい クッキーを 作ります。',
      6: 'お母さんは 美味しい クッキーを 作ります。',
    },
    words: ['My', 'mother', 'makes', 'delicious', 'cookies'],
    emoji: '🍪',
    category: 'daily',
  },
  {
    id: '3',
    english: 'I brush my teeth before bed.',
    japanese: 'わたしは ねるまえに はを みがきます。',
    jaKanji: {
      1: 'わたしは ねるまえに はを みがきます。',
      2: 'わたしは ねる前に 歯を みがきます。',
      3: 'わたしは 寝る前に 歯を みがきます。',
      4: 'わたしは 寝る前に 歯を みがきます。',
      5: 'わたしは 寝る前に 歯を みがきます。',
      6: '私は 寝る前に 歯を 磨きます。',
    },
    words: ['I', 'brush', 'my', 'teeth', 'before', 'bed'],
    emoji: '🪥',
    category: 'daily',
  },
  {
    id: '4',
    english: 'We play games after school.',
    japanese: 'わたしたちは がっこうのあとで ゲームを します。',
    jaKanji: {
      1: 'わたしたちは 学校のあとで ゲームを します。',
      2: 'わたしたちは 学校の後で ゲームを します。',
      3: 'わたしたちは 学校の後で ゲームを します。',
      4: 'わたしたちは 学校の後で ゲームを します。',
      5: 'わたしたちは 学校の後で ゲームを します。',
      6: '私たちは 学校の後で ゲームを します。',
    },
    words: ['We', 'play', 'games', 'after', 'school'],
    emoji: '🎮',
    category: 'daily',
  },
  // School - 学校
  {
    id: '5',
    english: 'I study English at school every day.',
    japanese: 'わたしは まいにち がっこうで えいごを べんきょうします。',
    jaKanji: {
      1: 'わたしは まい日 学校で えいごを べんきょうします。',
      2: 'わたしは 毎日 学校で えいごを べんきょうします。',
      3: 'わたしは 毎日 学校で えいごを 勉強します。',
      4: 'わたしは 毎日 学校で 英語を 勉強します。',
      5: 'わたしは 毎日 学校で 英語を 勉強します。',
      6: '私は 毎日 学校で 英語を 勉強します。',
    },
    words: ['I', 'study', 'English', 'at', 'school', 'every', 'day'],
    emoji: '📝',
    category: 'school',
  },
  {
    id: '6',
    english: 'My teacher is very kind and helpful.',
    japanese: 'せんせいは とても やさしくて たすけてくれます。',
    jaKanji: {
      1: '先生は とても やさしくて たすけてくれます。',
      2: '先生は とても やさしくて たすけてくれます。',
      3: '先生は とても やさしくて 助けてくれます。',
      4: '先生は とても やさしくて 助けてくれます。',
      5: '先生は とても やさしくて 助けてくれます。',
      6: '先生は とても 優しくて 助けてくれます。',
    },
    words: ['My', 'teacher', 'is', 'very', 'kind', 'and', 'helpful'],
    emoji: '👩‍🏫',
    category: 'school',
  },
  {
    id: '7',
    english: 'We read books in the library.',
    japanese: 'わたしたちは としょかんで ほんを よみます。',
    jaKanji: {
      1: 'わたしたちは 図書かんで ほんを よみます。',
      2: 'わたしたちは 図書館で ほんを よみます。',
      3: 'わたしたちは 図書館で 本を よみます。',
      4: 'わたしたちは 図書館で 本を 読みます。',
      5: 'わたしたちは 図書館で 本を 読みます。',
      6: '私たちは 図書館で 本を 読みます。',
    },
    words: ['We', 'read', 'books', 'in', 'the', 'library'],
    emoji: '📚',
    category: 'school',
  },
  {
    id: '8',
    english: 'I like math because it is fun.',
    japanese: 'さんすうは たのしいので すきです。',
    jaKanji: {
      1: 'さんすうは 楽しいので すきです。',
      2: '算数は 楽しいので すきです。',
      3: '算数は 楽しいので 好きです。',
      4: '算数は 楽しいので 好きです。',
      5: '算数は 楽しいので 好きです。',
      6: '算数は 楽しいので 好きです。',
    },
    words: ['I', 'like', 'math', 'because', 'it', 'is', 'fun'],
    emoji: '🔢',
    category: 'school',
  },
  // Nature - 自然
  {
    id: '9',
    english: 'The sun shines brightly in the sky.',
    japanese: 'たいようが そらで あかるく かがやいています。',
    jaKanji: {
      1: 'たいようが そらで あかるく かがやいています。',
      2: '太ようが そらで あかるく かがやいています。',
      3: '太陽が 空で 明るく かがやいています。',
      4: '太陽が 空で 明るく 輝いています。',
      5: '太陽が 空で 明るく 輝いています。',
      6: '太陽が 空で 明るく 輝いています。',
    },
    words: ['The', 'sun', 'shines', 'brightly', 'in', 'the', 'sky'],
    emoji: '☀️',
    category: 'nature',
  },
  {
    id: '10',
    english: 'Birds sing beautiful songs in the morning.',
    japanese: 'とりたちは あさに うつくしい うたを うたいます。',
    jaKanji: {
      1: 'とりたちは あさに うつくしい うたを うたいます。',
      2: 'とりたちは 朝に うつくしい うたを うたいます。',
      3: '鳥たちは 朝に 美しい うたを うたいます。',
      4: '鳥たちは 朝に 美しい 歌を 歌います。',
      5: '鳥たちは 朝に 美しい 歌を 歌います。',
      6: '鳥たちは 朝に 美しい 歌を 歌います。',
    },
    words: ['Birds', 'sing', 'beautiful', 'songs', 'in', 'the', 'morning'],
    emoji: '🐦',
    category: 'nature',
  },
  // Family - 家族
  {
    id: '11',
    english: 'My family loves to eat dinner together.',
    japanese: 'かぞくは いっしょに ばんごはんを たべるのが すきです。',
    jaKanji: {
      1: 'かぞくは いっしょに ばんごはんを たべるのが すきです。',
      2: '家ぞくは いっしょに ばんごはんを たべるのが すきです。',
      3: '家族は いっしょに ばんごはんを 食べるのが 好きです。',
      4: '家族は 一緒に 晩ごはんを 食べるのが 好きです。',
      5: '家族は 一緒に 晩ご飯を 食べるのが 好きです。',
      6: '家族は 一緒に 晩ご飯を 食べるのが 好きです。',
    },
    words: ['My', 'family', 'loves', 'to', 'eat', 'dinner', 'together'],
    emoji: '👨‍👩‍👧‍👦',
    category: 'family',
  },
  {
    id: '12',
    english: 'I help my father in the garden.',
    japanese: 'わたしは にわで おとうさんを てつだいます。',
    jaKanji: {
      1: 'わたしは にわで おとうさんを てつだいます。',
      2: 'わたしは にわで お父さんを てつだいます。',
      3: 'わたしは 庭で お父さんを 手伝います。',
      4: 'わたしは 庭で お父さんを 手伝います。',
      5: 'わたしは 庭で お父さんを 手伝います。',
      6: '私は 庭で お父さんを 手伝います。',
    },
    words: ['I', 'help', 'my', 'father', 'in', 'the', 'garden'],
    emoji: '👨‍🌾',
    category: 'family',
  },
];

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
  { id: 'animals', name: { en: 'Animals', ja: 'どうぶつ' }, emoji: '🐱', color: 'bg-purple-100' },
  { id: 'hobbies', name: { en: 'Hobbies', ja: 'しゅみ' }, emoji: '🎨', color: 'bg-pink-100' },
  { id: 'weather', name: { en: 'Weather', ja: 'てんき' }, emoji: '🌤️', color: 'bg-indigo-100' },
  { id: 'holidays', name: { en: 'Holidays', ja: 'きゅうじつ' }, emoji: '🎊', color: 'bg-gray-100' },
];

/**
 * カテゴリー別のフィルタリング関数
 */
export function getSentencesByCategory(category: string): Sentence[] {
  if (category === 'all') {
    return sentences;
  }
  return sentences.filter((sentence) => sentence.category === category);
}

/**
 * 利用可能なカテゴリーの取得
 */
export function getSentenceCategories(): string[] {
  const categories = Array.from(new Set(sentences.map((sentence) => sentence.category)));
  return ['all', ...categories];
}
